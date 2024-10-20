import calculateBasePrice from "@/api/price_calculation/function/helper/calculateBasePrice";
import ServiceCharges from "@/api/price_calculation/function/helper/service_charges";
import GstCharges from "@/api/price_calculation/function/helper/gst_charges";
import BasePrice from "@/api/price_calculation/function/truck_pricing/helper/base_price";
import MinuteRate from "@/api/price_calculation/function/truck_pricing/helper/minute_rate";
import userPriceSettings from "@/api/price_calculation/function/helper/userPriceSettings";
import determineReturnAndServiceTypes from "@/api/price_calculation/function/helper/determineReturnAndServiceTypes";

export default async function CalcPrice({ rate, min_rate, gst, formData }) {
  const priceSettings = await userPriceSettings();
  console.log({ priceSettings });

  const resTruckRate = priceSettings?.truckServices ?? {};
  const truckRate = Object.fromEntries(
    Object.entries(resTruckRate).map(([key, value]) => [key, Number(value)])
  );

  const { service, distance, max_volume } = formData;

  let returnType = formData.returnType;
  let price = 0;
  let gst_charges = 0;
  let serviceCharges = 0;
  const requestQuote = false;

  try {
    const minute_rate = MinuteRate(distance);

    price = calculatePrice(
      returnType,
      distance,
      rate,
      min_rate,
      truckRate,
      minute_rate,
      max_volume
    );

    const { charges, serviceCharge } = await ServiceCharges(
      price,
      requestQuote,
      service
    );

    price = charges;
    serviceCharges = serviceCharge;
    gst_charges = await GstCharges(price, gst);

    const booking = {
      ...formData,
      gst: Number(toFixedSafe(gst_charges, 2)),
      totalPrice: toFixedSafe(price, 2),
      totalPriceWithGST: Number(toFixedSafe(price + gst_charges, 2)),
      serviceCharges,
    };

    returnType = determineReturnAndServiceTypes(service, returnType);

    console.log({
      rate,
      min_rate,
      gst,
      formData,
      price,
      gst_charges,
      serviceCharges,
      booking,
      returnType,
    });

    return { ...booking, returnType };
  } catch (err) {
    console.error(`CalcPrice Error: ${err.message}`);
    throw new Error(`Error in price calculation: ${err.message}`);
  }
}

function calculatePrice(
  returnType,
  distance,
  rate,
  min_rate,
  truckRate,
  minute_rate,
  max_volume
) {
  console.log({
    returnType,
    distance,
    rate,
    min_rate,
    truckRate,
    minute_rate,
  });

  switch (returnType) {
    case "LD":
      return distance * (max_volume && max_volume <= 1000 ? 2.1 : 2.5);
    case "Courier":
      return calculateBasePrice(distance, rate["HT"], min_rate["HT"]);
    case "HT":
    case "1T":
    case "2T":
      return calculateBasePrice(
        distance,
        rate[returnType],
        min_rate[returnType]
      );
    case "4T":
    case "6T":
    case "8T":
    case "10T":
    case "12T":
      return BasePrice(truckRate[returnType], minute_rate);
    default:
      throw new Error(`Unsupported returnType: ${returnType}`);
  }
}

function toFixedSafe(value, decimals) {
  return !isNaN(value) ? value.toFixed(decimals) : "0.00";
}
