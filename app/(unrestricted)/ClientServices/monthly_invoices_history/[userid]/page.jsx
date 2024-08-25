"use client";

import { fetchPlaceBookingsExistingAccsMonthly } from "@/api/firebase/functions/fetch";
import { usePathname } from "next/navigation";
import React, { useEffect, useState } from "react";
import { Center } from "@mantine/core";
import MyDocument from "./components/pdfcontent";
import dynamic from "next/dynamic";
const PDFDownloadLink = dynamic(
  () => import("@react-pdf/renderer").then((mod) => mod.PDFDownloadLink),
  {
    ssr: false,
    loading: () => <p>Loading...</p>,
  }
);
import Logo from "@/public/pdf_header2.jpg";

export default function Page() {
  const pathname = usePathname();
  const [invoices, setInvoices] = useState([]);
  const [loading, setLoading] = useState(true);
  const [exist, setExist] = useState(false);

  useEffect(() => {
    const fetchInvoice = async () => {
      const match = pathname && pathname.match(/\/([^/]+)$/);
      const id = match && match[1];

      if (id) {
        try {
          setLoading(true); // Start loading
          const data = await fetchPlaceBookingsExistingAccsMonthly(id);
          if (!data || !data.length) {
            setExist(false);
          } else {
            setExist(true);
            setInvoices(data);
          }
        } catch (error) {
          console.error("Error fetching invoices:", error);
        } finally {
          setLoading(false); // Stop loading
        }
      }
    };

    fetchInvoice();
  }, [pathname]);

  if (!exist && !loading) {
    return (
      <Center h={400}>
        <h1 style={{ fontWeight: 900 }}>
          Sorry, you did not make any bookings last month.
        </h1>
      </Center>
    );
  }

  return (
    <Center>
      {loading ? ( // Show loader if loading
        <h4>Downloading...</h4>
      ) : (
        <>
          <PDFDownloadLink
            document={<MyDocument invoices={invoices} logo={Logo} />}
            fileName={`monthly_bookings.pdf`}
            style={{
              textDecoration: "none",
              padding: "10px",
              color: "#fff",
              backgroundColor: "#007bff",
              border: "none",
              borderRadius: "4px",
              margin: "10px",
            }}
          >
            {({ blob, url, loading, error }) =>
              loading ? "Loading document..." : "Download PDF"
            }
          </PDFDownloadLink>

          {/* Uncomment this if you want to display the PDF in the browser
          <PDFViewer style={{ width: "100%", height: "100vh" }}>
            <MyDocument invoices={invoices} logo={Logo} />
          </PDFViewer> */}
        </>
      )}
    </Center>
  );
}
