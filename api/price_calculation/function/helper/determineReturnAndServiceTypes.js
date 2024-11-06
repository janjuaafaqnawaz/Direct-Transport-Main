export default function determineReturnAndServiceTypes(
  serviceType,
  returnType,
  type,
  longest_height,
  longest_width
) {
  console.log("Initial parameters:", {
    serviceType,
    returnType,
    type,
    longest_height,
    longest_width,
  });

  if (returnType === "LD") {
    console.log("Return type is 'LD'. Returning:", returnType);
    return returnType;
  }

  const serviceCodes = ["G", "X", "D", "AF", "W"];

  if (serviceCodes.some((code) => returnType.includes(code))) {
    console.error("Something went wrong while calculating service type");
    console.log("Returning due to error:", returnType);
    return returnType;
  }

  let job = returnType === "Courier" ? "C" : returnType;
  console.log("Determined job type:", job);

  let code = job;
  console.log("Base code after job determination:", code);

  if (type !== "next_day" && type !== "three_four_day") {
    switch (serviceType) {
      case "Standard":
        code += "G";
        break;
      case "Express":
        code += "X";
        break;
      case "Direct":
        code += "D";
        break;
      case "After Hours":
        code += "AF";
        break;
      case "Weekend Deliveries":
        code += "W";
        break;
      default:
        console.log("No matching service type found.");
        break;
    }
    console.log("Code after adding service type:", code);
  }

  if (type === "three_four_day") {
    code += "-NF";
    console.log("Three/Four day type detected, adding '-NF'");
  } else if (type === "next_day") {
    code += "-ND";
    console.log("Next day type detected, adding '-ND'");
  }

  console.log("Final code to be returned:", code);
  return code;
}
