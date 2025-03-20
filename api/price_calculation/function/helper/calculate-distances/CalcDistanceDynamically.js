"use server";

import calculateMultipleCoords from "./calculateMultipleCoords";
import calculateSingleCoords from "./calculateSingleCoords";

const API = "AIzaSyACXmi5Hwi2SRE_VqmYqSI7gdLOa9neomg";

export default async function CalcDistanceDynamically(address) {
  let details;

  if (address.useMultipleAddresses) {
    details = await calculateMultipleCoords(address, API);
  } else {
    details = await calculateSingleCoords(address, API);
  }

  return details;
}
