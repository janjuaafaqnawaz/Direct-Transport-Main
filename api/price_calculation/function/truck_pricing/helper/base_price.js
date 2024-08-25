export default function BasePrice(tons, minute_rate) {
  const price = (tons / 120) * minute_rate;

  console.log("TruckBasePrice Calculation:", {
    tons,
    minute_rate,
    calculatedPrice: price,
  });

  return price;
}
