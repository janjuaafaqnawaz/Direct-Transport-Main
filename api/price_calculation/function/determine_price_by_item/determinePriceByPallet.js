import calculateBasePrice from "../helper/calculateBasePrice";
import TruckPricing from "../truck_pricing";

export default async function determinePriceByPallet(
  distance,
  palletCount,
  rate,
  min_rate,
  max_volume,
  items
) {
  let price = 0;
  let returnType = "NAN";

  if (palletCount >= 3 || max_volume >= 1000) {
    const { cost, costType } = await TruckPricing(distance, items);
    price = cost;
    returnType = costType;
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
