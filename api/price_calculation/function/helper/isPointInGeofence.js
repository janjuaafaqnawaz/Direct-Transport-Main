import { fetchDocById } from "../../../firebase/functions/fetch";
import { isPointInGeofence as checkIsPointInGeofence } from "@/api/geofenceUtils";

export default async function isPointInGeofence(address) {
  if (!address) {
    console.error("Address data is missing!");
    return null;
  }

  const res = await fetchDocById("geofence", "data");
  const geofence = JSON.parse(res.coor);

  let results = {
    origins: [],
    destinations: [],
  };

  if (address.useMultipleAddresses) {
    // Check multiple origins
    if (Array.isArray(address.MultipleOrigin)) {
      results.origins = address.MultipleOrigin.map((origin) => ({
        label: origin.label || "Unknown Origin",
        isInside: checkIsPointInGeofence(
          [origin.coordinates.lat, origin.coordinates.lng],
          geofence
        ),
      }));
    }

    // Check multiple destinations
    if (Array.isArray(address.MultipleDestination)) {
      results.destinations = address.MultipleDestination.map((destination) => ({
        label: destination.label || "Unknown Destination",
        isInside: checkIsPointInGeofence(
          [destination.coordinates.lat, destination.coordinates.lng],
          geofence
        ),
      }));
    }
  } else {
    // Check single origin
    if (address.Origin?.coordinates) {
      results.origins.push({
        label: "Single Origin",
        isInside: checkIsPointInGeofence(
          [address.Origin.coordinates.lat, address.Origin.coordinates.lng],
          geofence
        ),
      });
    }

    // Check single destination
    if (address.Destination?.coordinates) {
      results.destinations.push({
        label: "Single Destination",
        isInside: checkIsPointInGeofence(
          [address.Destination.coordinates.lat, address.Destination.coordinates.lng],
          geofence
        ),
      });
    }
  }

  console.log("Geofence Check Results:", results);
  return results;
}
