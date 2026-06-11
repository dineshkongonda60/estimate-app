"use client";

import { useEffect, useState } from "react";
import Link from "next/link";

export default function InvoiceList() {
  const [invoices, setInvoices] = useState<any[]>([]);

  useEffect(() => {
    fetch("/api/invoice")
      .then((res) => res.json())
      .then((data) => setInvoices(data));
  }, []);

  return (
    <div className="p-6">
      <h1 className="text-2xl font-bold mb-4">Saved Invoices</h1>

      {invoices.length === 0 && <p>No invoices found</p>}

      {invoices.map((inv) => (
        <div key={inv.id} className="border p-3 mb-3 shadow">
          <p>
            <strong>{inv.data.customer}</strong> — {inv.data.type}
          </p>
          <p>Date: {inv.data.date}</p>

          <Link href={`/edit/${inv.id}`}>
            <button className="bg-blue-500 text-white px-3 py-1 mt-2">
              Edit
            </button>
          </Link>
        </div>
      ))}
    </div>
  );
}