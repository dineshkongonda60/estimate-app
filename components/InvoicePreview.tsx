"use client";

export default function InvoicePreview(props: any) {
  const generatePDF = async () => {
    const element = document.getElementById("invoice");
    if (!element) return;

    const html2pdf = (await import("html2pdf.js")).default;

    const customerName = props.customer
      ? props.customer.replace(/\s+/g, "_")
      : "Invoice";

    const fileName = `${customerName}_${props.type}.pdf`;

    html2pdf()
      .set({
        filename: fileName,
        margin: 0,
        jsPDF: {
          unit: "mm",
          format: "a4",
          orientation: "portrait",
        },
        html2canvas: {
          scale: 2,
        },
        pagebreak: {
          mode: ["avoid-all", "css", "legacy"],
        },
      } as any)
      .from(element)
      .save();
  };

  return (
    <div>
      {/* ✅ DOWNLOAD BUTTON */}
      <button
        onClick={generatePDF}
        className="bg-red-500 text-white px-4 py-2 mb-4 rounded"
      >
        Download PDF
      </button>

      {/* ✅ INVOICE */}
      <div
        id="invoice"
        style={{
          width: "100%",
          maxWidth: "210mm",
          margin: "0 auto",
          padding: "8mm",
          background: "white",
          fontFamily: "Arial",
          fontSize: "12px",
          color: "#000",
          fontWeight: 500,
          WebkitFontSmoothing: "antialiased",
        }}
      >

        {/* ✅ HEADER */}
        <div
          style={{
            display: "flex",
            background: "#bcd0e5",
            padding: "10px",
            alignItems: "center",
          }}
        >
          <div style={{ width: "100px", textAlign: "center" }}>
            <img src="/logo.png" style={{ width: "80px", height: "80px" }} />
          </div>

          <div style={{ textAlign: "center", flex: 1 }}>
            <h1 style={{ margin: 0, fontWeight: "bold", fontSize: "20px" }}>
              Mallaiah Kongonda
            </h1>
            <p style={{ margin: 0 }}>
              All Types of Civil Work & Repairing Construction
            </p>
            <p style={{ margin: 0 }}>
              303/A Deepti Apartment, Near Gulmohar Apt, Virar(E)
            </p>
            <p style={{ margin: 0 }}>
              Mobile: 9172056346, 9892544868
            </p>
          </div>
        </div>

        {/* ✅ DIVIDER */}
        <div style={{ borderBottom: "1px solid #444" }}></div>

        {/* ✅ CUSTOMER + DATE */}
        <div style={{ display: "flex" }}>
          <div style={{ flex: 2, padding: "10px", lineHeight: "1.5" }}>
            <strong>To,</strong>

            <p style={{ margin: "5px 0", fontWeight: 600 }}>
              {props.customer}
            </p>

            <p style={{ margin: 0, whiteSpace: "pre-line" }}>
              {props.address}
            </p>
          </div>

          <div style={{ flex: 1, padding: "10px", textAlign: "right" }}>
            <p>
              <strong>Date:</strong> {props.date}
            </p>

           
          </div>
        </div>

        {/* ✅ TITLE */}
        <div
          style={{
            textAlign: "center",
            padding: "6px",
            fontWeight: "bold",
            borderBottom: "1px solid #444",
          }}
        >
          {props.type}
        </div>

        {/* ✅ TABLE */}
        <table
          style={{
            width: "100%",
            borderCollapse: "collapse",
            tableLayout: "fixed",
            marginTop: "5px",
          }}
        >
          <thead>
            <tr style={{ background: "#e5e5e5" }}>
              <th style={{ ...cellCenter, width: "10%" }}>Sr.No</th>
              <th style={{ ...cell, width: "40%" }}>Particulars</th>
              <th style={{ ...cellCenter, width: "15%" }}>Sq.Ft</th>
              <th style={{ ...cellCenter, width: "15%" }}>Rate</th>
              <th style={{ ...cellCenter, width: "20%" }}>Amount</th>
            </tr>
          </thead>

          <tbody>
            {props.items.map((item: any, i: number) => (
              <tr key={i}>
                <td style={cellCenter}>{i + 1}</td>
                <td style={cell}>{item.desc}</td>

                <td style={cellCenter}>
                  {item.isLumpsum ? "Lumpsum" : item.sqft || ""}
                </td>

                <td style={cellCenter}>
                  {item.isLumpsum ? "" : item.rate || ""}
                </td>

                <td style={cellCenter}>{item.amount || ""}</td>
              </tr>
            ))}

            {/* EMPTY ROW */}
            <tr>
              <td style={cell}></td>
              <td style={cell}></td>
              <td style={cell}></td>
              <td style={cell}></td>
              <td style={cell}></td>
            </tr>
          </tbody>
        </table>

        {/* ✅ TOTALS */}
        <div
          style={{
            width: "40%",
            marginLeft: "auto",
            marginTop: "10px",
            border: "1px solid #666",
          }}
        >
          <div style={row}>
            <span>Total</span>
            <span>{props.total}</span>
          </div>

          <div style={row}>
            <span>Advance</span>
            <span>{props.advance}</span>
          </div>

          <div style={{ ...row, fontWeight: "bold", borderTop: "1px solid #666" }}>
            <span>Grand Total</span>
            <span>{props.grandTotal}</span>
          </div>
        </div>

        {/* ✅ NOTES */}
        <div
          style={{
            marginTop: "20px",
            borderTop: "1px solid #444",
            paddingTop: "10px",
          }}
        >
          <strong>Note:</strong>

          <p style={{ marginTop: "5px", whiteSpace: "pre-line" }}>
            {props.notes}
          </p>
        </div>

      </div>
    </div>
  );
}

/* ✅ COMMON STYLES */
const cell = {
  border: "1px solid #666",
  padding: "6px",
  height: "28px",
  color: "#000",
};

const cellCenter = {
  ...cell,
  textAlign: "center" as const,
};

const row = {
  display: "flex",
  justifyContent: "space-between",
  padding: "6px",
};