export default async function distanceValueKm(distanceData) {
  // const distanceData = {
  //   text: "22.3 mi",
  //   value: 35848,
  // };

  // Extracting the numeric value from the text
  const distanceValueMatch = distanceData.text.match(/[\d.]+/);
  if (!distanceValueMatch) {
    throw new Error("Invalid distance format");
  }

  const distanceValueMiles = parseFloat(distanceValueMatch[0]);

  // Converting miles to kilometers
  const distanceKm = distanceValueMiles * 1.60934;
  // console.log("distanceValueKm (converted):", distanceData, distanceKm);

  return distanceKm;
}
