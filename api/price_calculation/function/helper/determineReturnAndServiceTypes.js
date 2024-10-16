import toast from "react-hot-toast";

export default function determineReturnAndServiceTypes(
  serviceType,
  returnType,
  type
) {
  const serviceCodes = ["G", "X", "D", "AF", "W"];

  if (serviceCodes.some((code) => returnType.includes(code))) {
    console.error("Something went wrong while calculating service type");
    return returnType;
  }

  const job = returnType === "Courier" ? "C" : returnType;

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
