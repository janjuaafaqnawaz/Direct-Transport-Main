async function calculateDistance(origin, destination) {
  try {
    const response = await fetch(
      `https://e-distance-matrix.vercel.app/api/distance?originStr=${origin}&destinationStr=${destination}`
    );

    const data = await response.json();
    return data.distanceData;
  } catch (error) {
    console.error("Error fetching data:", error);
  }
}

export { calculateDistance };
