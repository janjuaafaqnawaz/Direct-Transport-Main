"use client";

import React, { useEffect, useState } from "react";
import {
  collection,
  onSnapshot,
  orderBy,
  query,
  Timestamp,
  where,
} from "firebase/firestore";
import { db } from "@/context/AdminProvider";
import BookingScreen from "./components/Screen"

export default function Page() {
  const [bookings, setBookings] = useState([]);
  const [selectedBooking, setSelectedBooking] = useState(null);
  const collectionName = "deriver_bookings_status";

  useEffect(() => {
    if (!db) {
      console.error("Firestore is not initialized.");
      return;
    }

    const now = Timestamp.now();
    const last24Hours = new Timestamp(
      now.seconds - 24 * 60 * 60,
      now.nanoseconds
    );

    const colRef = collection(db, collectionName);
    const q = query(
      colRef,
      where("serverTimestamp", ">=", last24Hours),
      orderBy("serverTimestamp", "desc")
    );

    const unsubscribe = onSnapshot(
      q,
      (snapshot) => {
        if (snapshot.empty) {
          console.log("No matching documents found!");
          setBookings([]);
          return;
        }

        const bookingList = snapshot.docs.map((doc) => ({
          id: doc.id,
          bookingId: doc.data().bookingId || "No ID",
          serverTimestamp:
            doc.data().serverTimestamp?.toDate().toLocaleString() || "Unknown",
          booking: doc.data().booking || {},
        }));

        setBookings(bookingList);
      },
      (error) => {
        console.error("Error fetching Firestore data:", error);
      }
    );

    return () => unsubscribe();
  }, []);

  return (
    <BookingScreen
      selectedBooking={selectedBooking}
      setSelectedBooking={setSelectedBooking}
      bookings={bookings}
    />
  );
}
