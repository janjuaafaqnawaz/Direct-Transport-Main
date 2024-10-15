export default async function calculateServiceCharges(
  price,
  requestQuote,
  serviceType,
  returnType
) {
  let charges = price;
  let serviceCharge = 0;

  if (!requestQuote) {
    switch (serviceType) {
      case "Express":
        charges *= 1.5;
        break;
      case "Direct":
        charges *= 2;
        break;
      case "After Hours":
        charges *= 4;
        serviceCharge = 50;
        break;
      case "Weekend Deliveries":
        charges *= 4;
        serviceCharge = 50;
        break;
    }
  }

  // console.log({ price, requestQuote, service, charges });

  return { charges, serviceCharge };
}
