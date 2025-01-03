"use server";

export default async function getCurrentTime(maxRetries = 25, delay = 1000) {
  let attempts = 0;

  while (attempts < maxRetries) {
    try {
      const response = await fetch(
        "http://worldtimeapi.org/api/timezone/Australia/Sydney?nocache=" +
          Date.now(),
        { cache: "no-store" }
      );

      if (!response.ok) {
        throw new Error("Failed to fetch time data.");
      }

      const data = await response.json();

      const datetime = new Date(data.datetime);

      // Ensure the datetime is valid and not stale (example validation)
      if (!isNaN(datetime.getTime())) {
        const seconds = Math.floor(datetime.getTime() / 1000);
        const nanoseconds = (datetime.getTime() % 1000) * 1_000_000;

        return {
          seconds,
          nanoseconds,
        };
      } else {
        throw new Error("Invalid datetime data.");
      }
    } catch (error) {
      console.error(`Attempt ${attempts + 1} failed: ${error.message}`);
      attempts++;

      if (attempts >= maxRetries) {
        throw new Error(
          "Max retries reached. Unable to fetch valid time data."
        );
      }

      // Wait before retrying
      await new Promise((resolve) => setTimeout(resolve, delay));
    }
  }
}
