import BasePrice from "../helper/base_price";

export default async function determineOtherItemsPriceByWeight(
  items,
  total_weight,
  minute_rate,
  rate,
  rateTypesForWeight
) {
  let price = 0.0;
  let returnType = "NAN";

  const rateTypes = rateTypesForWeight;

  for (const { minWeight, maxWeight, maxLength, type } of rateTypes) {
    if (total_weight >= minWeight && total_weight < maxWeight) {
      price = BasePrice(rate[type], minute_rate);
      returnType = type;
      break;
    }
  }

  if (returnType === "NAN") {
    price = 1;
    returnType = "NM";
  }

  console.log("determineOtherItemsPriceByWeight", {
    price,
    returnType,
    rateTypesForWeight,
  });

  return { price, returnType };
}
