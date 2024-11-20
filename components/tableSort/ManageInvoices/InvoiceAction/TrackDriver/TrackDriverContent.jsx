"use client";

import { useEffect, useState, useRef } from "react";
import { onValue, ref } from "firebase/database";
import { realtimeDb } from "@/api/firebase/config";
import dynamic from 'next/dynamic';

const LeafletMap = dynamic(() => import('./LeafletMap'), { ssr: false });

export default function TrackDriverContent({ booking }) {
  const [liveLocSharingBookings, setLiveLocSharingBookings] = useState(null);

  useEffect(() => {
    const getBookingLiveLocation = () => {
      const sanitizedEmail = booking?.driverEmail?.replace(/[.#$[\]]/g, "_");
      if (!sanitizedEmail) return;

      const dbRef = ref(
        realtimeDb,
        `driversLocations/${sanitizedEmail}/${booking.docId}`
      );

      const unsubscribe = onValue(dbRef, (snapshot) => {
        const data = snapshot.val();
        setLiveLocSharingBookings(data);
      });

      return () => unsubscribe();
    };

    if (booking?.driverEmail && booking?.docId) {
      getBookingLiveLocation();
    }
  }, [booking]);

  return (
    <LeafletMap 
      liveLocSharingBookings={liveLocSharingBookings} 
      booking={booking} 
    />
  );
}