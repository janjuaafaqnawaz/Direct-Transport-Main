import { fetchDocById } from "@/api/firebase/functions/fetch";
import determineReturnAndServiceTypes from "@/api/price_calculation/function/helper/determineReturnAndServiceTypes";

export default async function CalculateWaitTime(invoice) {
  const priceSettings = await fetchDocById("price_settings", "data");
  const normalizedReturnType = invoice.returnType.match(/^\d+T/)[0]; // Extracts only the number and first "T"

  console.log("normalizedReturnType", normalizedReturnType);

  let updatedInvoice;

  if (["4T", "6T", "8T", "10T", "12T"].includes(normalizedReturnType)) {
    updatedInvoice = Truck(invoice, priceSettings);
  } else {
    updatedInvoice = Taxi(invoice, priceSettings);
  }

  return updatedInvoice;
}

async function Taxi(invoice, priceSettings) {
  const gstVal = Number(priceSettings?.same_day?.gst?.GST);
  const minWaitTimeRate = Number(
    priceSettings?.same_day?.minWaitTime?.minWaitTimeRate
  );
  const totalPrice = Number(invoice?.totalPrice) || 0;
  const serviceCharges = Number(invoice?.serviceCharges) || 0;
  const wTP = Number(invoice?.WaitingTimeAtPickupDefault) || 0;
  const wTD = Number(invoice?.WaitingTimeAtDropDefault) || 0;
  const WaitingTimeAtPickup = wTP <= 10 ? 0 : (wTP - 10) * minWaitTimeRate;
  const WaitingTimeAtDrop = wTD <= 10 ? 0 : (wTD - 10) * minWaitTimeRate;
  const chargesSum =
    totalPrice + serviceCharges + WaitingTimeAtPickup + WaitingTimeAtDrop;
  const gst = (chargesSum * gstVal) / 100;
  const totalPriceWithGST = chargesSum + gst;
  const returnType = determineReturnAndServiceTypes(
    invoice?.service,
    invoice?.returnType
  );
  const updatedInvoice = {
    ...invoice,
    totalPrice,
    totalPriceWithGST: Number(totalPriceWithGST.toFixed(2)),
    gst: Number(gst.toFixed(2)),
    WaitingTimeAtPickup,
    WaitingTimeAtDrop,
    returnType,
  };
  return updatedInvoice;
}
async function Truck(invoice, priceSettings) {
  const updatedInvoice = {
    ...invoice,
  };
  return updatedInvoice;
}
