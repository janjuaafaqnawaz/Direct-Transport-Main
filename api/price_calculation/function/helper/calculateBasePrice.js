export default function calculateBasePrice(distance, rate, minRate) {
  const price = Math.max(distance * rate, minRate);
  // console.log("base:", distance, rate, minRate, price);
  return price;
}
