import CalcPrice from "./CalcPrice";
import userPriceSettings from "@/api/price_calculation/function/helper/userPriceSettings";

export default async function ProcessPrice(formData) {
  try {
    // Ensure formData is available
    if (!formData) {
      throw new Error("formData is required but not provided.");
    }

    // Fetch user price settings
    const priceSettings = await userPriceSettings();
    if (!priceSettings) {
      throw new Error("Price settings could not be retrieved.");
    }

    // Destructure the necessary fields from priceSettings
    const {
      minServices: min_rate,
      services: rate,
      gst: { GST: gst } = {},
    } = priceSettings;
    

    // Validate if all necessary settings exist
    if (min_rate === undefined || rate === undefined || gst === undefined) {
      throw new Error(
        "Incomplete price settings (minServices, services, or GST is missing)."
      );
    }

    // Calculate the price
    const booking = await CalcPrice({
      rate,
      min_rate,
      gst,
      formData,
      priceSettings,
    });

    // Return the booking result
    return booking;

  } catch (err) {
    console.error(`ProcessPrice Error: ${err.message}`);
    throw new Error(`ProcessPrice failed: ${err.message}`);
  }
}
