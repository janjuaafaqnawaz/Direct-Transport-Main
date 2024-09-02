"use client";
import { useEffect, useState } from "react";
import dynamic from "next/dynamic";
import { isPointInGeofence } from "@/api/geofenceUtils";
import { updateDoc } from "@/api/firebase/functions/upload";
import { fetchDocById } from "@/api/firebase/functions/fetch";
import PlacesAutocomplete from "@/components/PlacesAutocomplete";

const MapComponent = dynamic(() => import("./components/MapComponent"), {
  ssr: false,
});

const Page = () => {
  const [geofenceCoords, setGeofenceCoords] = useState([
    [-25.274398, 133.775136],
    [-31.950527, 115.860457],
    [-33.86882, 151.209296],
  ]);

  useEffect(() => {
    if (typeof window !== "undefined") {
      async function fetch() {
        const res = await fetchDocById("geofence", "data");
        const geofence = JSON.parse(res.coor);
        setGeofenceCoords(geofence);
      }
      fetch();
    }
  }, []);

  const [newAddressCoords, setNewAddressCoords] = useState(null);
  const [isInside, setIsInside] = useState(false);

  const checkAddress = (coords) => {
    setNewAddressCoords(coords);
    const inside = isPointInGeofence(coords, geofenceCoords);
    console.log(inside);
    
    setIsInside(inside);
  };

  const handleGeofenceChange = async (newCoords) => {
    const coor = JSON.stringify(newCoords);
    const geofence = { coor };
    await updateDoc("data", "geofence", geofence);
    setGeofenceCoords(newCoords);
  };

  return (
    <div className="flex flex-col justify-center items-center min-h-screen bg-gradient-to-r from-blue-500 to-teal-500 p-4">
      <div className="w-full max-w-4xl bg-white shadow-lg rounded-3xl overflow-hidden">
        <div className="p-6">
          <h1 className="text-2xl font-bold text-gray-800 mb-4">
            Modify Geofence Area
          </h1>
          <p className="text-gray-600 mb-4">
            This section is under development; bugs may be expected.
          </p>
          <MapComponent
            geofenceCoords={geofenceCoords}
            newAddressCoords={newAddressCoords}
            onGeofenceChange={handleGeofenceChange}
          />
          <div className="mt-4 p-4 bg-gray-100 rounded-md shadow-md">
            <h2 className="text-lg font-semibold text-gray-700">
              Geofence Status:
            </h2>
            <PlacesAutocomplete
              onLocationSelect={(loc) =>
                checkAddress([loc.coordinates.lat, loc.coordinates.lng])
              }
              pickup={true}
            />
            <p className="text-gray-800 mt-9 font-extrabold text-lg">
              {isInside
                ? "The address is inside the geofence."
                : "The address is outside the geofence."}
            </p>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Page;
