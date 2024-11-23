"use server";

export default async function getSuburb(address) {
  const API = "AIzaSyACXmi5Hwi2SRE_VqmYqSI7gdLOa9neomg";
  const url = `https://maps.googleapis.com/maps/api/geocode/json?address=${encodeURIComponent(
    address
  )}&key=${API}`;

  console.log(url);

  try {
    const geocodeResponse = await fetch(url);
    const geocodeData = await geocodeResponse.json();

    if (geocodeData.status === "OK" && geocodeData.results.length > 0) {
      const addressComponents = geocodeData.results[0].address_components;

      // Find the suburb by its type "locality"
      const suburbComponent = addressComponents.find((component) =>
        component.types.includes("locality")
      );

      if (suburbComponent) {
        const suburb = suburbComponent.long_name;
        console.log(suburb);
        return suburb;
      }
    }
  } catch (error) {
    console.error("Error fetching suburb:", error);
  }

  return null;
}
