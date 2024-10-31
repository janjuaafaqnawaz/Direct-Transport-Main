/* eslint-disable react-hooks/exhaustive-deps */
"use client";

import React, { useEffect, useState } from "react";
import useAdminContext from "@/context/AdminProvider";
import { parse } from "date-fns";
import PdfButton from "./pdf/PdfButton";
import { Loader } from "@mantine/core";
import convertToISOString from "./convertToISOString";

export default function CreatePdfForDrivers({ datesRange, user }) {
  const [loading, setLoading] = useState(true);
  const [myBookings, setMyBookings] = useState([]);
  const { allBookings } = useAdminContext();
  const pdfId = "#" + myBookings[0]?.id + "778";

  async function placeBookingsExistingAccsMonthly() {
    const { start, end } = datesRange;

    const startDate = parse(start, "dd/MM/yyyy", new Date());
    startDate.setHours(0, 0, 0, 0);
    const toDate = parse(end, "dd/MM/yyyy", new Date());
    toDate.setHours(23, 59, 59, 999);

    try {
      return allBookings.filter((booking) => {
        if (!booking.driverEmail || !user?.email) {
          console.error(
            "Email is missing in booking or user object.",
            "driverEmail",
            booking.driverEmail,
            "userEmail",
            user?.email
          );
          return false;
        }

        const bookingDate = new Date(convertToISOString(booking.date));

        return (
          booking.driverEmail.toLowerCase() === user.email.toLowerCase() &&
          bookingDate >= startDate &&
          bookingDate <= toDate
        );
      });
    } catch (error) {
      console.error("Error:", error);
      console.log("Something Went Wrong");
      return [];
    }
  }

  useEffect(() => {
    async function fetchData() {
      try {
        const bookings = await placeBookingsExistingAccsMonthly(user.email);
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
          pdfId={pdfId}
        />
      ) : null}
    </div>
  );
}
