"use client";
import { fetchDocById } from "./firebase/functions/fetch";
import CountItems from "./price_calculation/function/helper/count_items";

// Helper function to calculate weight and cubic capacity
async function calculateWeightAndCubicCapacity(items) {
  let totalWeight = 0;
  let cubicCapacity = 0;

  items.forEach((item) => {
    const quantity = parseInt(item.qty, 10);
    totalWeight += parseInt(item.weight, 10) * quantity;
    cubicCapacity +=
      ((item.length * item.width * item.height) / 4000) * quantity;
  });

  return { totalWeight, cubicCapacity };
}

// Main function to calculate price
async function calculatePrice(data) {
  console.log("Price Calculator:", data);

  const minPrices = await fetchDocById("MinServicesPrices", "data");
  const perKmRates = await fetchDocById("perKmRates", "data");

  const serviceType = data?.service;
  const distanceValueMiles = parseFloat(
    data.distanceData.distance.text.match(/\d+/)[0]
  );

  // Convert miles to kilometers (1 mile is approximately 1.60934 kilometers)
  const distanceValueKm = distanceValueMiles * 1.60934;

  let totalPrice = 0;
  let requestQuote = false;
  let palletSpaces = 0;
  let returnType = "NAN";
  let basePrice = 0;
  let serviceCharges = 0;

  const { items } = data;
  const { totalWeight, cubicCapacity } = await calculateWeightAndCubicCapacity(
    items
  );

  const MaxCubicCapacity = Math.max(cubicCapacity, totalWeight);
  palletSpaces = Math.ceil(cubicCapacity);
  const longestItemLength = Math.max(...items.map((item) => item.length));
  const totalItemLengths = items.reduce((acc, item) => {
    return acc + parseInt(item.length) * parseInt(item.qty || 1);
  }, 0);

  const hasPallet = items.some((item) => item.type === "Pallet");
  const hasSkid = items.some((item) => item.type === "Skid");
  const hasLadder = items.some((item) => item.type === "Ladder");
  const hasRackItems = items.some((item) => item.type === "Rack");
  const hasPipes = items.some((item) => item.type === "Pipes");

  const palletCount = CountItems(items, "Pallet");
  const skidCount = CountItems(items, "Skid");

  switch (true) {
    case hasLadder || hasRackItems || hasPipes:
      if (distanceValueKm >= 87 && totalWeight >= 500) {
        totalPrice = distanceValueKm * 3.5;
        returnType = "LD";
      } else {
        if (totalWeight < 100) {
          if (longestItemLength <= 400) {
            basePrice = distanceValueKm * perKmRates["HT"];
            totalPrice = Math.max(basePrice, minPrices["HT"]);
            returnType = "HT";
          } else {
            basePrice = distanceValueKm * perKmRates["1T"];
            totalPrice = Math.max(basePrice, minPrices["1T"]);
            returnType = "1T";
          }
        } else if (totalWeight >= 100 && totalWeight < 350) {
          basePrice = distanceValueKm * perKmRates["1T"];
          totalPrice = Math.max(basePrice, minPrices["1T"]);
          returnType = "1T";
        } else if (totalWeight >= 350 && totalWeight <= 500) {
          basePrice = distanceValueKm * perKmRates["2T"];
          totalPrice = minPrices["2T"];
          returnType = "2T";
        } else if (totalWeight > 500 && totalWeight <= 750) {
          totalPrice = 140;
          returnType = "4T";
        } else if (totalWeight > 750 && totalWeight <= 1000) {
          totalPrice = 160;
          returnType = "4T";
        }
      }
      break;

    case distanceValueKm >= 87:
      totalPrice = distanceValueKm * (MaxCubicCapacity <= 1000 ? 2.1 : 2.5);
      returnType = "LD";
      break;

    case hasPallet:
      basePrice = distanceValueKm * perKmRates["1T"];
      if (palletCount === 3) {
        totalPrice = minPrices["2T"];
        returnType = "2T";
      } else if (palletCount === 4) {
        totalPrice = perKmRates["4T"];
        returnType = "4T";
      } else {
        if (MaxCubicCapacity <= 1000) {
          totalPrice = Math.max(basePrice, minPrices["1T"]);
          returnType = "1T";
        } else if (MaxCubicCapacity <= 2000) {
          totalPrice = minPrices["2T"];
          returnType = "2T";
        } else {
          totalPrice = minPrices["4T"];
          returnType = "4T";
        }
      }
      break;

    case hasSkid:
      if (skidCount === 2) {
        basePrice = distanceValueKm * perKmRates["1T"];
        totalPrice = Math.max(basePrice, minPrices["1T"]);
        returnType = "1T";
      } else {
        basePrice = distanceValueKm * perKmRates["HT"];
        totalPrice = Math.max(basePrice, minPrices["HT"]);
        returnType = "HT";
      }
      break;

    case totalWeight <= 25 && longestItemLength < 100 && MaxCubicCapacity <= 25:
      basePrice = distanceValueKm * perKmRates["Courier"];
      totalPrice = Math.max(basePrice, minPrices["Courier"]);
      returnType = "Courier";
      break;

    case longestItemLength <= 400 && MaxCubicCapacity <= 500:
      basePrice = distanceValueKm * perKmRates["HT"];
      totalPrice = Math.max(basePrice, minPrices["HT"]);
      returnType = "HT";
      break;

    case MaxCubicCapacity <= 1000:
      basePrice = distanceValueKm * perKmRates["1T"];
      totalPrice = Math.max(basePrice, minPrices["1T"]);
      returnType = "1T";
      break;

    case MaxCubicCapacity <= 2000:
      totalPrice = minPrices["2T"];
      returnType = "2T";
      break;

    case MaxCubicCapacity <= 4000:
      totalPrice = minPrices["4T"];
      returnType = "4T";
      break;

    default:
      requestQuote = true;
  }

  if (!requestQuote) {
    switch (serviceType) {
      case "Express":
        totalPrice *= 1.5;
        break;
      case "Direct":
        totalPrice *= 2;
        break;
      case "After Hours":
        totalPrice *= 4;
        serviceCharges = 50;
        break;
      case "Weekend Deliveries":
        totalPrice *= 4;
        serviceCharges = 50;
        break;
    }
  }

  if (!requestQuote && typeof totalPrice !== "string") {
    totalPrice = totalPrice.toFixed(2);
  }

  function determineReturnAndServiceTypes(serviceType, returnType) {
    const job = returnType === "Courier" ? "C" : returnType;
    if (serviceType === "Standard") {
      return `${job}G`;
    } else if (serviceType === "Express") {
      return `${job}X`;
    } else if (serviceType === "Direct") {
      return `${job}D`;
    } else if (serviceType === "After Hours") {
      return `${job}AF`;
    } else if (serviceType === "Weekend Deliveries") {
      return `${job}W`;
    } else {
    }
  }

  const newReturnType = determineReturnAndServiceTypes(serviceType, returnType);

  console.log({
    serviceType,
    distanceValueKm,
    totalPrice,
    requestQuote,
    palletSpaces,
    returnType,
    basePrice,
    totalWeight,
    cubicCapacity,
    MaxCubicCapacity,
    longestItemLength,
    totalItemLengths,
    hasLadder,
    hasRackItems,
    hasPipes,
    hasPallet,
    newReturnType,
  });

  return {
    ...data,
    totalPrice: Number(totalPrice).toFixed(2),
    palletSpaces: palletSpaces,
    requestQuote,
    returnType: newReturnType,
    serviceCharges,
  };
}

export { calculatePrice };
