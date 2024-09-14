"use server";

import { initializeApp, getApps } from "firebase/app";
import {
  getFirestore,
  collection,
  getDocs,
  doc,
  setDoc,
} from "firebase/firestore";
import { getStorage, ref, uploadBytes, getDownloadURL } from "firebase/storage";

// Function to fetch images with retry logic
async function fetchWithRetry(url: string, retries = 3): Promise<Blob> {
  for (let attempt = 0; attempt < retries; attempt++) {
    try {
      const response = await fetch(url, {
        headers: { "Cache-Control": "no-store" },
      });
      if (!response.ok)
        throw new Error(`HTTP error! Status: ${response.status}`);
      return await response.blob(); // Convert the response to blob
    } catch (error: any) {
      // Explicitly typing error as any
      if (attempt < retries - 1) {
        console.warn(`Fetch failed (${error.message}), retrying...`);
        await new Promise((resolve) => setTimeout(resolve, 1000)); // Wait before retrying
      } else {
        console.error(`Failed to fetch ${url} after ${retries} attempts`);
        throw error;
      }
    }
  }
}

export async function transferCollectionAndReuploadImages(formData: FormData) {
  const sourceApiKey = formData.get("sourceApiKey") as string;
  const sourceProjectId = formData.get("sourceProjectId") as string;
  const targetApiKey = formData.get("targetApiKey") as string;
  const targetProjectId = formData.get("targetProjectId") as string;
  const sourceCollection = formData.get("sourceCollection") as string;
  const targetCollection = formData.get("targetCollection") as string;
  const targetStorageBucket = formData.get("targetStorageBucket") as string;
  const imageField = formData.get("imageField") as string;

  // Firebase configuration for source and target projects
  const firebaseConfig1 = {
    apiKey: sourceApiKey,
    projectId: sourceProjectId,
  };

  const firebaseConfig2 = {
    apiKey: targetApiKey,
    projectId: targetProjectId,
    storageBucket: targetStorageBucket,
  };

  // Initialize Firebase apps
  const app1 =
    getApps().find((app) => app.name === "app1") ||
    initializeApp(firebaseConfig1, "app1");
  const app2 =
    getApps().find((app) => app.name === "app2") ||
    initializeApp(firebaseConfig2, "app2");

  const db1 = getFirestore(app1);
  const db2 = getFirestore(app2);
  const storage2 = getStorage(app2); // Make sure the correct app is used for Storage

  try {
    const sourceSnapshot = await getDocs(collection(db1, sourceCollection));

    for (const docSnap of sourceSnapshot.docs) {
      let docData = docSnap.data();
      const docId = docSnap.id;

      // Check if the document has the specified image field and it's not empty
      if (
        imageField &&
        docData[imageField] &&
        Array.isArray(docData[imageField])
      ) {
        let updatedImages: string[] = [];

        for (const imageUrl of docData[imageField] as string[]) {
          try {
            // Fetch image as blob with retry logic
            const blob = await fetchWithRetry(imageUrl);

            // Generate a unique name for the image
            const storageRef = ref(
              storage2,
              `${targetCollection}/${Date.now()}-${docId}-${Math.random()
                .toString(36)
                .substring(7)}.jpg`
            );

            // Upload the image blob to Firebase Storage
            const snapshot = await uploadBytes(storageRef, blob);

            // Get the new image URL
            const newImageUrl = await getDownloadURL(snapshot.ref);

            // Append the new image URL to the updated images array
            updatedImages.push(newImageUrl);
          } catch (error: any) {
            // Explicitly typing error as any
            console.error(
              `Failed to process image for document ${docId}: ${error.message}`,
              error
            );
            // Fallback: use the original image URL if upload fails
            updatedImages.push(imageUrl);
          }
        }

        // Update the document with the new image URLs
        docData[imageField] = updatedImages;
      }

      // Write the document data to the target Firestore collection
      await setDoc(doc(db2, targetCollection, docId), docData);
      console.log(`Document ${docId} transferred successfully.`);
    }

    console.log("Collection transfer and image re-upload complete.");
    return {
      success: true,
      message: "Collection transfer and image re-upload complete.",
    };
  } catch (error: any) {
    // Explicitly typing error as any
    console.error(
      "Error transferring collection and re-uploading images:",
      error
    );
    return {
      success: false,
      message: "Error transferring collection and re-uploading images.",
    };
  }
}
