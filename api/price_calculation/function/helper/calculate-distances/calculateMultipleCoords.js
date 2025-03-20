"use server";

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
      }))
    );
  }

  // Add destinations
  if (address?.MultipleDestination?.length) {
    locations.push(
      ...address.MultipleDestination.map((loc) => ({
        label: loc.label,
        coordinates: loc.coordinates,
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
  let steps = [];
  let readablePath = [];

  for (let i = 0; i < locations.length - 1; i++) {
    const origin = `${locations[i].coordinates.lat},${locations[i].coordinates.lng}`;
    const destination = `${locations[i + 1].coordinates.lat},${
      locations[i + 1].coordinates.lng
    }`;

    const url = `https://maps.googleapis.com/maps/api/distancematrix/json?origins=${origin}&destinations=${destination}&units=metric&key=${key}`;

    try {
      const response = await fetch(url);
      const data = await response.json();

      console.log("API Response:", data); // Debugging

      if (data.status === "OK" && data.rows[0].elements[0].status === "OK") {
        const distanceKM = data.rows[0].elements[0].distance.value / 1000; // Convert meters to KM
        const durationText = data.rows[0].elements[0].duration.text; // Travel time
        totalDistance += distanceKM;

        // Add step details
        steps.push({
          from: locations[i].label,
          to: locations[i + 1].label,
          distance: `${distanceKM.toFixed(2)} km`,
          duration: durationText,
        });

        // Add readable path
        readablePath.push(
          `${locations[i].label} → ${
            locations[i + 1].label
          } (${distanceKM.toFixed(2)} km, ${durationText})`
        );
      } else {
        console.error("Error in API response:", data);
        throw new Error("Failed to fetch distance data from Google Maps API");
      }
    } catch (error) {
      console.error("Error fetching distance:", error);
      throw new Error("Failed to calculate distance due to an error");
    }
  }

  return {
    totalDistanceKM: totalDistance.toFixed(2),
    steps,
    readablePath: readablePath.join(" → "),
  };
}
