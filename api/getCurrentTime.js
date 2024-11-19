"use server";

export default async function getCurrentTime() {
  const response = await fetch(
    "http://worldtimeapi.org/api/timezone/Australia/Sydney"
  );

  if (!response.ok) {
    throw new Error("Failed to fetch time data.");
  }

  const data = await response.json();

  const datetime = new Date(data.datetime);

  // Convert to seconds and nanoseconds
  const seconds = Math.floor(datetime.getTime() / 1000);
  const nanoseconds = (datetime.getTime() % 1000) * 1_000_000;

  return {
    seconds,
    nanoseconds,
  };
}
