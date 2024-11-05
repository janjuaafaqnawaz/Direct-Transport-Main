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

    if (!res.ok) {
      throw new Error(`HTTP error! status: ${res.status}`);
    }

    const data = await res.json();
    console.log("data", data);

    if (!data.routes || !Array.isArray(data.routes)) {
      throw new Error("Routes data is missing or invalid.");
    }

    let totalTolls = 0;
    let totalTollsCost = 0;

    data.routes.forEach((route) => {
      if (route.tolls && Array.isArray(route.tolls)) {
        route.tolls.forEach((toll) => {
          totalTollsCost += toll.tagCost || toll.cashCost || 0;
          totalTolls++;
        });
      }
    });

    console.log("routes", data.routes);

    return {
      totalTollsCost:
        data?.routes[0]?.costs?.maximumTollCost ||
        data?.routes[0]?.costs?.minimumTollCost,
      totalTolls: totalTolls,
      fullResponse: data,
    };
  } catch (error) {
    console.error("Error fetching toll data:", error);
    throw new Error("Failed to fetch toll data");
  }
}
