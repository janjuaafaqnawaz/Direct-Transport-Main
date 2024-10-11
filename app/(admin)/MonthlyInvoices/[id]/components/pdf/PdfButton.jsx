"use client";

import React, { useState } from "react";
import MyDocument from "./pdfcontent";
import dynamic from "next/dynamic";
import { pdf } from "@react-pdf/renderer"; // For PDF rendering
import { getStorage, ref, uploadBytes, getDownloadURL } from "firebase/storage"; // Firebase storage imports
import { getFirestore, collection, addDoc } from "firebase/firestore"; // Firestore imports
import { app } from "@/api/firebase/config";
import { Button } from "@nextui-org/react";
import { postDoc } from "@/api/firebase/functions/upload";

const storage = getStorage(app);
const db = getFirestore(app);

const PDFDownloadLink = dynamic(
  () => import("@react-pdf/renderer").then((mod) => mod.PDFDownloadLink),
  {
    ssr: false,
    loading: () => <p>Loading...</p>,
  }
);

export default function PdfButton({ user, bookings, datesRange }) {
  const [uploading, setUploading] = useState(false);
  const bookingCount = bookings.length;

  const handleUpload = async () => {
    setUploading(true);
    const blob = await pdf(
      <MyDocument datesRange={datesRange} invoices={bookings} user={user} />
    ).toBlob();
    const storageRef = ref(
      storage,
      `pdfs/monthly_bookings_${user.firstName}.pdf`
    );

    try {
      await uploadBytes(storageRef, blob);
      const downloadURL = await getDownloadURL(storageRef);

      await postDoc(
        {
          firstName: user.firstName,
          email: user.email,
          url: downloadURL,
          createdAt: new Date(),
          datesRange,
        },
        "generatedPdfs"
      );

      alert("PDF uploaded successfully!");

      window.location.reload();
    } catch (error) {
      console.error("Error uploading PDF:", error);
      alert("Failed to upload PDF");
    } finally {
      setUploading(false);
    }
  };

  return (
    <div className="flex space-x-4">
      {bookingCount > 0 && (
        <>
          <PDFDownloadLink
            document={
              <MyDocument
                datesRange={datesRange}
                invoices={bookings}
                user={user}
              />
            }
            fileName={`monthly_bookings_${user.firstName}.pdf`}
            className="inline-flex items-center px-4 py-2 text-white bg-red-600 border border-transparent rounded-full shadow-sm hover:bg-red-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-red-500"
          >
            {({ blob, url, loading, error }) =>
              loading ? <span>Loading...</span> : <span>Download PDF</span>
            }
          </PDFDownloadLink>
          <Button
            onClick={handleUpload}
            className="inline-flex items-center px-4 py-2 text-white bg-blue-600 border border-transparent rounded-full shadow-sm hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500"
            disabled={uploading}
          >
            {uploading ? "Uploading..." : "Save PDF"}
          </Button>
        </>
      )}
    </div>
  );
}

// const getBadgeColor = (bookingCount) => {
//     if (bookingCount > 20) return "green";
//     if (bookingCount > 0) return "blue";
//     return "gray";
//   };

//   const rows = users.map((user, key) => {
//     const bookingCount = bookings[user.email]?.length || 0;
//     const badgeColor = getBadgeColor(bookingCount);
