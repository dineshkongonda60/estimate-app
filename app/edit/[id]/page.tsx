"use client";

import { useEffect, useState } from "react";
import { useParams } from "next/navigation";
import InvoiceForm from "../../../components/InvoiceForm";

export default function EditInvoice() {
  const params = useParams();
  const id = params.id;

  const [invoice, setInvoice] = useState<any>(null);

  useEffect(() => {
    fetch("/api/invoice")
      .then((res) => res.json())
      .then((data) => {
        const found = data.find((item: any) => item.id == id);
        setInvoice(found?.data);
      });
  }, [id]);

  if (!invoice) return <p className="p-5">Loading...</p>;

  return (
    <div className="p-5">
      <h1 className="text-xl font-bold mb-3">Edit Invoice</h1>
      <InvoiceForm initialData={invoice} invoiceId={id} />
    </div>
  );
}