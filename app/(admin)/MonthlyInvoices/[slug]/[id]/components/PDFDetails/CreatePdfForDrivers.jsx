/* eslint-disable react-hooks/exhaustive-deps */
"use client";

import React, { useEffect, useState } from "react";
import useAdminContext from "@/context/AdminProvider";
import PdfButton from "./pdf/PdfButton";
import { Loader } from "@mantine/core";
import { fetchBookingsBetweenDates } from "@/api/firebase/functions/fetch";

export default function CreatePdfForDrivers({ datesRange, user }) {
  const [loading, setLoading] = useState(true);
  const [myBookings, setMyBookings] = useState([]);
  const { allBookings } = useAdminContext();
  const pdfId = Math.floor(100000 + Math.random() * 900000);
  console.log(pdfId);

  useEffect(() => {
    async function fetchData() {
      try {
        const bookings = await fetchBookingsBetweenDates(datesRange, user);
        setMyBookings(bookings?.filter((item) => item?.isArchived !== true));
      } catch (error) {
        console.error("Error Creating PDF:", error);
      } finally {
        setLoading(false);
      }
    }
    fetchData();
  }, [allBookings, user, datesRange]);

  if (loading) {
    return <Loader />;
  }

  return (
    <div style={{ borderRadius: 30, backgroundColor: "#f8f9fa", padding: 50 }}>
      {myBookings.length > 0 ? (
        <PdfButton
          user={user}
          bookings={myBookings}
          datesRange={datesRange}
          driverLayout={true}
          pdfId={"#" + pdfId}
        />
      ) : null}
    </div>
  );
}
