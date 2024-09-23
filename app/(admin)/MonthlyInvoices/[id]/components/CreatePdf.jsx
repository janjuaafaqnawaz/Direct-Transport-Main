"use client";

import React, { useEffect, useState } from "react";
import useAdminContext from "@/context/AdminProvider";
import { format, parse } from "date-fns"; // Make sure date-fns is imported
import PdfButton from "./pdf/PdfButton";
import { Loader } from "@mantine/core";

function convertToISOString(dateString, hours = 11, minutes = 25, seconds = 4) {
  const [day, month, year] = dateString.split("/");
  const date = new Date(
    Date.UTC(year, month - 1, day, hours, minutes, seconds)
  );
  return date.toISOString();
}

// Example usage

export default function CreatePdf({ datesRange, user }) {
  const [loading, setLoading] = useState(true);
  const [myBookings, setMyBookings] = useState([]);
  const { allBookings } = useAdminContext();

  async function placeBookingsExistingAccsMonthly(email) {
    const { start, end } = datesRange;

    const startDate = parse(start, "dd/MM/yyyy", new Date());
    startDate.setHours(0, 0, 0, 0);
    const toDate = parse(end, "dd/MM/yyyy", new Date());
    toDate.setHours(23, 59, 59, 999);

    // console.log({ startDate, toDate });

    try {
      return allBookings.filter((booking) => {
        const bookingDate = new Date(convertToISOString(booking.date));

        return (
          booking.userEmail.toLowerCase() === user.email.toLowerCase() &&
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
        setMyBookings(bookings);
      } catch (error) {
        console.error("Error fetching data:", error);
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
        <PdfButton user={user} bookings={myBookings} datesRange={datesRange} />
      ) : null}
    </div>
  );
}
