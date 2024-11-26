"use client";

import { realtimeDbOFL } from "../config";
import { ref, remove, set, update } from "firebase/database";

const timestamp = Date.now();

async function locationSharing(email, id) {
  if (!email) {
    console.log("User not find");
    return;
  }

  try {
    const sanitizedEmail = email.replace(/[.#$[\]]/g, "_");

    const locationRef = ref(
      realtimeDbOFL,
      `driversLocations/${sanitizedEmail}/${id}`
    );

    await set(locationRef, {
      sharing: true,
      createdAt: timestamp,
      id,
    });

    console.log("Location updated for:", sanitizedEmail);
  } catch (error) {
    console.error("Failed to update location in Firebase:", error);
  }
}
async function stopLocationSharing(email, id) {
  if (!email) {
    console.log("User not find");
    return;
  }

  try {
    const sanitizedEmail = email.replace(/[.#$[\]]/g, "_");

    const locationRef = ref(
      realtimeDbOFL,
      `driversLocations/${sanitizedEmail}/${id}`
    );

    await update(locationRef, {
      sharing: false,
      endAt: timestamp,
    });

    console.log("Location updated for:", sanitizedEmail);
  } catch (error) {
    console.error("Failed to update location in Firebase:", error);
  }
}
async function removePrevLocation(email, id) {
  if (!email) {
    console.log("User not find");
    return;
  }

  try {
    const sanitizedEmail = email.replace(/[.#$[\]]/g, "_");

    const locationRef = ref(
      realtimeDbOFL,
      `driversLocations/${sanitizedEmail}/${id}`
    );
    await remove(locationRef);

    console.log("Location operation executed for:", sanitizedEmail);
  } catch (error) {
    console.error("Failed to update location in Firebase:", error);
  }
}

export { locationSharing, stopLocationSharing, removePrevLocation };
