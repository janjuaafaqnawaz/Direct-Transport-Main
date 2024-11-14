export default async function calculateServiceCharges(
  price,
  requestQuote,
  serviceType,
  returnType
) {
  let charges = price;
  let serviceCharge = 0;
  let priceDifference = 0;

  if (!requestQuote) {
    switch (serviceType) {
      case "Express":
        charges *= 1.5;
        break;
      case "Direct":
        charges *= 2;
        break;
      case "After Hours":
      case "Weekend Deliveries":
        charges *= 4;
        serviceCharge = 50;
        break;
    }
    // Calculate the price difference after applying the service type multiplier
    priceDifference = charges - price;
  }

  // console.log({
  //   initialPrice: price,
  //   requestQuote,
  //   serviceType,
  //   charges,
  //   serviceCharge,
  //   priceDifference,
  // });

  return { charges, serviceCharge, priceDifference };
}
