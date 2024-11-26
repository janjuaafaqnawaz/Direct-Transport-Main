"use client";

import { useEffect, useState, useRef } from "react";
import { onValue, ref } from "firebase/database";
import { realtimeDbOFL } from "@/api/firebase/config";
import dynamic from "next/dynamic";

const LeafletMap = dynamic(() => import("./LeafletMap"), { ssr: false });

export default function TrackDriverContent({ email }) {
  const [liveLocSharingBookings, setLiveLocSharingBookings] = useState(null);

  useEffect(() => {
    const getBookingLiveLocation = () => {
      const sanitizedEmail = email?.replace(/[.#$[\]]/g, "_");
      if (!email) alert("error");

      const dbRef = ref(
        realtimeDbOFL,
        `driversLocations/${sanitizedEmail}/current`
      );

      const unsubscribe = onValue(dbRef, (snapshot) => {
        const data = snapshot.val();

        setLiveLocSharingBookings(data);
      });

      return () => unsubscribe();
    };

    getBookingLiveLocation();
  }, []);

  return <LeafletMap liveLocSharingBookings={liveLocSharingBookings} />;
}
