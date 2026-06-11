"use client";
import { useState } from "react";
import InvoicePreview from "./InvoicePreview";

type Item = {
  id: string;
  desc: string;
  sqft: number;
  rate: number;
  amount: number;
  isLumpsum: boolean;
};

export default function InvoiceForm() {
  const [type, setType] = useState("Estimate");
  const [customer, setCustomer] = useState("");
  const [address, setAddress] = useState("");
  const [date, setDate] = useState("2026-06-11");
  const [advance, setAdvance] = useState(0);
  const [notes, setNotes] = useState("");

  const [items, setItems] = useState<Item[]>([
    { id: "1", desc: "", sqft: 0, rate: 0, amount: 0, isLumpsum: false },
  ]);

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

  const updateItem = (id: string, field: keyof Item, value: any) => {
    const updated = items.map((item) => {
      if (item.id === id) {
        const newItem = { ...item, [field]: value };

        // ✅ Calculation logic
        if (!newItem.isLumpsum) {
          newItem.amount = newItem.sqft * newItem.rate;
        }

        return newItem;
      }
      return item;
    });

    setItems(updated);
  };

  const toggleLumpsum = (id: string) => {
    const updated = items.map((item) => {
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

  const total = items.reduce((sum, i) => sum + Number(i.amount || 0), 0);
  const grandTotal = total - advance;

  return (
    <div className="grid grid-cols-2 gap-6 p-4">

      {/* ✅ LEFT SIDE FORM */}
      <div className="bg-white p-4 border shadow">

        <h2 className="text-xl font-bold mb-4">Invoice Form</h2>

        {/* TYPE */}
        <div className="mb-3">
          <label className="block">Type</label>
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

        {/* ✅ ITEMS TABLE */}
        <h3 className="font-semibold mt-4">Items</h3>

        <table className="w-full border mt-2 text-sm">
          <thead>
            <tr className="bg-gray-200">
              <th className="border p-1">Desc</th>
              <th className="border p-1">SqFt</th>
              <th className="border p-1">Rate</th>
              <th className="border p-1">Amount</th>
              <th className="border p-1">Lump</th>
            </tr>
          </thead>

          <tbody>
            {items.map((item) => (
              <tr key={item.id}>
                <td className="border">
                  <input
                    className="w-full p-1"
                    value={item.desc}
                    onChange={(e) =>
                      updateItem(item.id, "desc", e.target.value)
                    }
                  />
                </td>

                {/* SqFt */}
                <td className="border">
                  <input
                    type="number"
                    disabled={item.isLumpsum}
                    className="w-full p-1"
                    value={item.sqft}
                    onChange={(e) =>
                      updateItem(item.id, "sqft", Number(e.target.value))
                    }
                  />
                </td>

                {/* Rate */}
                <td className="border">
                  <input
                    type="number"
                    disabled={item.isLumpsum}
                    className="w-full p-1"
                    value={item.rate}
                    onChange={(e) =>
                      updateItem(item.id, "rate", Number(e.target.value))
                    }
                  />
                </td>

                {/* Amount */}
                <td className="border">
                  <input
                    type="number"
                    className="w-full p-1"
                    value={item.amount}
                    onChange={(e) =>
                      updateItem(item.id, "amount", Number(e.target.value))
                    }
                  />
                </td>

                {/* Lumpsum toggle */}
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

        <button
          onClick={addItem}
          className="mt-2 bg-blue-500 text-white px-3 py-1"
        >
          + Add Item
        </button>

        {/* ADVANCE */}
        <div className="mt-4">
          <label>Advance</label>
          <input
            type="number"
            className="border p-2 w-full"
            onChange={(e) => setAdvance(Number(e.target.value))}
          />
        </div>
        {/* ✅ NOTES */}
        <div className="mt-4">
        <label>Notes</label>
        <textarea
            className="border p-2 w-full"
            rows={3}
            value={notes}
            onChange={(e) => setNotes(e.target.value)}
            placeholder="Enter notes (optional)"
        />
</div>
      </div>

      

      {/* ✅ RIGHT SIDE PREVIEW */}
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