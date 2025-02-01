"use client";
import {
  addDoc,
  collection,
  doc,
  getFirestore,
  updateDoc as firestoreUpdateDoc,
  getDoc,
  deleteDoc,
  setDoc,
  query,
  where,
  getDocs,
  Timestamp,
} from "firebase/firestore";
import { getDownloadURL, getStorage, ref, uploadBytes } from "firebase/storage";
import { app } from "../config";
import SendEmailToClients from "@/api/emails/SendEmailToClients";
import { endOfMonth, startOfMonth, subMonths } from "date-fns";
import toast from "react-hot-toast";

const notify = (msg) => toast(msg);

const db = getFirestore(app);

async function postCustomIdDoc(data, collectionName, customId) {
  const user = JSON.parse(localStorage.getItem("userDoc"));
  if (!user) {
    notify("You're not logged in");
    return null;
  }

  try {
    const createdAt = new Date();
    const collectionRef = collection(db, collectionName);

    // Use the custom ID to reference the document
    const docRef = doc(collectionRef, customId);

    // Add additional metadata to the document
    const updatedData = {
      ...data,
      docId: customId,
      id: customId,
      userEmail: user.email,
      userName: user.firstName,
      createdAt: createdAt,
      createdAtStandardized: createdAt,
      isNew: true,
    };

    // Set the document with the custom ID
    await setDoc(docRef, updatedData);
    notify("Posted Successfully");
    return customId;
  } catch (error) {
    notify("Something Went Wrong");
    console.error(error);
    return null;
  }
}

async function postDoc(data, collectionName) {
  const user = JSON.parse(localStorage.getItem("userDoc"));
  if (!user) {
    notify("You're not logged in");
    return null;
  }

  try {
    const createdAt = new Date();
    const collectionRef = collection(db, collectionName);
    const docRef = await addDoc(collectionRef, data);
    const updatedData = {
      docId: docRef.id,
      userEmail: user.email,
      userName: user.firstName,
      createdAt: createdAt,
      createdAtStandardized: createdAt,
      isNew: true,
    };
    await updateDoc(collectionName, docRef.id, updatedData);
    notify(`Posted Successfully`);
    return docRef.id;
  } catch (error) {
    notify(`Something Went Wrong`);
    console.log(error);
    return null;
  }
}

async function postInvoice(data, collectionName, selectedEmail) {
  const { name, email, admin } = selectedEmail || {};

  try {
    const createdAt = new Date();
    const user = JSON.parse(localStorage.getItem("userDoc"));

    const docId = `DTS${Math.floor(Math.random() * 99999) + 10000}`;

    const docData = {
      ...data,
      docId: docId,
      userEmail: admin && email !== "" ? email : user?.email || "Unknown",
      userName: admin ? name : user?.firstName || data?.contact || "Unknown",
      createdAt: createdAt,
      createdAtStandardized: createdAt,
      isNew: true,
    };
    const docRef = doc(db, collectionName, docId); // Use the custom ID

    await setDoc(docRef, docData);
    notify(`Posted Successfully`);
    return docId;
  } catch (error) {
    console.log(error, `Something Went Wrong`);
    return null;
  }
}

async function updateDoc(collectionName, docId, data) {
  try {
    const docRef = doc(db, collectionName, docId);
    await firestoreUpdateDoc(docRef, data);
    console.log(`Updated Successfully`);
    return true;
  } catch (error) {
    console.log(error);
    console.log(`Something Went Wrong`);
    return false;
  }
}

async function addFrequentAddress(address) {
  if (
    !address ||
    !address.coordinates ||
    !address.coordinates.lat ||
    !address.coordinates.lng ||
    !address.label
  ) {
    // Notify if the address is missing required fields
    notify("Invalid address data");
    return false;
  }

  const user = JSON.parse(localStorage.getItem("user"));
  if (!user) {
    notify("You're not logged in");
    return false;
  }

  const docId = user.email;
  try {
    const docRef = doc(db, "users", docId);
    const userDoc = await getDoc(docRef);

    if (userDoc.exists()) {
      const userData = userDoc.data();

      if (!userData.frequentAddresses) {
        userData.frequentAddresses = [];
      }

      // Check if the address is not already in the array based on coordinates
      const isAddressExists = userData.frequentAddresses.some(
        (existingAddress) => {
          return (
            existingAddress.coordinates &&
            existingAddress.coordinates.lat === address.coordinates.lat &&
            existingAddress.coordinates.lng === address.coordinates.lng &&
            existingAddress.label === address.label
          );
        }
      );

      if (!isAddressExists) {
        userData.frequentAddresses.push(address);
        await updateDoc("users", docId, userData);
        console.log(`Added successfully.`);
        window.location.reload();
        return true;
      } else {
        console.log(`Address already exists.`);
        return false;
      }
    } else {
      console.log(`User document does not exist.`);
      return false;
    }
  } catch (error) {
    console.error("Error adding frequent address:", error);
    console.log(`Something went wrong.`);
    return false;
  }
  return true;
}

async function updateFrequentAddress(modifiedAddresses) {
  const user = JSON.parse(localStorage.getItem("user"));
  if (!user) {
    notify("You're not logged in");
    return false;
  }

  const docId = user.email;
  const data = { frequentAddresses: modifiedAddresses };
  try {
    const docRef = doc(db, "users", docId);
    await firestoreUpdateDoc(docRef, data, { merge: true });
    notify(`Modified successfully.`);
    return true;
  } catch (error) {
    notify(`Something Went Wrong.`);
    return false;
  }
}

async function deleteDocument(collectionName, docId) {
  const user = JSON.parse(localStorage.getItem("userDoc"));
  if (!user) {
    notify("You're not logged in");
    return null;
  }

  try {
    const collectionRef = doc(db, collectionName, docId);
    await deleteDoc(collectionRef);
    notify(`Removed`);
  } catch (error) {
    console.error("Error deleting document:", error);
    notify(`Something Went Wrong`);
  }
}

async function uploadImageToFirestore(image) {
  const storage = getStorage(app);

  try {
    const response = await fetch(image);
    console.log("fetched:", response);
    const blob = await response.blob();
    const imageName = `images/${Date.now()}`;
    const storageRef = ref(storage, imageName); // Initialize the storage reference correctly

    // Upload the blob to Firebase Storage
    await uploadBytes(storageRef, blob); // Use uploadBytes() to upload the blob

    // Get the download URL of the uploaded image
    const downloadURL = await getDownloadURL(storageRef);

    // Ensure the imageUrl is defined
    if (downloadURL) {
      return downloadURL; // Return the download URL
    } else {
      return null;
    }
  } catch (error) {
    return null;
  }
}

async function checkEmailAndSendMessage(email) {
  const now = new Date();

  // Calculate the start and end dates of the previous month
  const startOfPreviousMonth = startOfMonth(subMonths(now, 1));
  const endOfPreviousMonth = endOfMonth(subMonths(now, 1));

  try {
    const collectionRef = collection(db, "place_bookings");
    const querySnapshot = await getDocs(
      query(
        collectionRef,
        where("userEmail", "==", email),
        where("createdAt", ">=", startOfPreviousMonth),
        where("createdAt", "<=", endOfPreviousMonth)
      )
    );

    if (querySnapshot.empty) {
      console.log(
        `No bookings found for email ${email} in the previous month.`
      );
      // Send email logic here if needed
    } else {
      console.log(`Bookings found for email ${email} in the previous month.`);
      SendEmailToClients(email);
      // No email sending needed
    }
  } catch (error) {
    console.error("Error checking email and sending message: ", error);
  }
}

export {
  postInvoice,
  updateDoc,
  postDoc,
  addFrequentAddress,
  updateFrequentAddress,
  deleteDocument,
  uploadImageToFirestore,
  checkEmailAndSendMessage,
  postCustomIdDoc,
};
