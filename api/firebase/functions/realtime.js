"use client";

import { app } from "../config";
import { getDatabase, ref, remove, set, update } from "firebase/database";
import toast from "react-hot-toast";

const notify = (msg) => toast(msg);

const database = getDatabase(app);
const timestamp = Date.now();

async function locationSharing(email, id) {
  if (!email) {
    console.log("User not find");
    return;
  }

  try {
    const sanitizedEmail = email.replace(/[.#$[\]]/g, "_");

    const locationRef = ref(
      database,
      `driversLocations/${sanitizedEmail}/${id}`
    );

    await set(locationRef, {
      sharing: true,
      createdAt: timestamp,
      id,
    });

    notify("Good");
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
      database,
      `driversLocations/${sanitizedEmail}/${id}`
    );

    await update(locationRef, {
      sharing: false,
      endAt: timestamp,
    });

    notify("Good");
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
      database,
      `driversLocations/${sanitizedEmail}/${id}`
    );
    await remove(locationRef);

    notify("Good");
    console.log("Location operation executed for:", sanitizedEmail);
  } catch (error) {
    console.error("Failed to update location in Firebase:", error);
  }
}

export { locationSharing, stopLocationSharing, removePrevLocation };
