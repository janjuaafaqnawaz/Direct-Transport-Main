import calculateBasePrice from "@/api/price_calculation/function/helper/calculateBasePrice";
import ServiceCharges from "@/api/price_calculation/function/helper/service_charges";
import GstCharges from "@/api/price_calculation/function/helper/gst_charges";
import BasePrice from "@/api/price_calculation/function/truck_pricing/helper/base_price";
import MinuteRate from "@/api/price_calculation/function/truck_pricing/helper/minute_rate";
import userPriceSettings from "@/api/price_calculation/function/helper/userPriceSettings";

export default async function CalcPrice({ rate, min_rate, gst, formData }) {
  const priceSettings = await userPriceSettings();
  console.log({ priceSettings });

  const resTruckRate = priceSettings?.truckServices;
  const truckRate = Object.fromEntries(
    Object.entries(resTruckRate).map(([key, value]) => [key, Number(value)])
  );

  const { service, returnType, distance } = formData;

  let price = 0;
  let gst_charges = 0;
  let serviceCharges = 0;
  let requestQuote = false;
  let serviceType = service;

  try {
    const minute_rate = MinuteRate(distance);

    switch (returnType) {
      case "LD":
        price = distance * (max_volume <= 1000 ? 2.1 : 2.5);
        break;
      case "Courier":
        price = calculateBasePrice(distance, rate["HT"], min_rate["HT"]);
        break;
      case "HT":
      case "1T":
      case "2T":
        price = calculateBasePrice(
          distance,
          rate[returnType],
          min_rate[returnType]
        );
        break;
      case "4T":
      case "6T":
      case "8T":
      case "10T":
      case "12T":
        price = BasePrice(truckRate[returnType], minute_rate);
        break;
      default:
        throw new Error(`Unsupported returnType: ${returnType}`);
    }

    const { charges, serviceCharge } = await ServiceCharges(
      price,
      requestQuote,
      serviceType
    );

    price = charges;
    serviceCharges = serviceCharge;
    gst_charges = await GstCharges(price, gst);

    function toFixedSafe(value, decimals) {
      return typeof value === "number" && !isNaN(value)
        ? value.toFixed(decimals)
        : "0.00";
    }

    console.log({
      rate,
      min_rate,
      gst,
      formData,
      price,
      gst_charges,
      serviceCharges,
    });

    return {
      gst: Number(toFixedSafe(gst_charges, 2)),
      totalPrice: toFixedSafe(price, 2),
      totalPriceWithGST: Number(toFixedSafe(price + gst_charges, 2)),
      serviceCharges,
      ...formData,
    };
  } catch (err) {
    console.error(`CalcPrice Error: ${err.message}`);
    throw new Error(`Error in price calculation: ${err.message}`);
  }
}
