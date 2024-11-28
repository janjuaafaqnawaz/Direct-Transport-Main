"use client";

import { useEffect, useState, useRef } from "react";
import { onValue, ref } from "firebase/database";
import { realtimeDbOFL } from "@/api/firebase/config";
import dynamic from "next/dynamic";
import { Card, CardContent } from "@/components/ui/card";
import { Alert, AlertDescription, AlertTitle } from "@/components/ui/alert";
import { AlertCircle } from "lucide-react";

const LeafletMap = dynamic(() => import("./LeafletMap"), { ssr: false });

export default function TrackDriverContent({ booking }) {
  const [liveLocSharingBookings, setLiveLocSharingBookings] = useState(null);

  useEffect(() => {
    const getBookingLiveLocation = () => {
      const sanitizedEmail = booking?.driverEmail?.replace(/[.#$[\]]/g, "_");
      if (!sanitizedEmail) return;

      const dbRef = ref(
        realtimeDbOFL,
        `driversLocations/${sanitizedEmail}/${booking.docId}`
      );

      const unsubscribe = onValue(dbRef, (snapshot) => {
        const data = snapshot.val();
        console.log(data);

        setLiveLocSharingBookings(data);
      });

      return () => unsubscribe();
    };

    if (booking?.driverEmail && booking?.docId) {
      getBookingLiveLocation();
    }
  }, [booking]);

  if (!liveLocSharingBookings) {
    return (
      <Alert variant="warning">
        <AlertCircle className="h-4 w-4" />
        <AlertTitle>Tracking Unavailable</AlertTitle>
        <AlertDescription>
          We apologize, but this booking does not include real-time tracking or
          last drop-off location details.
        </AlertDescription>
      </Alert>
    );
  }

  const userDoc = JSON.parse(localStorage.getItem("userDoc")) || {};
  const developer = userDoc.email === "test@devtest.com";
  if (!developer && email === "ignore@testing.com") return;

  return (
    <>
      <h1>Driver Live Location</h1>
      <LeafletMap
        liveLocSharingBookings={liveLocSharingBookings}
        booking={booking}
      />
    </>
  );
}
