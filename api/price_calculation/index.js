import CalcDistanceDynamically from "./function/helper/calculate-distances/CalcDistanceDynamically";
import CalcPrice from "./function/CalcPrice";
import userPriceSettings from "./function/helper/userPriceSettings";
import toast from "react-hot-toast";

export default async function ProcessPrice(formData) {
  const notify = (msg) => toast(msg);

  try {
    const booking_type = formData?.type;

    const priceSettings = await userPriceSettings(formData?.selectedEmail);

    const min_rate = priceSettings?.same_day?.minServices;
    const rate = priceSettings?.same_day?.services;
    const gst = priceSettings?.same_day?.gst?.GST;
    const long_distance = priceSettings?.same_day?.long_distance;

    const distanceData = await CalcDistanceDynamically(formData?.address);

    const booking = await CalcPrice({
      distanceData,
      rate,
      min_rate,
      gst,
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
