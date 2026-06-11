"use client";

export default function InvoicePreview(props: any) {
  const generatePDF = async () => {
  const element = document.getElementById("invoice");
  if (!element) return;

  const html2pdf = (await import("html2pdf.js")).default;

  
 // ✅ Create dynamic file name
  const customerName = props.customer
    ? props.customer.replace(/\s+/g, "_")
    : "Invoice";

  const fileName = `${customerName}_${props.type}.pdf`;

  html2pdf()
    .set({
      filename: fileName,
      margin: 0,   // ✅ IMPORTANT
      jsPDF: {
        unit: "mm",
        format: "a4",
        orientation: "portrait",
      },
      html2canvas: {
        scale: 1.5,   // ✅ reduce from 2 → prevents overflow
      },
      pagebreak: {
        mode: ["avoid-all", "css", "legacy"],  // ✅ strong control
      },
    })
    .from(element)
    .save();
};

  return (
    <div>
      {/* ✅ PDF BUTTON */}
      <button
        onClick={generatePDF}
        className="bg-red-500 text-white px-4 py-2 mb-4"
      >
        Download PDF
      </button>

      {/* ✅ A4 CONTAINER */}
      <div
        id="invoice"
        style={{
            width: "210mm",
            height: "297mm",  // ✅ FIXED height (not minHeight)
            padding: "8mm",   // ✅ reduce padding
            boxSizing: "border-box",  // ✅ prevents overflow
            overflow: "hidden",       // ✅ stops extra page
            background: "white",
            fontFamily: "Arial",
            fontSize: "12px",

        }}
      >
        {/* ✅ HEADER */}
        <div
          style={{
            display: "flex",
            /*border: "1px solid black",*/
            background: "#bcd0e5",
            padding: "10px",
            alignItems: "center",
          }}
        >
          {/* ✅ LOGO */}
          <div style={{ width: "100px", textAlign: "center" }}>
            <img src="/logo.png" style={{ width: "100px", height:"100px" }} />
          </div>

          {/* ✅ COMPANY DETAILS */}
          <div style={{ textAlign: "center", flex: 1 }}>
            <h1 style={{ margin: 0, fontWeight:"bold", fontSize:"20px" }}>Mallaiah Kongonda</h1>
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

        {/* ✅ CUSTOMER + DATE */}
        <div style={{ }}>
          <div style={{ display: "flex" }}>
            <div style={{ flex: 2, padding: "10px" }}>
              <strong>To:</strong>
              <p style={{ margin: 0 }}>{props.customer}</p>
              <p style={{ margin: 0 }}>{props.address}</p>
            </div>

            <div style={{ flex: 1, padding: "10px", textAlign: "right" }}>
              <p>Date: {props.date}</p>
            </div>
          </div>
        </div>

        {/* ✅ TITLE */}
        <div
          style={{
            textAlign: "center",
            
            borderTop: "none",
            padding: "5px",
            fontWeight: "bold",
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
            border: "1px solid #888",
          }}
        >
          <thead>
            <tr style={{ background: "#e0e0e0" }}>
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

                {/* ✅ LUMPSUM LOGIC */}
                <td style={cellCenter}>
                  {item.isLumpsum ? "Lumpsum" : item.sqft || ""}
                </td>

                <td style={cellCenter}>
                  {item.isLumpsum ? "" : item.rate || ""}
                </td>

                <td style={cellCenter}>
                  {item.amount || ""}
                </td>
              </tr>
            ))}

            {/* ✅ EMPTY ROWS FOR EXCEL LOOK */}
            {[...Array(1)].map((_, i) => (
              <tr key={"empty" + i}>
                <td style={cell}></td>
                <td style={cell}></td>
                <td style={cell}></td>
                <td style={cell}></td>
                <td style={cell}></td>
              </tr>
            ))}
          </tbody>
        </table>

        {/* ✅ TOTALS (RIGHT SIDE BLOCK) */}
        <table
          style={{
            width: "40%",
            marginLeft: "auto",
            marginTop: "10px",
            borderCollapse: "collapse",
          }}
        >
          <tbody>
            <tr>
              <td style={cell}>Total:</td>
              <td style={cellCenter}>{props.total}</td>
            </tr>

            <tr>
              <td style={cell}>Advance:</td>
              <td style={cellCenter}>{props.advance}</td>
            </tr>

            <tr>
              <td style={{ ...cell, fontWeight: "bold" }}>
                Grand Total:
              </td>
              <td style={{ ...cellCenter, fontWeight: "bold" }}>
                {props.grandTotal}
              </td>
            </tr>
          </tbody>
        </table>

        
        {/* ✅ NOTES */}
        <div
        style={{
            marginTop: "20px",
            borderTop: "1px solid #555",
            paddingTop: "10px",
        }}
        >
        <strong>Note:</strong>

        <p style={{ marginTop: "5px", whiteSpace: "pre-line" }}>
            {props.notes || ""}
        </p>
        </div>

            </div>
            </div>
  );
}

/* ✅ COMMON STYLES */

const cell = {
  border: "1px solid #888",
  padding: "6px",
  height: "30px",
};

const cellCenter = {
  ...cell,
  textAlign: "center" as const,
};