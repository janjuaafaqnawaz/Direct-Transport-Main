import calculateBasePrice from "../helper/calculateBasePrice";
import TruckPricing from "../truck_pricing";

export default async function determinePriceByPallet(
  distance,
  palletCount,
  rate,
  min_rate,
  max_volume,
  items,
  correctSmallReturnType
) {
  let price = 0;
  let returnType = "NAN";

  if (palletCount >= 3 || max_volume >= 1000) {
    const { cost, costType } = await TruckPricing(distance, items);
    price = cost;
    returnType = costType;
  } else if (max_volume <= 1000) {
    const type = correctSmallReturnType("1T");
    price = calculateBasePrice(distance, rate[type], min_rate[type]);
    returnType = type;
  } else {
    const { cost, costType } = await TruckPricing(distance, items);
    price = cost;
    returnType = costType;
  }

  return { price, returnType };
}
