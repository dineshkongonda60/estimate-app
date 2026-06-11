"use client";

import { useState } from "react";
import InvoicePreview from "./InvoicePreview";
import Link from "next/link";

/* ✅ TYPES */
type Item = {
  id: string;
  desc: string;
  sqft: number;
  rate: number;
  amount: number;
  isLumpsum: boolean;
};

type Props = {
  initialData?: any;
  invoiceId?: string;
};

/* ✅ COMPONENT */
export default function InvoiceForm({ initialData, invoiceId }: Props) {
  const [activeTab, setActiveTab] = useState<"form" | "preview">("form");

  const [type, setType] = useState(initialData?.type || "Estimate");
  const [customer, setCustomer] = useState(initialData?.customer || "");
  const [address, setAddress] = useState(initialData?.address || "");
  const [date, setDate] = useState(initialData?.date || "");
  const [advance, setAdvance] = useState(initialData?.advance || 0);
  const [notes, setNotes] = useState(initialData?.notes || "");

  const [items, setItems] = useState<Item[]>(
    initialData?.items || [
      {
        id: "1",
        desc: "",
        sqft: 0,
        rate: 0,
        amount: 0,
        isLumpsum: false,
      },
    ]
  );

  /* ✅ TOTALS */
  const total = items.reduce((sum, i) => sum + Number(i.amount || 0), 0);
  const grandTotal = total - advance;

  /* ✅ SAVE / UPDATE */
  const saveInvoice = async () => {
    const payload = {
      type,
      customer,
      address,
      date,
      items,
      advance,
      total,
      grandTotal,
      notes,
    };

    let res;

    if (invoiceId) {
      res = await fetch("/api/invoice", {
        method: "PUT",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ id: invoiceId, data: payload }),
      });
    } else {
      res = await fetch("/api/invoice", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(payload),
      });
    }

    if (res.ok) {
      alert(invoiceId ? "✅ Updated!" : "✅ Saved!");
      setActiveTab("preview"); // ✅ auto switch
    } else {
      alert("❌ Error");
    }
  };

  /* ✅ ADD ITEM */
  const addItem = () => {
    setItems([
      ...items,
      {
        id: Math.random().toString(),
        desc: "",
        sqft: 0,
        rate: 0,
        amount: 0,
        isLumpsum: false,
      },
    ]);
  };

  /* ✅ UPDATE ITEM */
  const updateItem = (id: string, field: keyof Item, value: any) => {
    const updated = items.map((item: Item) => {
      if (item.id === id) {
        const newItem = { ...item, [field]: value };

        if (!newItem.isLumpsum) {
          newItem.amount = newItem.sqft * newItem.rate;
        }

        return newItem;
      }
      return item;
    });

    setItems(updated);
  };

  /* ✅ TOGGLE LUMPSUM */
  const toggleLumpsum = (id: string) => {
    const updated = items.map((item: Item) => {
      if (item.id === id) {
        return {
          ...item,
          isLumpsum: !item.isLumpsum,
          sqft: 0,
          rate: 0,
        };
      }
      return item;
    });

    setItems(updated);
  };

  /* ✅ FORM UI */
  const FormUI = (
    <div className="bg-white rounded-xl border p-4 space-y-4">

      <Link href="/invoices">
        <button className="bg-gray-800 text-white px-4 py-2 rounded-lg text-sm w-full">
          View Invoices
        </button>
      </Link>

      {/* TYPE & DATE */}
      <div className="grid grid-cols-2 gap-3">
        <div>
          <label className="text-sm">Type</label>
          <select
            className="border mt-1 p-2 w-full rounded-lg"
            value={type}
            onChange={(e) => setType(e.target.value)}
          >
            <option>Estimate</option>
            <option>Bill</option>
          </select>
        </div>

        <div>
          <label className="text-sm">Date</label>
          <input
            type="date"
            className="border mt-1 p-2 w-full rounded-lg"
            value={date}
            onChange={(e) => setDate(e.target.value)}
          />
        </div>
      </div>

      {/* CUSTOMER */}
      <div>
        <label className="text-sm">Customer</label>
        <input
          className="border mt-1 p-2 w-full rounded-lg"
          value={customer}
          onChange={(e) => setCustomer(e.target.value)}
        />
      </div>

      {/* ADDRESS */}
      <textarea
        className="border p-2 w-full rounded-lg"
        value={address}
        onChange={(e) => setAddress(e.target.value)}
      />

      {/* TABLE */}
      <div className="overflow-x-auto">
        <table className="min-w-[600px] w-full text-sm border rounded-lg">
          <thead className="bg-gray-100">
            <tr>
              <th>Desc</th>
              <th>SqFt</th>
              <th>Rate</th>
              <th>Amount</th>
              <th>Lump</th>
            </tr>
          </thead>

          <tbody>
            {items.map((item: Item) => (
              <tr key={item.id}>
                <td>
                  <input
                    className="w-full p-2"
                    value={item.desc}
                    onChange={(e) =>
                      updateItem(item.id, "desc", e.target.value)
                    }
                  />
                </td>

                <td>
                  <input
                    type="number"
                    disabled={item.isLumpsum}
                    value={item.sqft}
                    onChange={(e) =>
                      updateItem(item.id, "sqft", Number(e.target.value))
                    }
                  />
                </td>

                <td>
                  <input
                    type="number"
                    disabled={item.isLumpsum}
                    value={item.rate}
                    onChange={(e) =>
                      updateItem(item.id, "rate", Number(e.target.value))
                    }
                  />
                </td>

                <td>
                  <input
                    type="number"
                    value={item.amount}
                    onChange={(e) =>
                      updateItem(item.id, "amount", Number(e.target.value))
                    }
                  />
                </td>

                <td>
                  <input
                    type="checkbox"
                    checked={item.isLumpsum}
                    onChange={() => toggleLumpsum(item.id)}
                  />
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>

      <button
        onClick={addItem}
        className="bg-blue-500 text-white px-4 py-2 rounded-lg w-full"
      >
        + Add Item
      </button>

      {/* TOTALS */}
      <div className="grid grid-cols-2 gap-4">
        <input
          type="number"
          value={advance}
          onChange={(e) => setAdvance(Number(e.target.value))}
          className="border p-2 rounded-lg"
          placeholder="Advance"
        />

        <div className="text-right">
          <p>Total: ₹{total}</p>
          <p>Grand: ₹{grandTotal}</p>
        </div>
      </div>

      {/* NOTES */}
      <textarea
        rows={3}
        value={notes}
        onChange={(e) => setNotes(e.target.value)}
        className="border p-2 rounded-lg"
        placeholder="Notes"
      />

      <button
        onClick={saveInvoice}
        className="bg-green-600 text-white py-3 rounded-lg w-full"
      >
        {invoiceId ? "Update Invoice" : "Save Invoice"}
      </button>
    </div>
  );

  /* ✅ MAIN UI */
  return (
    <div className="p-3 md:p-6 bg-gray-100 min-h-screen">

      {/* ✅ MOBILE TABS */}
      <div className="md:hidden mb-4 flex border rounded-lg overflow-hidden">
        <button
          onClick={() => setActiveTab("form")}
          className={`flex-1 py-2 ${
            activeTab === "form" ? "bg-blue-500 text-white" : "bg-gray-200"
          }`}
        >
          Form
        </button>

        <button
          onClick={() => setActiveTab("preview")}
          className={`flex-1 py-2 ${
            activeTab === "preview"
              ? "bg-blue-500 text-white"
              : "bg-gray-200"
          }`}
        >
          Preview
        </button>
      </div>

      {/* ✅ MOBILE VIEW */}
      <div className="md:hidden">
        {activeTab === "form" && FormUI}
        {activeTab === "preview" && (
          <InvoicePreview
            type={type}
            customer={customer}
            address={address}
            date={date}
            items={items}
            total={total}
            advance={advance}
            grandTotal={grandTotal}
            notes={notes}
          />
        )}
      </div>

      {/* ✅ DESKTOP VIEW */}
      <div className="hidden md:grid grid-cols-2 gap-6">
        {FormUI}

        <div className="bg-white border rounded-xl p-3">
          <InvoicePreview
            type={type}
            customer={customer}
            address={address}
            date={date}
            items={items}
            total={total}
            advance={advance}
            grandTotal={grandTotal}
            notes={notes}
          />
        </div>
      </div>
    </div>
  );
}