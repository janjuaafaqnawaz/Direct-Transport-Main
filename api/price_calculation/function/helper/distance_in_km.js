export default async function distanceValueKm(distanceData) {
  // Extracting the numeric value from the text
  const distanceValueMatch = distanceData.text.match(/[\d.]+/);
  if (!distanceValueMatch) {
    throw new Error("Invalid distance format");
  }

  const distanceValue = parseFloat(distanceValueMatch[0]);

  // Check for units (miles or feet) and apply the correct conversion
  if (distanceData.text.includes("mi")) {
    // Convert miles to kilometers
    const distanceKm = distanceValue * 1.60934;
    return distanceKm;
  } else if (distanceData.text.includes("ft")) {
    // Convert feet to kilometers
    const distanceKm = distanceValue * 0.0003048;
    return distanceKm;
  } else {
    throw new Error("Unsupported distance unit");
  }
}
