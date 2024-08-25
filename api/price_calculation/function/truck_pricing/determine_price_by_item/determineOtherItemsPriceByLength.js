import BasePrice from "../helper/base_price";

export default async function determineOtherItemsPriceByLength(
  items,
  longest_length,
  minute_rate,
  rate,
  rateTypesForLength
) {
  let price = 0.0;
  let returnType = "NAN";

  const rateTypes = rateTypesForLength;

  for (const rateType of rateTypes) {
    if (longest_length <= rateType.length) {
      price = BasePrice(rate[rateType.type], minute_rate);
      returnType = rateType.type;
      break;
    }
  }

  if (returnType === "NAN") {
    price = 1;
    returnType = "NM";
  }

  console.log("determineOtherItemsPriceByLength", {
    price,
    returnType,
    rateTypesForLength,
  });

  return { price, returnType };
}
