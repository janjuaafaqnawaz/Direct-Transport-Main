import CalcPrice from "./CalcPrice";
import userPriceSettings from "@/api/price_calculation/function/helper/userPriceSettings";

export default async function ProcessPrice(formData) {
  try {
    // Ensure formData is available
    if (!formData) throw new Error("formData is required but not provided.");

    const { distanceData: formDistanceData } = formData || {};
    if (!formDistanceData || !formDistanceData.distance) {
      throw new Error("Distance data is missing in formData.");
    }

    let priceSettings;
    try {
      // Fetch price settings
      priceSettings = await userPriceSettings();
      if (!priceSettings) {
        throw new Error("Price settings could not be retrieved.");
      }
    } catch (err) {
      throw new Error(`Error fetching user price settings: ${err.message}`);
    }

    const {
      minServices: min_rate,
      services: rate,
      gst: { GST: gst } = {},
    } = priceSettings || {};

    if (!min_rate || !rate || gst === undefined) {
      throw new Error(
        "Incomplete price settings (minServices, services, or GST is missing)."
      );
    }

    let distanceData = formDistanceData.distance;

    let booking;
    try {
      // Call CalcPrice to process the booking
      booking = await CalcPrice({
        distanceData,
        rate,
        min_rate,
        gst,
        formData,
        priceSettings,
      });
    } catch (err) {
      throw new Error(`Error calculating price: ${err.message}`);
    }

    // Return the booking result
    return booking;
  } catch (err) {
    console.error(`ProcessPrice Error: ${err.message}`);
    throw err; // Optionally rethrow the error if you want it to propagate further
  }
}
