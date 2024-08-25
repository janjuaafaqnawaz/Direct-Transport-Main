import calculateBasePrice from "../helper/calculateBasePrice";

export default async function determinePriceBySkid(
  distance,
  count,
  rate,
  min_rate
) {
  let price = 0;
  let returnType = "NAN";

  if (count === 2) {
    price = calculateBasePrice(distance, rate["1T"], min_rate["1T"]);
    returnType = "1T";
  } else {
    price = calculateBasePrice(distance, rate["HT"], min_rate["HT"]);
    returnType = "HT";
  }

  return { price, returnType };
}
