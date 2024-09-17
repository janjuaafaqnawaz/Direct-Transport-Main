"use server";

export async function calculateDistance(origin, destination, apiKey) {
  const key = apiKey;

  if (!key) {
    throw new Error("Google Maps API key is not set");
  }

  const url = `https://maps.googleapis.com/maps/api/distancematrix/json?destinations=${destination}&origins=${origin}&units=imperial&key=${key}`;

  console.log({ url, origin, destination, apiKey });

  try {
    const response = await fetch(url);

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
