"use client";

import React, { useState } from "react";
import dynamic from "next/dynamic";
import { pdf } from "@react-pdf/renderer";
import { getStorage, ref, uploadBytes, getDownloadURL } from "firebase/storage";
import { app } from "@/api/firebase/config";
import { Button, Spinner } from "@nextui-org/react";
import { postDoc } from "@/api/firebase/functions/upload";
import LayoutSelector from "./PdfLayout";
import toast from "react-hot-toast";
import PDFLayout1 from "./PDFLayout1";
import PDFLayout2 from "./PDFLayout2";
import PDFLayoutDriver from "./PDFLayoutDriver";

const storage = getStorage(app);

const PDFDownloadLink = dynamic(
  () => import("@react-pdf/renderer").then((mod) => mod.PDFDownloadLink),
  {
    ssr: false,
    loading: () => <Spinner />,
  }
);

export default function PdfButton({
  user,
  bookings,
  datesRange,
  driverLayout,
  pdfId,
}) {
  const [uploading, setUploading] = useState(false);
  const bookingCount = bookings.length;
  const [selectedLayout, setSelectedLayout] = useState("Layout2");

  const getPDFDocument = () => {
    if (driverLayout) {
      return (
        <PDFLayoutDriver
          datesRange={datesRange}
          invoices={bookings}
          user={user}
          pdfId={pdfId}
        />
      );
    } else if (selectedLayout === "Layout2") {
      return (
        <PDFLayout2
          datesRange={datesRange}
          invoices={bookings}
          user={user}
          pdfId={pdfId}
        />
      );
    }
    return (
      <PDFLayout1
        datesRange={datesRange}
        invoices={bookings}
        user={user}
        pdfId={pdfId}
      />
    );
  };

  const PDFDocument = getPDFDocument();

  const handleUpload = async () => {
    setUploading(true);
    const blob = await pdf(PDFDocument).toBlob();
    const storageRef = ref(
      storage,
      `pdfs/monthly_bookings_${user.firstName}.pdf`
    );

    try {
      await uploadBytes(storageRef, blob);
      const downloadURL = await getDownloadURL(storageRef);

      console.log("handleUpload", { user });

      await postDoc(
        {
          firstName: user.firstName,
          email: user.email,
          billingEmail: user?.billingEmail || null,
          url: downloadURL,
          createdAt: new Date(),
          datesRange,
          pdfId: pdfId || "",
        },
        "generatedPdfs"
      );

      toast.success("PDF uploaded successfully!");

      window.location.reload();
    } catch (error) {
      console.error("Error uploading PDF:", error);
      toast.error("Failed to upload PDF");
    } finally {
      setUploading(false);
    }
  };

  return (
    <>
      {!driverLayout && (
        <LayoutSelector
          selectedLayout={selectedLayout}
          setSelectedLayout={setSelectedLayout}
        />
      )}
      <div className="flex justify-center space-x-4">
        {bookingCount > 0 && (
          <>
            <PDFDownloadLink
              document={PDFDocument} // Use dynamically selected PDF layout
              fileName={`monthly_bookings_${user.firstName}.pdf`}
              className="inline-flex items-center px-4 py-2 text-white bg-red-600 border border-transparent rounded-full shadow-sm hover:bg-red-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-red-500"
            >
              {({ loading }) =>
                loading ? <Spinner color="white" /> : <span>Download PDF</span>
              }
            </PDFDownloadLink>

            <Button
              onClick={handleUpload}
              disabled={uploading}
              color="primary"
              className="rounded-full"
            >
              {uploading ? <Spinner color="white" /> : "Save PDF"}
            </Button>
          </>
        )}
      </div>
    </>
  );
}
