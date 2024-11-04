import { fetchDocById } from "@/api/firebase/functions/fetch";
import determineReturnAndServiceTypes from "@/api/price_calculation/function/helper/determineReturnAndServiceTypes";
import toast from "react-hot-toast";
function normalizeReturnType(returnType) {
  const match = returnType.match(/^(2|4|6|8|10|12)T/);
  return match ? match[0] : null;
}

export default async function CalculateWaitTime(invoice) {
  const priceSettings = await fetchDocById("price_settings", "data");

  const normalizedReturnType = normalizeReturnType(invoice.returnType);

  console.log("normalizedReturnType:", normalizedReturnType);

  let updatedInvoice;

  if (["4T", "6T", "8T", "10T", "12T"].includes(normalizedReturnType)) {
    toast.success("Processing as Truck: ");
    updatedInvoice = await Truck(invoice, priceSettings, normalizedReturnType);
  } else {
    toast.success("Processing as Taxi: ");
    updatedInvoice = await Taxi(invoice, priceSettings);
  }

  return updatedInvoice;
}

async function Taxi(invoice, priceSettings) {
  const gstVal = Number(priceSettings?.same_day?.gst?.GST) || 0;
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

async function Truck(invoice, priceSettings, normalizedReturnType) {
  const gstVal = Number(priceSettings?.same_day?.gst?.GST) || 0;
  const serviceCharges = Number(invoice?.serviceCharges) || 0;
  const totalPrice = Number(invoice?.totalPrice) || 0;

  // Define hourly rates based on truck type
  const hourlyRates = {
    "4T": 60,
    "6T": 65,
    "8T": 70,
    "10T": 75,
    "12T": 80,
  };
  const ratePerHour = hourlyRates[normalizedReturnType] || 0;

  // Waiting times in minutes, with initial 15 minutes free for both pickup and drop
  const wTP = Number(invoice?.WaitingTimeAtPickupDefault) || 0;
  const wTD = Number(invoice?.WaitingTimeAtDropDefault) || 0;

  const waitingTimeAtPickupCharge =
    wTP > 15 ? ((wTP - 15) / 60) * ratePerHour : 0;
  const waitingTimeAtDropCharge =
    wTD > 15 ? ((wTD - 15) / 60) * ratePerHour : 0;

  // Sum waiting charges and apply GST
  const waitingCharges = waitingTimeAtPickupCharge + waitingTimeAtDropCharge;
  const gstAmount = (gstVal / 100) * (totalPrice + waitingCharges);

  const updatedInvoice = {
    ...invoice,
    waitingCharges: Number(waitingCharges.toFixed(2)),
    gstAmount: Number(gstAmount.toFixed(2)),
    finalTotal: (
      totalPrice +
      waitingCharges +
      gstAmount +
      serviceCharges
    ).toFixed(2),
  };

  return updatedInvoice;
}
