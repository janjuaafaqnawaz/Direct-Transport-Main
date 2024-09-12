import distanceValueKm from "@api/price_calculation/function/helper/distance_in_km";
import calculateItemsVolume from "@api/price_calculation/function/helper/item_volume";
import countItemsByType from "@api/price_calculation/function/helper/items_count";
import calculateBasePrice from "@api/price_calculation/function/helper/calculateBasePrice";
import ServiceCharges from "@api/price_calculation/function/helper/service_charges";
import GstCharges from "@api/price_calculation/function/helper/gst_charges";
import determineReturnAndServiceTypes from "@api/price_calculation/function/helper/determineReturnAndServiceTypes";
import BasePrice from "@api/price_calculation/function/helper/base_price";

import MinuteRate from "@api/price_calculation/function/truck_pricing/helper/minute_rate";

export default async function CalcPrice({
  distanceData,
  rate,
  min_rate,
  gst,
  originStr,
  destinationStr,
  formData,
}) {
  const { items, service, returnType } = formData;

  let price = 0;
  let gst_charges = 0;
  let serviceCharges = 0;

  const distance = await distanceValueKm(distanceData);
  const { max_volume, total_weight, longest_length, palletSpaces } =
    await calculateItemsVolume(items);
  const itemCounts = await countItemsByType(items);
  const minute_rate = MinuteRate(distance);

  switch (returnType) {
    case "LD":
      break;
    case "HT":
      price = calculateBasePrice(distance, rate["HT"], min_rate["HT"]);

      break;
    case "1T":
      price = calculateBasePrice(distance, rate["1T"], min_rate["1T"]);

      break;
    case "2T":
      price = calculateBasePrice(distance, rate["2T"], min_rate["2T"]);

      break;
    case "4T":
      price = BasePrice(rate[rateType.type], minute_rate);

      break;
    case "6T":
      price = BasePrice(rate[rateType.type], minute_rate);

      break;
    case "8T":
      price = BasePrice(rate[rateType.type], minute_rate);

      break;
    case "10T":
      price = BasePrice(rate[rateType.type], minute_rate);

      break;
    case "12T":
      price = BasePrice(rate[rateType.type], minute_rate);

      break;
    default:
  }

  const { charges, serviceCharge } = await ServiceCharges(
    price,
    requestQuote,
    service
  );

  price = charges;
  serviceCharges = serviceCharge;
  gst_charges = await GstCharges(price, gst);

  returnType = determineReturnAndServiceTypes(service, returnType);

  console.info({
    pricing: {
      price,
      tolls,
      requestQuote,
      returnType,
    },

    extra_charges: {
      rate,
      min_rate,
      gst_charges,
    },

    distance_and_volume: {
      distance,
      max_volume,
      total_weight,
      longest_length,
      distanceData,
      palletSpaces,
      itemCounts,
    },

    Booking: {
      ...formData,
    },

    location: {
      originStr,
      destinationStr,
    },
  });

  function toFixedSafe(value, decimals) {
    if (typeof value === "number" && !isNaN(value)) {
      return value.toFixed(decimals);
    }
    return "0.00";
  }

  return {
    gst: Number(toFixedSafe(gst_charges, 2)),
    totalPrice: toFixedSafe(price, 2),
    totalPriceWithGST: Number(toFixedSafe(price + gst_charges, 2)),
    palletSpaces,
    serviceCharges,
    ...formData,
  };
}
