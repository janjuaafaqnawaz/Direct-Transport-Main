import distanceValueKm from "./helper/distance_in_km";
import calculateItemsVolume from "./helper/item_volume";
import countItemsByType from "./helper/items_count";
import calculateBasePrice from "./helper/calculateBasePrice";
import isPointInGeofence from "./helper/isPointInGeofence";
import ServiceCharges from "./helper/service_charges";
import GstCharges from "./helper/gst_charges";
import determineReturnAndServiceTypes from "./helper/determineReturnAndServiceTypes";
import determinePriceByPallet from "./determine_price_by_item/determinePriceByPallet";
import determineLadderRackPipesPrice from "./determine_price_by_item/determineLadderRackPipesPrice";
import determinePriceBySkid from "./determine_price_by_item/determinePriceBySkid";
import { fetchTollsData } from "@/api/fetchTolls";
import TruckPricing from "./truck_pricing";
import LongDistancePricing from "./long_distance_pricing";
import toast from "react-hot-toast";

export default async function CalcPrice({
  distanceData,
  rate,
  min_rate,
  gst,
  originStr,
  destinationStr,
  formData,
  priceSettings,
  long_distance,
  booking_type,
}) {
  const { items, service, address } = formData;

  let price = 0;
  let tolls = 0;
  let gst_charges = 0;
  let serviceCharges = 0;
  let returnType = "N/A";
  let requestQuote = false;

  const distance = await distanceValueKm(distanceData);
  const { max_volume, total_weight, longest_length, palletSpaces } =
    await calculateItemsVolume(items);
  const itemCounts = await countItemsByType(items);

  const { isOriginInside, isDestinationInside } = await isPointInGeofence(
    address
  );

  if (booking_type === "same_day") {
    ({ price, returnType } = await determinePricingAndReturnType({
      distance,
      max_volume,
      longest_length,
      total_weight,
      rate,
      min_rate,
      items,
      long_distance,
      isOriginInside,
      isDestinationInside,
      itemCounts,
    }));
    // console.log("Same day pricing applying");
  } else {
    ({ price, returnType } = await determineNFDayPricingAndReturnType({
      distance,
      max_volume,
      longest_length,
      total_weight,
      rate,
      min_rate,
      items,
      long_distance,
      isOriginInside,
      isDestinationInside,
      itemCounts,
      priceSettings,
      booking_type,
    }));
    // console.log("Near future pricing applying");
  }

  const { charges, serviceCharge } = await ServiceCharges(
    price,
    requestQuote,
    service
  );

  const origin = { address: formData.address.Origin.label };
  const destination = { address: formData.address.Destination.label };
  const requestBody = {
    from: origin,
    to: destination,
    serviceProvider: "here",
    vehicle: {
      type: ["6T", "8T", "10T", "12T", "LD"].includes(returnType)
        ? "2AxlesTruck"
        : "2AxlesTaxi",
        axles: 2,
      //   weight: { value: 20000, unit: "pound" },
      //   height: { value: 7.5, unit: "meter" },
      //   length: { value: 7.5, unit: "meter" },
      // emissionClass: "euro_5",
    },
  };
  console.log("requestBody", requestBody);
  if (service !== "Standard") {
    const requestBodyStr = JSON.stringify(requestBody);
    // console.log({ requestBodyStr, requestBody });
    tolls = await fetchTollsData(requestBodyStr);
  }

  returnType = determineReturnAndServiceTypes(
    service,
    returnType,
    booking_type
  );

  const additional =
    booking_type === "same_day"
      ? priceSettings?.same_day?.additional?.additional ||
        priceSettings?.additional?.additional ||
        0
      : 0;

  price = charges;
  serviceCharges = serviceCharge;
  gst_charges = await GstCharges(Number(price) + Number(additional), gst);

  console.info({
    pricing: {
      price,
      tolls,
      requestQuote,
      returnType,
      booking_type,
      additional,
      priceSettings,
    },

    extra_charges: {
      rate,
      min_rate,
      gst_charges,
      service,
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
    return 0;
  }

  const priceWithAdditional = toFixedSafe(
    Number(price) + Number(additional) || 0,
    2
  );

  return {
    gst: Number(toFixedSafe(gst_charges, 2)),
    totalPrice: priceWithAdditional,
    totalPriceWithGST: Number(
      toFixedSafe(Number(priceWithAdditional) + Number(gst_charges), 2)
    ),
    totalTolls: tolls?.totalTolls || 0,
    totalTollsCost: tolls?.totalTollsCost || 0,
    returnType,
    requestQuote,
    palletSpaces,
    distanceData: distanceData,
    serviceCharges,
    distance,
    ...formData,
  };
}
async function determineNFDayPricingAndReturnType({
  distance,
  max_volume,
  longest_length,
  total_weight,
  rate,
  min_rate,
  items,
  long_distance,
  isOriginInside,
  isDestinationInside,
  itemCounts,
  priceSettings,
  booking_type,
}) {
  if (isOriginInside && isDestinationInside) {
    toast.error(
      "Both addresses are inside the non allowed area. Please select valid locations."
    );
    setTimeout(() => {
      navigate("/ClientServices");
    }, 4000);
  }

  // Destructure the response from determinePricingAndReturnType
  const { price: basePrice, returnType } = await determinePricingAndReturnType({
    distance,
    max_volume,
    longest_length,
    total_weight,
    rate,
    min_rate,
    items,
    long_distance,
    isOriginInside,
    isDestinationInside,
    itemCounts,
    isLdDisabled: true,
  });

  const futureRate = priceSettings?.[booking_type]?.services?.[returnType] ?? 1;

  if (futureRate === 1) {
    console.warn(
      `Warning: No future rate found for booking type: ${booking_type} and return type: ${returnType}.`
    );
  }

  // Ensure that distance is a valid number before multiplication
  const finalPrice = distance * Number(futureRate);

  return { price: finalPrice || basePrice, returnType };
}

async function determinePricingAndReturnType({
  distance,
  max_volume,
  longest_length,
  total_weight,
  rate,
  min_rate,
  items,
  long_distance,
  isOriginInside,
  isDestinationInside,
  itemCounts,
  isLdDisabled,
}) {
  const {
    Ladder,
    Rack,
    Pipes,
    Pallet,
    Skid,
    Timber,
    Steel,
    Aluminum,
    Conduit,
    Tubes,
  } = itemCounts;
  let price = 0;
  let returnType = "N/A";

  if ((!isOriginInside || !isDestinationInside) && isLdDisabled !== true) {
    ({ price, returnType } = await LongDistancePricing(
      max_volume,
      long_distance,
      distance,
      items,
      total_weight,
      longest_length,
      rate,
      min_rate,
      Ladder,
      Rack,
      Pipes,
      Timber,
      Steel,
      Aluminum,
      Conduit,
      Tubes,
      Pallet,
      Skid
    ));
    returnType = "LD";
  } else if (
    Ladder.exist ||
    Rack.exist ||
    Pipes.exist ||
    Timber.exist ||
    Steel.exist ||
    Aluminum.exist ||
    Conduit.exist ||
    Tubes.exist
  ) {
    ({ price, returnType } = await determineLadderRackPipesPrice(
      distance,
      total_weight,
      max_volume,
      longest_length,
      rate,
      min_rate,
      items
    ));
  } else if (max_volume > 1000 || longest_length > 270) {
    const { cost, costType } = await TruckPricing(distance, items);
    price = cost;
    returnType = costType;
  } else if (Pallet.exist && max_volume <= 1000) {
    ({ price, returnType } = await determinePriceByPallet(
      distance,
      Pallet.count,
      rate,
      min_rate,
      max_volume,
      items
    ));
  } else if (Skid.exist) {
    ({ price, returnType } = await determinePriceBySkid(
      distance,
      Skid.count,
      rate,
      min_rate
    ));
  } else if (total_weight <= 25 && longest_length < 100 && max_volume <= 25) {
    price = calculateBasePrice(distance, rate["Courier"], min_rate["Courier"]);
    returnType = "Courier";
  } else if (longest_length <= 400 && max_volume <= 500) {
    price = calculateBasePrice(distance, rate["HT"], min_rate["HT"]);
    returnType = "HT";
  } else if (max_volume <= 1000) {
    price = calculateBasePrice(distance, rate["1T"], min_rate["1T"]);
    returnType = "1T";
  } else {
    const { cost, costType } = await TruckPricing(distance, items);
    price = cost;
    returnType = costType;
  }

  return { price, returnType };
}
