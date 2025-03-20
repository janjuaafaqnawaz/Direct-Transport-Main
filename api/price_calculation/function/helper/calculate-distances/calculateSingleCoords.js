"use server";

export default async function calculateSingleCoords(address, apiKey) {
  const key = apiKey;

  const origin = `${address?.Origin?.coordinates.lat},${address?.Origin?.coordinates.lng}`;
  const destination = `${address?.Destination?.coordinates.lat},${address?.Destination?.coordinates.lng}`;

  if (!key) {
    throw new Error("Google Maps API key is not set");
  }

  const url = `https://maps.googleapis.com/maps/api/distancematrix/json?destinations=${destination}&origins=${origin}&units=metric&key=${key}`;

  try {
    const response = await fetch(url);

    if (!response.ok) {
      throw new Error("Failed to fetch distance data");
    }

    const data = await response.json();

    if (data.status !== "OK" || data.rows[0].elements[0].status !== "OK") {
      throw new Error("Invalid distance data received");
    }

    const distanceMeters = data.rows[0].elements[0].distance.value;
    const distanceKM = (distanceMeters / 1000).toFixed(2); // Convert meters to KM
    const durationText = data.rows[0].elements[0].duration.text; // Time required

    return {
      totalDistanceKM: distanceKM,
      totalDuration: durationText,
      details: {
        from: data.origin_addresses[0],
        to: data.destination_addresses[0],
        distance: `${distanceKM} km`,
        duration: durationText,
      },
      readablePath: `${data.origin_addresses[0]} → ${data.destination_addresses[0]} (${distanceKM} km, ${durationText})`,
    };
  } catch (error) {
    console.error("Error fetching distance data:", error);
    throw error;
  }
}
