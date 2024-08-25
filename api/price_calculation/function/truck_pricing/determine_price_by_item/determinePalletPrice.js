import BasePrice from "../helper/base_price";

const rateMapping = {
  1: "1T",
  2: "1T",
  3: "2T",
  4: "4T",
  5: "4T",
  6: "6T",
  7: "6T",
  8: "8T",
  9: "8T",
  10: "10T",
  11: "10T",
  12: "12T",
  13: "12T",
  14: "12T",
};

export default async function determinePalletPrice(
  items,
  Pallet,
  minute_rate,
  rate
) {
  const { count } = Pallet;
  const returnType = rateMapping[count] || "NAN";
  const price =
    returnType !== "NAN" ? BasePrice(rate[returnType], minute_rate) : 0.0;

  console.log("determinePalletPrice", { price, returnType });

  return { price, returnType };
}
