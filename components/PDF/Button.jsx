"use client";

const PDFDownloadLink = dynamic(
  () => import("@react-pdf/renderer").then((mod) => mod.PDFDownloadLink),
  {
    ssr: false,
    loading: () => <p>Loading...</p>,
  }
);
import MyDocument from "./pdfcontent";
import dynamic from "next/dynamic";

export default function Button({ booking }) {
  return (
    <div> 
      <PDFDownloadLink
        document={<MyDocument booking={booking} />}
        fileName={`${booking.docId}_${booking.userName}.pdf`}
        style={{
          textDecoration: "none",
          padding: "10px",
          color: "#fff",
          backgroundColor: "#e5383b",
          border: "none",
          borderRadius: "30px",
          margin: "10px",
          cursor: "pointer",
        }}
      >
        {({ blob, url, loading, error }) => (loading ? "..." : "PDF")}
      </PDFDownloadLink>
    </div>
  );
}
