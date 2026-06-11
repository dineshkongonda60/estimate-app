import { sql } from "@vercel/postgres";
import { NextResponse } from "next/server";

// ✅ SAVE INVOICE
export async function POST(req: Request) {
  const body = await req.json();

  const result = await sql`
    INSERT INTO invoices (data)
    VALUES (${JSON.stringify(body)})
    RETURNING *;
  `;

  return NextResponse.json(result.rows[0]);
}

// ✅ GET ALL INVOICES
export async function GET() {
  const result = await sql`
    SELECT * FROM invoices ORDER BY id DESC;
  `;

  return NextResponse.json(result.rows);
}
