export default function determineReturnAndServiceTypes(
  serviceType,
  returnType
) {
  const job = returnType === "Courier" ? "C" : returnType;

  if (["G", "X", "D", "AF", "W"].includes(returnType)) {
    return returnType;
  }

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
    return returnType;
  }
}
