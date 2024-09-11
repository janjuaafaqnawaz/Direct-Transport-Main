export default function determineReturnAndServiceTypes(serviceType, returnType) {
  // Check if returnType already contains any of the service codes
  const serviceCodes = ["G", "X", "D", "AF", "W"];
  
  // If returnType already includes any of the service codes, return it as is
  if (serviceCodes.some(code => returnType.includes(code))) {
    return returnType;
  }

  // Determine the job based on returnType
  const job = returnType === "Courier" ? "C" : returnType;

  // Add the appropriate service code based on serviceType
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
