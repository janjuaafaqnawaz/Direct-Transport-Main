/* eslint-disable react-hooks/exhaustive-deps */
"use client";

import React, { useEffect, useState } from "react";
import useAdminContext from "@/context/AdminProvider";
import { parse } from "date-fns";
import PdfButton from "./pdf/PdfButton";
import { Loader } from "@mantine/core";

function convertToISOString(dateString, hours = 11, minutes = 25, seconds = 4) {
  if (!dateString || typeof dateString !== "string") {
    console.error("Invalid date string:", dateString);
    return null;
  }

  const [day, month, year] = dateString.split("/");

  // Check if the date components are valid numbers
  if (!day || !month || !year || isNaN(day) || isNaN(month) || isNaN(year)) {
    console.error("Invalid date components:", { day, month, year });
    return null;
  }

  const date = new Date(
    Date.UTC(year, month - 1, day, hours, minutes, seconds)
  );

  if (isNaN(date)) {
    console.error("Invalid Date:", date);
    return null;
  }

  return date.toISOString();
}

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
        <PdfButton user={user} bookings={myBookings} datesRange={datesRange} />
      ) : null}
    </div>
  );
}
