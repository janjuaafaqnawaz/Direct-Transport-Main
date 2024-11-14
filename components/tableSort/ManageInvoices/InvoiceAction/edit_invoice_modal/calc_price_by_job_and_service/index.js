import CalcPrice from "./CalcPrice";
import userPriceSettings from "@/api/price_calculation/function/helper/userPriceSettings";

export default async function ProcessPrice(formData) {
  try {
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
    const global = true;
    const priceSettings = await userPriceSettings(global);
    if (!priceSettings || typeof priceSettings !== "object") {
      throw new Error("Price settings could not be retrieved or are invalid.");
    }

    const booking = await CalcPrice({
      formData,
      priceSettings,
    });

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
