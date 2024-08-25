import calculateBasePrice from "../helper/calculateBasePrice";
import TruckPricing from "../truck_pricing";

export default async function determineLadderRackPipesPrice(
  distance,
  total_weight,
  max_volume,
  longest_length,
  rate,
  min_rate,
  items
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

  if (distance >= 87 && total_weight >= 500) {
    price = distance * 3.5;
    returnType = "LD";
  } else {
    if (total_weight < 100) {
      if (longest_length <= 400) {
        price = calculateBasePrice(distance, rate["HT"], min_rate["HT"]);
        returnType = "HT";
      } else {
        price = calculateBasePrice(distance, rate["1T"], min_rate["1T"]);
        returnType = "1T";
      }
  } else if (total_weight >= 100 && total_weight < 450) {
      price = calculateBasePrice(distance, rate["1T"], min_rate["1T"]);
      returnType = "1T";
    } else {
      const { cost, costType } = await TruckPricing(distance, items);
      price = cost;
      returnType = costType;
    }
  }

  return { price, returnType };
}
