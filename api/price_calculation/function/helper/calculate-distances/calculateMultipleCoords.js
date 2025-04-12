"use server";
import getSuburbByLatLng from "@/api/getSuburbByLatLng";

export default async function calculateMultipleCoords(address, apiKey) {
  const key = apiKey;

  if (!key) {
    throw new Error("Google Maps API key is missing");
  }

  let locations = [];

  // Add origins first
  if (address?.MultipleOrigin?.length) {
    locations.push(
      ...address.MultipleOrigin.map((loc) => ({
        label: loc.label,
        coordinates: loc.coordinates,
        type: "origin",
      }))
    );
  }

  // Add destinations
  if (address?.MultipleDestination?.length) {
    locations.push(
      ...address.MultipleDestination.map((loc) => ({
        label: loc.label,
        coordinates: loc.coordinates,
        type: "destination",
      }))
    );
  }

  // If we don't have enough locations, return empty result
  if (locations.length < 2) {
    return {
      totalDistanceKM: 0,
      steps: [],
      readablePath: "Not enough locations",
    };
  }

  let totalDistance = 0;

  // Distance calculation
  for (let i = 0; i < locations.length - 1; i++) {
    const origin = `${locations[i].coordinates.lat},${locations[i].coordinates.lng}`;
    const destination = `${locations[i + 1].coordinates.lat},${locations[i + 1].coordinates.lng}`;

    const url = `https://maps.googleapis.com/maps/api/distancematrix/json?origins=${origin}&destinations=${destination}&units=metric&key=${key}`;

    try {
      const response = await fetch(url);
      const data = await response.json();

      if (data.status === "OK" && data.rows[0].elements[0].status === "OK") {
        const distanceKM = data.rows[0].elements[0].distance.value / 1000; // Convert meters to KM
        totalDistance += distanceKM;
      } else {
        console.error("Error in API response:", data);
        throw new Error("Failed to fetch distance data from Google Maps API");
      }
    } catch (error) {
      console.error("Error fetching distance:", error);
      throw new Error("Failed to calculate distance due to an error");
    }
  }

  // Fetch suburbs for all locations (use label, not coordinates)
  const suburbPromises = locations.map(async (loc) => {
    let suburb = await getSuburbByLatLng(loc.label);
    if (!suburb) {
      console.warn("No suburb found for:", loc.label);
      suburb = "Unknown";
    }

    return {
      label: loc.label,
      type: loc.type,
      coordinates: loc.coordinates,
      suburb,
    };
  });

  const suburbs = await Promise.all(suburbPromises);

  console.log({ suburbs });

  return {
    totalDistanceKM: totalDistance.toFixed(2),
    suburbs,
  };
}
