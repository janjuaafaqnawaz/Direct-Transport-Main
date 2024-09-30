export default function determineReturnAndServiceTypes(
  serviceType,
  returnType,
  type
) {
  const serviceCodes = ["G", "X", "D", "AF", "W"];

  if (serviceCodes.some((code) => returnType.includes(code))) {
    return returnType;
  }

  const job = returnType === "Courier" ? "C" : returnType;

  let code = job;

  if (serviceType === "Standard") {
    code = `${job}G`;
  } else if (serviceType === "Express") {
    code = `${job}X`;
  } else if (serviceType === "Direct") {
    code = `${job}D`;
  } else if (serviceType === "After Hours") {
    code = `${job}AF`;
  } else if (serviceType === "Weekend Deliveries") {
    code = `${job}W`;
  } else {
    code = returnType;
  }

  if (type === "three_four_day") {
    code = `${code}-NF`;
  } else if (type === "next_day") {
    code = `${code}-ND`;
  } else {
    code = `${code}`;
  }

  // else if (type === "same_day") {
  //   return `${job}${serviceCode}`; // Same Day, no suffix
  // }

  return code;
}
