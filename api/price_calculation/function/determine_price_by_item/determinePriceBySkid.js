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
    const type = correctSmallReturnType("1T");
    price = calculateBasePrice(distance, rate[type], min_rate[type]);
    returnType = type;
  } else {
    const type = correctSmallReturnType("HT");
    price = calculateBasePrice(distance, rate[type], min_rate[type]);
    returnType = type;
  }

  return { price, returnType };
}
