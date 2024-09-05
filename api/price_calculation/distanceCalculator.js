"use server";

import { headers } from "next/headers";

export async function calculateDistance(origin, destination) {
  const key = "AIzaSyBwepwcfkMunudUU-GVoc3AlSR-fTSOXAQ";

  if (!key) {
    throw new Error("Google Maps API key is not set");
  }

  try {
    const response = await fetch(
      `https://maps.googleapis.com/maps/api/distancematrix/json?destinations=${destination}&origins=${origin}&units=imperial&key=${key}`,
      { headers: headers() }
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
