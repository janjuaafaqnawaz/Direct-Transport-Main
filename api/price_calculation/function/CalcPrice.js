import distanceValueKm from "./helper/distance_in_km";
import calculateItemsVolume from "./helper/item_volume";
import countItemsByType from "./helper/items_count";
import calculateBasePrice from "./helper/calculateBasePrice";
import overCorrectSmallReturnType from "./helper/overCorrectSmallReturnType";
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
import correctReturnType from "./helper/correctReturnType";
import toFixedSafe from "./helper/toFixedSafe";

export default async function CalcPrice({
  distanceData,
  rate,
  min_rate,
  gst,
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
  let returnTypeBackup = "";

  const distance = distanceData?.totalDistanceKM;
  if (!distance) {
    toast.error("Distance not found. Please try again later.");
    setTimeout(() => {
      navigate("/ClientServices");
    }, 4000);
  }

  const {
    max_volume,
    total_weight,
    longest_length,
    longest_height,
    longest_width,
    palletSpaces,
  } = await calculateItemsVolume(items);
  const itemCounts = await countItemsByType(items);

  const { isOriginInside, isDestinationInside } = await isPointInGeofence(
    address
  );

  if (booking_type === "same_day") {
    ({ price, returnType, returnTypeBackup } =
      await determinePricingAndReturnType({
        distance,
        max_volume,
        longest_length,
        longest_height,
        longest_width,
        total_weight,
        rate,
        min_rate,
        items,
        long_distance,
        isOriginInside,
        isDestinationInside,
        itemCounts,
      }));
  } else {
    ({ price, returnType, returnTypeBackup } =
      await determineNFDayPricingAndReturnType({
        distance,
        max_volume,
        longest_length,
        longest_height,
        longest_width,
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
  }

  const { charges, serviceCharge } = await ServiceCharges(
    price,
    requestQuote,
    service
  );

  const correctedReturnType = correctReturnType(returnType, returnTypeBackup);
  const origin = { address: formData.address.Origin.label };
  const destination = { address: formData.address.Destination.label };
  const requestBody = {
    from: origin,
    to: destination,
    serviceProvider: "here",
    vehicle: {
      type: ["6T", "8T", "10T", "12T"].includes(correctedReturnType)
        ? "2AxlesTruck"
        : "2AxlesTaxi",
      axles: 2,
    },
  };
  if (service !== "Standard") {
    const requestBodyStr = JSON.stringify(requestBody);
    tolls = await fetchTollsData(requestBodyStr);
  }

  returnType = determineReturnAndServiceTypes(
    service,
    returnType,
    booking_type,
    longest_height,
    longest_width
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
      returnTypeBackup,
      correctedReturnType,
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

    path_details: {
      requestBody,
    },
  });

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
    returnTypeBackup,
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
  longest_height,
  longest_width,
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
  const {
    price: basePrice,
    returnType,
    returnTypeBackup,
  } = await determinePricingAndReturnType({
    distance,
    max_volume,
    longest_length,
    longest_height,
    longest_width,
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

  return { price: finalPrice || basePrice, returnType, returnTypeBackup };
}

async function determinePricingAndReturnType({
  distance,
  max_volume,
  longest_length,
  longest_height,
  longest_width,
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
  const correctSmallReturnType = overCorrectSmallReturnType(
    longest_height,
    longest_width,
    longest_length
  );

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
  let returnTypeBackup = "";

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
      Skid,
      correctSmallReturnType
    ));
    returnTypeBackup = returnType;
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
      items,
      correctSmallReturnType
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
      items,
      correctSmallReturnType
    ));
  } else if (Skid.exist) {
    ({ price, returnType } = await determinePriceBySkid(
      distance,
      Skid.count,
      rate,
      min_rate,
      correctSmallReturnType
    ));
  } else if (total_weight <= 25 && longest_length < 100 && max_volume <= 25) {
    const type = correctSmallReturnType("Courier");
    price = calculateBasePrice(distance, rate[type], min_rate[type]);
    returnType = type;
  } else if (total_weight <= 25 && longest_length < 100 && max_volume <= 25) {
    const type = correctSmallReturnType("Courier");
    price = calculateBasePrice(distance, rate[type], min_rate[type]);
    returnType = type;
  } else if (longest_length <= 400 && max_volume <= 500) {
    const type = correctSmallReturnType("HT");
    price = calculateBasePrice(distance, rate[type], min_rate[type]);
    returnType = type;
  } else if (max_volume <= 1000) {
    const type = correctSmallReturnType("1T");
    price = calculateBasePrice(distance, rate[type], min_rate[type]);
    returnType = type;
  } else {
    const { cost, costType } = await TruckPricing(distance, items);
    price = cost;
    returnType = costType;
  }

  return { price, returnType, returnTypeBackup };
}
