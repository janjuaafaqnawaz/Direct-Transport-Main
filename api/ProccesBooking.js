import { calculatePrice } from "@/api/priceCalculator";
import { calculateDistance } from "@/api/distanceCalculator";
import { fetchTollsData } from "@/api/fetchTolls";
// import { fetchDocById } from "./firebase/functions/fetch";

async function processBooking(data, fetchTolls) {
  console.log("Price Processing:", data, "fetchTolls:", fetchTolls);

  // Calculate distance between origin and destination
  const distance = await calculateDistance(
    data.address.Origin.coordinates,
    data.address.Destination.coordinates
  );
  const distanceData = distance?.rows[0]?.elements[0];

  let tolls = {
    totalTolls: data?.totalTolls || 0,
    totalTollsCost: data?.totalTollsCost || 0,
  };

  if (data.service !== "Standard" && !fetchTolls) {
    console.log("fetching Tolls");
    tolls = await fetchTollsData(
      data.address.Origin.coordinates,
      data.address.Destination.coordinates
    );
  }

  // Calculate invoice data including price
  const invoiceData = await calculatePrice({
    ...data,
    distanceData: distanceData,
    totalTolls: data?.totalTolls || tolls?.totalTolls || 0,
    totalTollsCost:
      Math.ceil(data?.totalTollsCost) || Math.ceil(tolls?.totalTollsCost) || 0,
  });

  return { ...invoiceData };
}

export default processBooking;
