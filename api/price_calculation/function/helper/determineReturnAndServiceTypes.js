export default function determineReturnAndServiceTypes(
  serviceType,
  returnType,
  type
) {
  if (returnType === "LD") {
    console.log("Return type is 'LD'. Returning:", returnType);
    return returnType;
  }

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
