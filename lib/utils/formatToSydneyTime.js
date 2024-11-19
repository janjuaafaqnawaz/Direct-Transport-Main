import { DateTime } from "luxon";

export default function formatToSydneyTime(createdAt) {
  if (!createdAt?.seconds || createdAt?.nanoseconds === undefined)
    return "Invalid date";

  const timestamp = createdAt.seconds * 1000 + createdAt.nanoseconds / 1000000;

  // Convert timestamp to Sydney time
  const sydneyTime = DateTime.fromMillis(timestamp, {
    zone: "Australia/Sydney",
  });

  // Format the date in "dd/MM/yyyy hh:mm a"
  return sydneyTime.toFormat("dd/MM/yyyy hh:mm a");
}

// Example usage
const row = {
  createdAt: { seconds: 1697356800, nanoseconds: 500000000 }, // Example Firestore timestamp
};

console.log(formatToSydneyTime(row.createdAt)); // Output: e.g., "15/10/2024 02:00 PM"
