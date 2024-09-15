"use server";

export async function calculateDistance(origin, destination, GOOGLE_MAPS_API) {
  try {
    const response = await fetch(
      `https://maps.googleapis.com/maps/api/distancematrix/json?destinations=${destination}&origins=${origin}&units=imperial&key=${GOOGLE_MAPS_API}`
    );

    if (!response.ok) {
      throw new Error("Failed to fetch distance data");
    }

    const data = await response.json();
    return data;
  } catch (error) {
    console.error("Error fetching data:", error);
    throw error;
  }
}
