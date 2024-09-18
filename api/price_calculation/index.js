import { calculateDistance } from "./distanceCalculator";
import CalcPrice from "./function/CalcPrice";
import userPriceSettings from "./function/helper/userPriceSettings";
import { fetchDocById } from "../firebase/functions/fetch";
import toast from "react-hot-toast";

export default async function ProcessPrice(formData) {
  const notify = (msg) => toast(msg);

  try {
    if (
      !formData?.address?.Origin?.coordinates ||
      !formData?.address?.Destination?.coordinates
    )
      return [];

    const priceSettings = await userPriceSettings();

    const API = await fetchDocById("dev", "data");

    const min_rate = priceSettings?.minServices;
    const rate = priceSettings?.services;
    const gst = priceSettings?.gst?.GST;
    const long_distance = priceSettings?.long_distance;

    const originStr = `${formData?.address?.Origin?.coordinates.lat},${formData?.address?.Origin?.coordinates.lng}`;
    const destinationStr = `${formData?.address?.Destination?.coordinates.lat},${formData?.address?.Destination?.coordinates.lng}`;

    const distance = await calculateDistance(
      originStr,
      destinationStr,
      API?.GOOGLE_MAPS_API
    );
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
      long_distance,
    });

    return booking;
  } catch (error) {
    notify("something went wrong please try again later");
    console.log(error);
    throw error;
  }
}
