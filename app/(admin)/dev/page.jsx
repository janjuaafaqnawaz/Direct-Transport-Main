"use client";
import { startOfDay, parse } from "date-fns";
import useAdminContext from "@/context/AdminProvider";
import React, { useMemo } from "react";

export default function Export() {
  const { allBookings } = useAdminContext();

  const parseDate = (dateString) => {
    try {
      const parsedDate = parse(dateString, "dd/MM/yyyy", new Date());
      return startOfDay(parsedDate);
    } catch (error) {
      console.error("Error parsing date:", error, "Date string:", dateString);
      return null;
    }
  };

  const comparisonDate = startOfDay(new Date(2024, 9, 1));

  const bookings = useMemo(
    () =>
      allBookings.filter((booking) => {
        if (!booking.date) return false;
        const bookingDate = parseDate(booking.date);
        return bookingDate && bookingDate >= comparisonDate;
      }),
    [allBookings]
  );

  const exportToCSV = () => {
    const headers = [
      "id",
      "date",
      "userName",
      "userEmail",
      "service",
      "items",
      "driverAssignedDate",
      "driverName",
      "returnType",
      "serviceCharges",
      "totalTollsCost",
      "totalPrice",
      "gst",
      "totalPriceWithGST",
    ];
    const rows = bookings.map((booking) => [
      booking.id,
      booking.date,
      booking.userName,
      booking.userEmail,
      booking.service,
      booking.items.length,
      booking.driverAssignedDate,
      booking.driverName,
      booking.returnType,
      booking.serviceCharges,
      booking.totalTollsCost,
      booking.totalPrice,
      booking.gst,
      booking.totalPriceWithGST,
    ]);

    const csvContent = [
      headers.join(","), // Header row
      ...rows.map((row) => row.join(",")), // Data rows
    ].join("\n");

    const blob = new Blob([csvContent], { type: "text/csv" });
    const url = URL.createObjectURL(blob);
    const link = document.createElement("a");
    link.href = url;
    link.download = "bookings.csv";
    link.click();
    URL.revokeObjectURL(url);
  };

  return (
    <div>
      <button onClick={exportToCSV}>Export to CSV</button>
      {/* Display booking details if needed */}
    </div>
  );
}
