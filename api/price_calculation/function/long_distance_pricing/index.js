import TruckPricing from "../truck_pricing";

export default async function LongDistancePricing(
  max_volume,
  long_distance,
  distance,
  items
) {
  let price = 0;
  let returnType = "LD";

  if (max_volume <= 1000) {
    returnType = "1T";
    price = basedOnPrice("1T", long_distance, distance);
  } else {
    const { cost, costType } = await TruckPricing(distance, items);
    price = basedOnPrice(costType, long_distance, distance);
    returnType = costType;
  }

  return { price, returnType };
}

const basedOnPrice = (costType, long_distance, distance) => {
  return Math.max(
    distance * Number(long_distance.services[costType]),
    Number(long_distance.minServices[costType])
  );
};
