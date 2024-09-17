import { calculateDistance } from "./distanceCalculator";
import CalcPrice from "./function/CalcPrice";
import userPriceSettings from "./function/helper/userPriceSettings";
import { fetchDocById } from "../firebase/functions/fetch";
import toast from "react-hot-toast";
import { useRouter } from "next/navigation";

export default async function ProcessPrice(formData) {
  const notify = (msg) => toast(msg);

  try {
    if (
      !formData?.address?.Origin?.address ||
      !formData?.address?.Destination?.address
    )
      return [];

    const priceSettings = await userPriceSettings();

    const API = await fetchDocById("dev", "data");

    const min_rate = priceSettings?.minServices;
    const rate = priceSettings?.services;
    const gst = priceSettings?.gst?.GST;

    const originStr = `${formData?.address?.Origin?.address.latitude},${formData?.address?.Origin?.address.longitude}`;
    const destinationStr = `${formData?.address?.Destination?.address.latitude},${formData?.address?.Destination?.address.longitude}`;

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
    });

    return booking;
  } catch (error) {
    notify("something went wrong please try again later");
    console.log(error);
  }
}
