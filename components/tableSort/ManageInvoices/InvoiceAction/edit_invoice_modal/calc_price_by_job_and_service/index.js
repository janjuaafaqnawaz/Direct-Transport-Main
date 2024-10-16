import CalcPrice from "./CalcPrice";
import userPriceSettings from "@/api/price_calculation/function/helper/userPriceSettings";

export default async function ProcessPrice(formData) {
  try {
    // Ensure formData is available and validate its structure
    if (!formData) {
      throw new Error("formData is required and must be an object.");
    }

    if (
      !formData.service ||
      !formData.returnType ||
      typeof formData.distance !== "number"
    ) {
      throw new Error(
        "formData is missing required fields or has invalid types."
      );
    }

    // Fetch user price settings
    const priceSettings = await userPriceSettings();
    if (!priceSettings || typeof priceSettings !== "object") {
      throw new Error("Price settings could not be retrieved or are invalid.");
    }

    // Destructure the necessary fields from priceSettings with type checking
    const job_type_price_settings = priceSettings?.same_day;

    const {
      long_distance,
      minServices: min_rate,
      services: rate,
      gst: { GST: gst } = { GST: 0 },
    } = job_type_price_settings;

    // Validate if all necessary settings exist and have correct types
    if (
      typeof min_rate !== "object" ||
      typeof rate !== "object" ||
      typeof gst !== "number"
    ) {
      throw new Error(
        "Incomplete or invalid price settings (minServices, services, or GST is missing or has wrong type)."
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

    // Validate the booking result

    // Return the booking result
    return booking;
  } catch (err) {
    console.error(
      `ProcessPrice Error: ${err instanceof Error ? err.message : String(err)}`
    );
    throw new Error(
      `ProcessPrice failed: ${err instanceof Error ? err.message : String(err)}`
    );
  }
}
