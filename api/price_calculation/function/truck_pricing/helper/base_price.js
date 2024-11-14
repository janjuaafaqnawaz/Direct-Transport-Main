export default function BasePrice(tons, minute_rate) {
  const price = (Number(tons) / 120) * Number(minute_rate);

  console.log("TruckBasePrice Calculation:", {
    tons,
    minute_rate,
    calculatedPrice: price,
  });

  return price;
}
