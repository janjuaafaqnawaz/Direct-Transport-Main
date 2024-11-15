import calculateBasePrice from "../helper/calculateBasePrice";
import TruckPricing from "../truck_pricing";

export default async function determineLadderRackPipesPrice(
  distance,
  total_weight,
  max_volume,
  longest_length,
  rate,
  min_rate,
  items,
  correctSmallReturnType
) {
  let price = 0;
  let returnType = "NAN";

  console.log("determineLadderRackPipesPrice", {
    distance,
    total_weight,
    max_volume,
    longest_length,
    rate,
    min_rate,
  });

  if (total_weight < 100) {
    if (longest_length <= 400) {
      const type = correctSmallReturnType("HT");
      price = calculateBasePrice(distance, rate[type], min_rate[type]);
      returnType = type;
    } else {
      const type = correctSmallReturnType("1T");
      price = calculateBasePrice(distance, rate[type], min_rate[type]);
      returnType = type;
    }
  } else if (total_weight >= 100 && total_weight < 350) {
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
