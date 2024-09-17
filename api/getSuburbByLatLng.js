"use server";

export default async function getSuburb(address) {
  const apiKey = "AIzaSyDTsv2KjctO7_RCqsXQHs30mluZT-whoeQ";
  const url = `https://maps.googleapis.com/maps/api/geocode/json?address=${encodeURIComponent(
    address
  )}&key=${apiKey}`;

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
