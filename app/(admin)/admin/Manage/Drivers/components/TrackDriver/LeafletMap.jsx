import { useEffect, useRef, useState } from "react";
import L from "leaflet";
import "leaflet/dist/leaflet.css";

export default function LeafletMap({ liveLocSharingBookings }) {
  const [initialized, setInitialized] = useState(false);
  const mapContainer = useRef(null);
  const map = useRef(null);
  const marker = useRef(null);

  useEffect(() => {
    if (!initialized && mapContainer.current && liveLocSharingBookings) {
      initializeMap();
      setInitialized(true); // Set the map as initialized after setting up
    }
  }, [initialized, liveLocSharingBookings]);

  const initializeMap = () => {
    const { latitude, longitude } = liveLocSharingBookings || {
      latitude: 0,
      longitude: 0,
    };

    map.current = L.map(mapContainer.current).setView(
      [latitude, longitude],
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

    marker.current = L.marker([latitude, longitude], { icon: customIcon })
      .addTo(map.current)
      .bindTooltip("loading...");
  };

  useEffect(() => {
    if (liveLocSharingBookings && marker.current && map.current) {
      updateMap(liveLocSharingBookings);
    }
  }, [liveLocSharingBookings]);

  const updateMap = (data) => {
    if (data?.latitude && data?.longitude) {
      const newLatLng = [data.latitude, data.longitude];
      marker.current.setLatLng(newLatLng);
      map.current.setView(newLatLng);

      marker.current
        .bindTooltip(`Driver`, { permanent: true, direction: "top" })
        .openTooltip();
    }
  };

  if (!liveLocSharingBookings) {
    return "No Data Found!";
  }

  return <div ref={mapContainer} style={{ width: "100%", height: "400px" }} />;
}
