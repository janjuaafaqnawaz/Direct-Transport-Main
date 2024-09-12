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

export default async function CalcPrice({
  distanceData,
  rate,
  min_rate,
  gst,
  originStr,
  destinationStr,
  formData,
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
  const {
    Ladder,
    Rack,
    Pipes,
    Pallet,
    Skid,
    Timber,
    Rolls,
    Coil,
    Crate,
    Drum,
    Pail,
    Steel,
    Aluminum,
    Bags,
    Conduit,
    Tubes,
    Hoses,
  } = itemCounts;

  const { isOriginInside, isDestinationInside } = await isPointInGeofence(
    address
  );

  // if (!isOriginInside || !isDestinationInside) {
  //   price = distance * (max_volume <= 1000 ? 2.1 : 2.5);
  //   returnType = "LD";
  // }
  if (distance >= 87) {
    price = distance * (max_volume <= 1000 ? 2.1 : 2.5);
    returnType = "LD";
  } else if (
    Ladder.exist ||
    Rack.exist ||
    Pipes.exist ||
    Timber.exist ||
    Rolls.exist ||
    Coil.exist ||
    Crate.exist ||
    Drum.exist ||
    Pail.exist ||
    Steel.exist ||
    Aluminum.exist ||
    Bags.exist ||
    Conduit.exist ||
    Tubes.exist ||
    Hoses.exist
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

  const { charges, serviceCharge } = await ServiceCharges(
    price,
    requestQuote,
    service
  );

  price = charges;
  serviceCharges = serviceCharge;
  gst_charges = await GstCharges(price, gst);

  if (service !== "Standard") {
    tolls = await fetchTollsData(
      formData.address.Origin.coordinates,
      formData.address.Destination.coordinates
    );
  }

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
    totalTolls: tolls?.totalTolls || 0,
    totalTollsCost: tolls?.totalTollsCost || 0,
    returnType,
    requestQuote,
    palletSpaces,
    distanceData,
    serviceCharges,
    ...formData,
  };
}
