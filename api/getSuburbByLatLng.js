"use client"

import { geocodeByLatLng } from "react-google-places-autocomplete";

const getSuburbByLatLng = async (lat, lng) => {
  console.log({lat, lng});
  
  try {
    const results = await geocodeByLatLng({ lat, lng });

    if (!results || results.length === 0) {
      throw new Error("No results found");
    }

    const addressComponents = results[0].address_components;
    let suburb = "";

    addressComponents.forEach((component) => {
      if (
        component.types.includes("sublocality") ||
        component.types.includes("locality")
      ) {
        suburb = component.long_name;
      }
    });

    if (!suburb) {
      throw new Error("Suburb not found");
    }
    console.log(suburb);

    return suburb;
  } catch (error) {
    console.error("Error fetching suburb: ", error);
    return null;
  }
};
export default getSuburbByLatLng;
