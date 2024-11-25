import { useEffect, useRef } from "react";
import L from "leaflet";
import "leaflet/dist/leaflet.css";

export default function LeafletMap({ liveLocSharingBookings, booking }) {
  const mapContainer = useRef(null);
  const map = useRef(null);
  const marker = useRef(null);

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
      iconAnchor: [20, 80],
    });

    marker.current = L.marker(
      [
        liveLocSharingBookings?.latitude || 0,
        liveLocSharingBookings?.longitude || 0,
      ],
      { icon: customIcon }
    )
      .addTo(map.current)
      .bindTooltip("Driver", { permanent: true, direction: "top" });
  };

  const updateMap = (data) => {
    if (map.current && marker.current && data?.latitude && data?.longitude) {
      const newLatLng = [data.latitude, data.longitude];
      marker.current.setLatLng(newLatLng);
      map.current.setView(newLatLng); // Center map on new location
      map.current.setView(newLatLng);

      marker.current
        .bindTooltip(`${booking.driverName || "Unknown"}`, {
          permanent: true,
          direction: "top",
        })
        .openTooltip();
    }
  };

  return <div ref={mapContainer} style={{ width: "100%", height: "400px" }} />;
}
