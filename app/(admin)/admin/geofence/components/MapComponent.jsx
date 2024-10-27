"use client";

import React from "react";
import {
  MapContainer,
  TileLayer,
  Polygon,
  Marker,
  FeatureGroup,
} from "react-leaflet";
import { EditControl } from "react-leaflet-draw";
import "leaflet/dist/leaflet.css";
import "leaflet-draw/dist/leaflet.draw.css";
import L from "leaflet"; // Import Leaflet
import { LocationCity } from "@mui/icons-material";

const customIcon = new L.Icon({
  iconUrl: "/icons/location.png",
  iconSize: [25, 41],
  iconAnchor: [12, 41],
  popupAnchor: [1, -34],
});

const MapComponent = ({
  geofenceCoords,
  newAddressCoords,
  onGeofenceChange,
}) => {
  return (
    <MapContainer
      center={[-33.86882, 151.209296]}
      zoom={13}
      style={{ height: "70vh", width: "100%", borderRadius: "2rem" }}
    >
      <TileLayer url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png" />
      <FeatureGroup>
        <EditControl
          position="topright"
          onEdited={(e) => {
            const editedLayers = e.layers;
            editedLayers.eachLayer((layer) => {
              if (layer instanceof L.Polygon) {
                const newCoords = layer
                  .getLatLngs()[0]
                  .map((latlng) => [latlng.lat, latlng.lng]);
                onGeofenceChange(newCoords);
              }
            });
          }}
          onCreated={(e) => {
            const layer = e.layer;
            if (layer instanceof L.Polygon) {
              const newCoords = layer
                .getLatLngs()[0]
                .map((latlng) => [latlng.lat, latlng.lng]);
              onGeofenceChange(newCoords);
            }
          }}
          draw={{
            rectangle: false,
            circle: false,
            polyline: false,
            circlemarker: false,
            marker: false,
          }}
          edit={{
            edit: true,
            remove: true,
          }}
        />
        <Polygon positions={geofenceCoords} />
        {newAddressCoords && (
          <Marker icon={customIcon} position={newAddressCoords} />
        )}
      </FeatureGroup>
    </MapContainer>
  );
};

export default MapComponent;
