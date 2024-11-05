"use server";

const TOLL_GURU_API_KEY = "LMNGh9GGfT8QdpJf8LnPFj2QT6fpD84h";

export async function fetchTollsData(requestBodyStr) {
  const url = "https://apis.tollguru.com/toll/v2/origin-destination-waypoints";

  try {
    const res = await fetch(url, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        "x-api-key": TOLL_GURU_API_KEY,
      },
      body: requestBodyStr,
    });

    // Check for HTTP errors
    if (!res.ok) {
      throw new Error(
        `HTTP error! Status: ${res.status}, Message: ${await res.text()}`
      );
    }

    const data = await res.json();
    console.log("Fetched data:", data);

    // Validate the routes data
    if (!data.routes || !Array.isArray(data.routes)) {
      throw new Error("Routes data is missing or invalid.");
    }

    let totalTollsCost = 0;

    data.routes.forEach((route) => {
      const costs = route.costs || {};
      console.log("costs", costs);

      const price = costs.tagAndCash || 0;

      if (price > totalTollsCost) {
        totalTollsCost = price;
      }
    });

    const result = {
      totalTollsCost: totalTollsCost.toFixed(2),
      totalTolls: data.routes.length,
      fullResponse: data,
    };

    return result;
  } catch (error) {
    console.error("Error fetching toll data:", error);
    throw new Error("Failed to fetch toll data: " + error.message);
  }
}
