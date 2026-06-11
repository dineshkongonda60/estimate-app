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
  const [type, setType] = useState<string>(
    initialData?.type || "Estimate"
  );
  const [customer, setCustomer] = useState<string>(
    initialData?.customer || ""
  );
  const [address, setAddress] = useState<string>(
    initialData?.address || ""
  );
  const [date, setDate] = useState<string>(
    initialData?.date || ""
  );
  const [advance, setAdvance] = useState<number>(
    initialData?.advance || 0
  );
  const [notes, setNotes] = useState<string>(
    initialData?.notes || ""
  );

  /* ✅ IMPORTANT: TYPE FIX */
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

  /* ✅ TOTAL CALCULATIONS */
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

    try {
      let res;

      if (invoiceId) {
        // ✅ UPDATE
        res = await fetch("/api/invoice", {
          method: "PUT",
          headers: {
            "Content-Type": "application/json",
          },
          body: JSON.stringify({
            id: invoiceId,
            data: payload,
          }),
        });
      } else {
        // ✅ CREATE
        res = await fetch("/api/invoice", {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
          },
          body: JSON.stringify(payload),
        });
      }

      if (res.ok) {
        alert(invoiceId ? "✅ Updated successfully" : "✅ Saved successfully");
      } else {
        alert("❌ Error saving");
      }
    } catch (error) {
      console.error(error);
      alert("❌ Request failed");
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

        // ✅ Auto calculation
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

  /* ✅ UI */
  return (
    <div className="grid grid-cols-1 md:grid-cols-2 gap-4 p-3">
      {/* ✅ LEFT SIDE FORM */}
      <div className="bg-white p-4 border shadow">
        
        <Link href="/invoices">
          <button className="bg-gray-800 text-white px-4 py-2 mb-4">
            View Invoices
          </button>
        </Link>

        <h2 className="text-xl font-bold mb-4">Invoice Form</h2>

        {/* TYPE */}
        <div className="mb-3">
          <label>Type</label>
          <select
            className="border p-2 w-full"
            value={type}
            onChange={(e) => setType(e.target.value)}
          >
            <option>Estimate</option>
            <option>Bill</option>
          </select>
        </div>

        {/* CUSTOMER */}
        <div className="mb-3">
          <label>Customer Name</label>
          <input
            className="border p-2 w-full"
            value={customer}
            onChange={(e) => setCustomer(e.target.value)}
          />
        </div>

        {/* ADDRESS */}
        <div className="mb-3">
          <label>Address</label>
          <textarea
            className="border p-2 w-full"
            value={address}
            onChange={(e) => setAddress(e.target.value)}
          />
        </div>

        {/* DATE */}
        <div className="mb-3">
          <label>Date</label>
          <input
            type="date"
            className="border p-2 w-full"
            value={date}
            onChange={(e) => setDate(e.target.value)}
          />
        </div>

        {/* ✅ ITEMS */}
        <h3 className="font-semibold mt-4">Items</h3>
        <div className="overflow-x-auto">
        <table className="min-w-[600px] w-full border mt-2 text-sm">
          <thead>
            <tr className="bg-gray-200">
                <th className="border p-1 min-w-[150px]">Desc</th>
                <th className="border p-1 min-w-[80px]">SqFt</th>
                <th className="border p-1 min-w-[80px]">Rate</th>
                <th className="border p-1 min-w-[100px]">Amount</th>
                <th className="border p-1 min-w-[60px]">Lump</th>
            </tr>
          </thead>

          <tbody>
            {items.map((item: Item) => (
              <tr key={item.id}>
                <td className="border">
                  <input
                    className="w-full p-2 text-sm"
                    value={item.desc}
                    onChange={(e) =>
                      updateItem(item.id, "desc", e.target.value)
                    }
                  />
                </td>

                <td className="border">
                  <input
                    type="number"
                    disabled={item.isLumpsum}
                    className="w-full p-2 text-sm"
                    value={item.sqft}
                    onChange={(e) =>
                      updateItem(item.id, "sqft", Number(e.target.value))
                    }
                  />
                </td>

                <td className="border">
                  <input
                    type="number"
                    disabled={item.isLumpsum}
                    className="w-full p-2 text-sm"
                    value={item.rate}
                    onChange={(e) =>
                      updateItem(item.id, "rate", Number(e.target.value))
                    }
                  />
                </td>

                <td className="border">
                  <input
                    type="number"
                    className="w-full p-2 text-sm"
                    value={item.amount}
                    onChange={(e) =>
                      updateItem(item.id, "amount", Number(e.target.value))
                    }
                  />
                </td>

                <td className="border text-center">
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
          className="mt-2 bg-blue-500 text-white px-4 py-2 w-full md:w-auto"
        >
          + Add Item
        </button>

        {/* ADVANCE */}
        <div className="mt-4">
          <label>Advance</label>
          <input
            type="number"
            className="border p-2 w-full"
            value={advance}
            onChange={(e) => setAdvance(Number(e.target.value))}
          />
        </div>

        {/* NOTES */}
        <div className="mt-4">
          <label>Notes</label>
          <textarea
            className="border p-2 w-full"
            rows={3}
            value={notes}
            onChange={(e) => setNotes(e.target.value)}
          />
        </div>

        {/* SAVE BUTTON */}
        <button
          onClick={saveInvoice}
          className="bg-green-600 text-white px-4 py-2 mt-3"
        >
          {invoiceId ? "Update Invoice" : "Save Invoice"}
        </button>
      </div>

      {/* ✅ PREVIEW */}
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
  );
}