import calculateBasePrice from "@/api/price_calculation/function/helper/calculateBasePrice";
import ServiceCharges from "@/api/price_calculation/function/helper/service_charges";
import GstCharges from "@/api/price_calculation/function/helper/gst_charges";
import BasePrice from "@/api/price_calculation/function/truck_pricing/helper/base_price";
import MinuteRate from "@/api/price_calculation/function/truck_pricing/helper/minute_rate";
import determineReturnAndServiceTypes from "@/api/price_calculation/function/helper/determineReturnAndServiceTypes";
import correctReturnType from "@/api/price_calculation/function/helper/correctReturnType";
export default async function CalcPrice({ priceSettings, formData }) {
  const {
    truckServices,
    minServices: min_rate,
    services: rate,
    gst: { GST: gst },
  } = priceSettings.same_day;
  const {
    service,
    distance,
    max_volume,
    returnType: initialReturnType,
    returnTypeBackup,
  } = formData;

  const truckRate = Object.fromEntries(
    Object.entries(truckServices).map(([key, value]) => [key, Number(value)])
  );

  const correctedReturnType = correctReturnType(
    returnTypeBackup,
    initialReturnType
  );

  let returnType =
    correctedReturnType === "10"
      ? "10T"
      : correctedReturnType === "12"
      ? "12T"
      : correctedReturnType;

  try {
    const minute_rate = MinuteRate(distance);
    let price = calculatePrice(
      returnType,
      distance,
      rate,
      min_rate,
      truckRate,
      minute_rate,
      max_volume
    );

    const { charges, priceDifference, serviceCharge } = await ServiceCharges(
      price,
      false,
      service
    );
    price = charges;
    const serviceCharges = serviceCharge;

    const gst_charges = await GstCharges(price, gst);

    console.log("Calculated:", {
      price,
      charges,
      priceDifference,
      serviceCharge,
      gst_charges,
    });

    const booking = {
      ...formData,
      gst: Number(toFixedSafe(gst_charges, 2)),
      totalPrice: toFixedSafe(price, 2),
      totalPriceWithGST: Number(toFixedSafe(price + gst_charges, 2)),
      serviceCharges,
    };

    returnType = determineReturnAndServiceTypes(service, returnType);

    return { ...booking, returnType };
  } catch (err) {
    console.error(`CalcPrice Error: ${err.message}`);
  }
}

function calculatePrice(
  returnType,
  distance,
  rate,
  min_rate,
  truckRate,
  minute_rate,
  max_volume
) {
  console.log("Calculating price with parameters:", {
    returnType,
    distance,
    rate,
    min_rate,
    truckRate,
    minute_rate,
    max_volume,
  });

  switch (returnType) {
    case "LD":
      const ldPrice = distance * (max_volume && max_volume <= 1000 ? 2.1 : 2.5);
      // console.log("LD Price calculation:", { ldPrice, distance, max_volume });
      return ldPrice;

    case "Courier":
      const courierPrice = calculateBasePrice(
        distance,
        rate["HT"],
        min_rate["HT"]
      );
      // console.log("Courier Price calculation:", { courierPrice });
      return courierPrice;

    case "HT":
    case "1T":
    case "2T":
      const smallTruckPrice = calculateBasePrice(
        distance,
        rate[returnType],
        min_rate[returnType]
      );
      // console.log(`${returnType} Price calculation:`, { smallTruckPrice });
      return smallTruckPrice;

    case "4T":
    case "6T":
    case "8T":
    case "10T":
    case "12T":
      const largeTruckPrice = BasePrice(truckRate[returnType], minute_rate);
      // console.log(`${returnType} Truck Price calculation:`, {
      //   largeTruckPrice,
      // });
      return largeTruckPrice;

    default:
      const errorMsg = `Unsupported returnType: ${returnType}`;
      console.error(errorMsg);
      throw new Error(errorMsg);
  }
}

function toFixedSafe(value, decimals) {
  const fixedValue = !isNaN(value) ? value.toFixed(decimals) : "0.00";
  return fixedValue;
}
