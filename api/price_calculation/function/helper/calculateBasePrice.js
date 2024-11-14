export default function calculateBasePrice(distance, rate, minRate) {
  const price = Math.max(Number(distance) * Number(rate), Number(minRate));
  // console.log("base:", distance, rate, minRate, price);
  return price;
}
