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

    const booking_type = formData?.type;

    const priceSettings = await userPriceSettings(formData?.selectedEmail);

    const API = await fetchDocById("dev", "data");

    const min_rate = priceSettings?.same_day?.minServices;
    const rate = priceSettings?.same_day?.services;
    const gst = priceSettings?.same_day?.gst?.GST;
    const long_distance = priceSettings?.same_day?.long_distance;

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
      booking_type,
    });

    return booking;
  } catch (error) {
    notify("something went wrong please try again later");
    console.log(error);
    throw error;
  }
}
