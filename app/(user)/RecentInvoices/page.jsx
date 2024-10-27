"use client";
import React, { useEffect, useState } from "react";
import { fetchPlace_booking } from "@/api/firebase/functions/fetch";
import { CAP, RecentInvoices } from "@/components/Index";

export default function Page() {
  const [role, setRole] = useState(null);
  const [place_booking, setPlace_booking] = useState([]);
  // const [status, setStatus] = useState("pending");

  useEffect(() => {
    const fetchData = async () => {
      try {
        const fetchedPlace_booking = await fetchPlace_booking();
        setPlace_booking(
          fetchedPlace_booking.filter((item) => item?.isArchived !== true)
        );
      } catch (error) {
        console.error("Error fetching place bookings:", error);
      }
    };

    fetchData();
  }, []);

  return (
    <>
      <RecentInvoices place_booking={place_booking} />
    </>
  );
}
