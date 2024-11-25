import { useEffect, useRef } from "react";
import L from "leaflet";
import "leaflet/dist/leaflet.css";

export default function LeafletMap({ liveLocSharingBookings }) {
  const mapContainer = useRef(null);
  const map = useRef(null);
  const markers = useRef([]);

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
    map.current = L.map(mapContainer.current).setView([0, 0], 5);

    L.tileLayer("https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png").addTo(
      map.current
    );
  };

  const updateMap = (drivers) => {
    markers.current.forEach((marker) => map.current.removeLayer(marker));
    markers.current = [];

    drivers.forEach((driver) => {
      const { latitude, longitude, driver: driverInfo } = driver;

      if (latitude && longitude) {
        const customIcon = L.icon({
          iconUrl: "/icons/car.png",
          iconSize: [40, 40],
          iconAnchor: [20, 80],
        });

        const marker = L.marker([latitude, longitude], { icon: customIcon })
          .addTo(map.current)
          .bindTooltip(driverInfo?.firstName || "Driver", {
            permanent: true,
            direction: "top",
          });

        markers.current.push(marker);
      }
    });

    if (drivers.length > 0) {
      const bounds = L.latLngBounds(
        drivers.map((driver) => [driver.latitude, driver.longitude])
      );
      map.current.fitBounds(bounds, { padding: [50, 50] });
    }
  };

  return <div ref={mapContainer} style={{ width: "100%", height: "400px" }} />;
}
