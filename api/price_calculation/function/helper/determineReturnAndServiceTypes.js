export default function determineReturnAndServiceTypes(
  serviceType,
  returnType,
  type,
  longest_height,
  longest_width
) {
  // console.log("Initial parameters:", {
  //   serviceType,
  //   returnType,
  //   type,
  //   longest_height,
  //   longest_width,
  // });

  if (returnType === "LD") {
    console.log("Return type is 'LD'. Returning:", returnType);
    return returnType;
  }

  const serviceCodes = ["G", "X", "D", "AF", "W"];

  // if (serviceCodes.some((code) => returnType.includes(code))) {
  //   console.error("Something went wrong while calculating service type");
  //   console.log("Returning due to error:", returnType);
  //   return returnType;
  // }

  let job = returnType === "Courier" ? "C" : returnType;

  let code = job;

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
  }

  if (type === "three_four_day") {
    code += "-NF";
  } else if (type === "next_day") {
    code += "-ND";
  }

  return code;
}
