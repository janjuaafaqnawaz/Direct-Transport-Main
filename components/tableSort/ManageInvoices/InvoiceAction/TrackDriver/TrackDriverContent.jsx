/* eslint-disable react-hooks/exhaustive-deps */
"use client";

import { useEffect, useState, useRef } from "react";
import { onValue, ref } from "firebase/database";
import { realtimeDb } from "@/api/firebase/config";
import L from "leaflet";
import "leaflet/dist/leaflet.css";

export default function TrackDriverContent({ booking }) {
  const [liveLocSharingBookings, setLiveLocSharingBookings] = useState(null);
  const mapContainer = useRef(null);
  const map = useRef(null);
  const marker = useRef(null);

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
        if (data) {
          updateMap(data);
        }
      });

      return () => unsubscribe();
    };

    if (booking?.driverEmail && booking?.docId) {
      getBookingLiveLocation();
    }
  }, [booking]);

  useEffect(() => {
    if (!map.current && mapContainer.current) {
      initializeMap();
    }
  }, []);

  useEffect(() => {
    if (liveLocSharingBookings) {
      updateMap(liveLocSharingBookings);
    }
  }, [liveLocSharingBookings]);

  const initializeMap = () => {
    if (typeof window !== "undefined") {
      map.current = L.map(mapContainer.current).setView(
        [
          liveLocSharingBookings?.latitude || 0,
          liveLocSharingBookings?.longitude || 0,
        ],
        13
      );

      L.tileLayer("https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png").addTo(
        map.current
      );

      const customIcon = L.icon({
        iconUrl: "/icons/car.png",
        iconSize: [40, 40],
        iconAnchor: [8, 90],
        popupAnchor: [0, -32],
      });

      marker.current = L.marker(
        [
          liveLocSharingBookings?.latitude || 0,
          liveLocSharingBookings?.longitude || 0,
        ],
        { icon: customIcon }
      )
        .addTo(map.current)
        .bindTooltip("loading...");
    }
  };

  const updateMap = (data) => {
    if (map.current && marker.current && data?.latitude && data?.longitude) {
      const newLatLng = [data.latitude, data.longitude];
      marker.current.setLatLng(newLatLng);
      map.current.setView(newLatLng);

      marker.current
        .bindTooltip(`${booking.driverName || "Unknown"}`, {
          permanent: true, // Keeps the tooltip always visible
          direction: "top", // Position the tooltip above the marker
        })
        .openTooltip();
    }
  };

  return <div ref={mapContainer} style={{ width: "100%", height: "400px" }} />;
}
