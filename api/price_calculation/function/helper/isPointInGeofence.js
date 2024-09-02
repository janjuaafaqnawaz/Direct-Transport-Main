import { fetchDocById } from "../../../firebase/functions/fetch";
import { isPointInGeofence as checkIsPointInGeofence } from "@/api/geofenceUtils";

export default async function isPointInGeofence(address) {
  const { Origin, Destination } = address || {};

  if (
    !Origin ||
    !Origin.coordinates ||
    !Destination ||
    !Destination.coordinates
  ) {
    console.error("Origin or Destination or their coordinates are missing!");
    return { isOriginInside: false, isDestinationInside: false };
  }

  const res = await fetchDocById("geofence", "data");
  const geofence = JSON.parse(res.coor);

  const OriginCoordinates = [Origin.coordinates.lat, Origin.coordinates.lng];
  const destinationCoordinates = [
    Destination.coordinates.lat,
    Destination.coordinates.lng,
  ];

  // Use the utility function that checks if the point is inside the geofence
  const isOriginInside = checkIsPointInGeofence(OriginCoordinates, geofence);
  const isDestinationInside = checkIsPointInGeofence(
    destinationCoordinates,
    geofence
  );

  console.log("isPointInGeofence", isOriginInside, isDestinationInside);

  return { isOriginInside, isDestinationInside };
}
