"use client";

import { useEffect, useState } from "react";
import { onValue, ref } from "firebase/database";
import { realtimeDb } from "@/api/firebase/config";
import dynamic from "next/dynamic";
import { Loader } from "lucide-react";
import useAdminContext from "@/context/AdminProvider";

const LeafletMap = dynamic(() => import("./LeafletMap"), { ssr: false });

export default function TrackDriverContent() {
  const [liveLocSharingBookings, setLiveLocSharingBookings] = useState(null);
  const { allDrivers } = useAdminContext();
  console.log(liveLocSharingBookings);

  useEffect(() => {
    if (!allDrivers) return;

    const dbRef = ref(realtimeDb, `driversLocations`);

    const unsubscribe = onValue(dbRef, (snapshot) => {
      const data = snapshot.val();

      if (data) {
        const drivers = Object.entries(data)
          .map(([key, driver]) => {
            if (driver?.current) {
              const sanitizedEmail = key.replace(/[_#$[\]]/g, ".");
              const driverDetails = allDrivers.find(
                (d) => d.email === sanitizedEmail
              );

              return {
                ...driver.current,
                email: key,
                driver: driverDetails || null,
              };
            }
            return undefined;
          })
          .filter((driver) => driver !== undefined);

        setLiveLocSharingBookings(drivers);
      } else {
        setLiveLocSharingBookings(null);
      }
    });

    return () => unsubscribe();
  }, [allDrivers]);

  if (!allDrivers || liveLocSharingBookings === null) {
    return (
      <div className="flex justify-center items-center h-64">
        <Loader className="animate-spin w-6 h-6 text-gray-500" />
        <span className="ml-2 text-gray-500">Loading driver data...</span>
      </div>
    );
  }

  return <LeafletMap liveLocSharingBookings={liveLocSharingBookings} />;
}
