import { calculateDistance } from "./distanceCalculator";
import CalcPrice from "./function/CalcPrice";
import userPriceSettings from "./function/helper/userPriceSettings";
import { fetchDocById } from "../firebase/functions/fetch";

export default async function ProcessPrice(formData) {
  if (
    !formData?.address?.Origin?.coordinates ||
    !formData?.address?.Destination?.coordinates
  )
    return [];

  const priceSettings = await userPriceSettings();

  // const API = await fetchDocById("dev", "data");

  console.log({ GOOGLE_MAPS_API });

  const min_rate = priceSettings?.minServices;
  const rate = priceSettings?.services;
  const gst = priceSettings?.gst?.GST;

  const originStr = `${formData?.address?.Origin?.coordinates.lat},${formData?.address?.Origin?.coordinates.lng}`;
  const destinationStr = `${formData?.address?.Destination?.coordinates.lat},${formData?.address?.Destination?.coordinates.lng}`;

  const distance = await calculateDistance(originStr, destinationStr);
  const distanceData = distance?.rows[0]?.elements[0]?.distance;

  const booking = await CalcPrice({
    distanceData,
    distance,
    rate,
    min_rate,
    gst,
    originStr,
    destinationStr,
    formData,
    priceSettings,
  });

  return booking;
}
