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
  <div className="min-h-screen bg-gray-100 p-3 md:p-6">

    {/* ✅ HEADER */}
    <div className="flex justify-between items-center mb-4">
      <h1 className="text-xl md:text-2xl font-semibold">
        {invoiceId ? "Edit Invoice" : "Create Invoice"}
      </h1>

      <Link href="/invoices">
        <button className="bg-gray-800 text-white px-4 py-2 rounded-lg text-sm">
          View Invoices
        </button>
      </Link>
    </div>

    {/* ✅ LAYOUT */}
    <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">

      {/* ✅ FORM CARD */}
      <div className="bg-white rounded-xl shadow-sm border p-4 md:p-6 space-y-4">

        {/* TYPE + DATE */}
        <div className="grid grid-cols-2 gap-3">
          <div>
            <label className="text-sm text-gray-600">Type</label>
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
            <label className="text-sm text-gray-600">Date</label>
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
          <label className="text-sm text-gray-600">Customer Name</label>
          <input
            className="border mt-1 p-2 w-full rounded-lg"
            value={customer}
            onChange={(e) => setCustomer(e.target.value)}
          />
        </div>

        {/* ADDRESS */}
        <div>
          <label className="text-sm text-gray-600">Address</label>
          <textarea
            className="border mt-1 p-2 w-full rounded-lg"
            value={address}
            onChange={(e) => setAddress(e.target.value)}
          />
        </div>

        {/* ✅ ITEMS */}
        <div>
          <h3 className="font-medium mb-2">Items</h3>

          <div className="overflow-x-auto">
            <table className="min-w-[600px] w-full text-sm border rounded-lg overflow-hidden">
              <thead className="bg-gray-100">
                <tr>
                  <th className="p-2 text-left">Desc</th>
                  <th className="p-2">SqFt</th>
                  <th className="p-2">Rate</th>
                  <th className="p-2">Amount</th>
                  <th className="p-2">Lump</th>
                </tr>
              </thead>

              <tbody>
                {items.map((item: Item) => (
                  <tr key={item.id} className="border-t">
                    <td>
                      <input
                        className="w-full p-2 outline-none"
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
                        className="w-full p-2 text-center outline-none"
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
                        className="w-full p-2 text-center outline-none"
                        value={item.rate}
                        onChange={(e) =>
                          updateItem(item.id, "rate", Number(e.target.value))
                        }
                      />
                    </td>

                    <td>
                      <input
                        type="number"
                        className="w-full p-2 text-center outline-none"
                        value={item.amount}
                        onChange={(e) =>
                          updateItem(item.id, "amount", Number(e.target.value))
                        }
                      />
                    </td>

                    <td className="text-center">
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
            className="mt-3 bg-blue-500 text-white px-4 py-2 rounded-lg w-full md:w-auto"
          >
            + Add Item
          </button>
        </div>

        {/* ✅ TOTAL SECTION */}
        <div className="grid grid-cols-2 gap-4">
          <div>
            <label className="text-sm text-gray-600">Advance</label>
            <input
              type="number"
              className="border mt-1 p-2 w-full rounded-lg"
              value={advance}
              onChange={(e) => setAdvance(Number(e.target.value))}
            />
          </div>

          <div className="flex flex-col justify-end text-right">
            <p className="text-sm">Total: ₹{total}</p>
            <p className="text-sm">Advance: ₹{advance}</p>
            <p className="font-semibold">Grand: ₹{grandTotal}</p>
          </div>
        </div>

        {/* NOTES */}
        <div>
          <label className="text-sm text-gray-600">Notes</label>
          <textarea
            className="border mt-1 p-2 w-full rounded-lg"
            rows={3}
            value={notes}
            onChange={(e) => setNotes(e.target.value)}
          />
        </div>

        {/* ✅ ACTION BUTTON */}
        <button
          onClick={saveInvoice}
          className="bg-green-600 text-white py-3 w-full rounded-lg font-medium"
        >
          {invoiceId ? "Update Invoice" : "Save Invoice"}
        </button>
      </div>

      {/* ✅ PREVIEW */}
      <div className="bg-white rounded-xl border p-3 overflow-x-auto">
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