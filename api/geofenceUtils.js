"use client";

// src/utils/geofenceUtils.js
import * as turf from "@turf/turf";

export const isPointInGeofence = (point, geofenceCoords) => {
  // Ensure the geofence coordinates form a closed loop
  if (geofenceCoords[0] !== geofenceCoords[geofenceCoords.length - 1]) {
    geofenceCoords.push(geofenceCoords[0]);
  }

  const polygon = turf.polygon([geofenceCoords]);
  const pt = turf.point(point);
  return turf.booleanPointInPolygon(pt, polygon);
};
