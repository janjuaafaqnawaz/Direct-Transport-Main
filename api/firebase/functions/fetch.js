"use client";

import { getAuth } from "firebase/auth";
import {
  collection,
  doc,
  getDoc,
  getDocs,
  getFirestore,
  limit,
  orderBy,
  query,
  Timestamp,
  where,
} from "firebase/firestore";
import { app } from "../config";
import { toast } from "react-toastify";
import { fetchUserData } from "./auth";
import { getCurrentMonthDates, getPreviousMonthDates } from "@/api/DateAndTime";

const auth = getAuth(app);
export const db = getFirestore(app);

const notify = (msg) => console.log(msg);

async function fetchDocById(docId, collectionName) {
  const docRef = doc(db, collectionName, docId);
  try {
    const docSnapshot = await getDoc(docRef);
    if (!docSnapshot.exists()) {
      notify("Doc not found.");
      return null;
    }
    return docSnapshot.data();
  } catch (error) {
    console.log("Error fetching Doc:", error);
  }
}

async function fetchFrequentAddresses() {
  const user = JSON.parse(localStorage.getItem("userDoc"));
  if (!user) {
    notify("You're not logged in");
    return null;
  }
  try {
    const user = await fetchUserData();
    return user.frequentAddresses;
  } catch (error) {
    notify("Something Went Wrong");
    return null;
  }
}

async function fetchPlace_booking() {
  try {
    const user = await fetchUserData();
    const collectionRef = collection(db, "place_bookings");
    const q = query(
      collectionRef,
      where("userEmail", "==", user.email),
      orderBy("createdAt", "desc")
    );
    const querySnapshot = await getDocs(q);
    const documents = [];
    querySnapshot.forEach((doc) => {
      documents.push({ id: doc.id, ...doc.data() });
    });
    return documents;
  } catch (error) {
    notify("Something Went Wrong", error);
    console.log(error);
    return [];
  }
}
async function fetchMyPdfsOfDoc(email) {
  try {
    const user = await fetchUserData();
    const collectionRef = collection(db, "generatedPdfs");
    const q = query(
      collectionRef,
      where("email", "==", email ? email : user.email)
      // orderBy("createdAt", "desc")
    );
    const querySnapshot = await getDocs(q);
    const documents = [];
    querySnapshot.forEach((doc) => {
      documents.push({ id: doc.id, ...doc.data() });
    });
    return documents;
  } catch (error) {
    notify("Something Went Wrong", error);
    console.log(error);
    return [];
  }
}

async function fetchPlace_job() {
  const user = JSON.parse(localStorage.getItem("userDoc"));
  if (!user) {
    notify("You're not logged in");
    return [];
  }
  try {
    const collectionRef = collection(db, "place_job");
    const q = query(
      collectionRef,
      where("userEmail", "==", user.email),
      orderBy("createdAt", "desc") // Order by creation date in descending order
    );
    const querySnapshot = await getDocs(q);
    const documents = [];
    querySnapshot.forEach((doc) => {
      documents.push({ id: doc.id, ...doc.data() });
    });
    fetchUserData();
    return documents;
  } catch (error) {
    console.log("Something Went Wrong", error);
    return [];
  }
}

async function getDocByDateAndId(collectionName, id, date) {
  const user = JSON.parse(localStorage.getItem("userDoc"));
  if (!user) {
    notify("You're not logged in");
    return null;
  }

  try {
    const q = query(
      collection(db, collectionName),
      where("docId", "==", id),
      where("date", "==", date)
    );

    const querySnapshot = await getDocs(q);

    if (querySnapshot.empty) {
      console.log("No matching documents.");
      return null;
    }

    const doc = querySnapshot.docs[0].data();
    return doc.docId;
  } catch (error) {
    console.log(error.message);
    return null;
  }
}

async function getCollection(collectionName) {
  const user = JSON.parse(localStorage.getItem("userDoc"));
  if (!user) {
    notify("You're not logged in");
    return [];
  }
  try {
    const q = collection(db, collectionName);
    const querySnapshot = await getDocs(q);
    const documents = querySnapshot.docs.map((doc) => doc.data());
    return documents;
  } catch (error) {
    notify("Something went wrong fetching");
    return [];
  }
}

async function getDrivers() {
  try {
    const q = query(collection(db, "users"), where("role", "==", "driver"));
    const querySnapshot = await getDocs(q);
    const documents = querySnapshot.docs.map((doc) => doc.data());
    return documents;
  } catch (error) {
    notify("Something went wrong fetching drivers");
    return [];
  }
}

async function getDriverBookings(email) {
  try {
    const q = query(
      collection(db, "place_bookings"),
      where("driverEmail", "==", email)
    );
    const querySnapshot = await getDocs(q);
    const documents = querySnapshot.docs.map((doc) => doc.data());
    return documents;
  } catch (error) {
    notify("Something went wrong fetching drivers");
    return [];
  }
}

async function fetchOptions() {
  const docRef = doc(db, "data", "options");
  try {
    const doc = await getDoc(docRef);
    if (!doc.exists()) {
      notify("Doc not found.");
    }
    return doc.data();
  } catch (error) {
    notify("Error fetching Doc:", error);
  }
}

async function fetchPlaceBookingsExistingAccsMonthly(email) {
  const collectionRef = collection(db, "place_bookings");
  const { startDate, endDate } = getPreviousMonthDates();

  const fromDate = new Date(startDate);
  fromDate.setHours(0, 0, 0, 0);
  const toDate = new Date(endDate);
  toDate.setHours(23, 59, 59, 999);

  try {
    // Create a base query with date conditions
    let q = query(
      collectionRef,
      where("createdAt", ">=", fromDate),
      where("createdAt", "<=", toDate),
      where("userEmail", "==", email)
    );

    // Execute the query
    let querySnapshot = await getDocs(q);
    let docs = [];

    // Collect documents data
    querySnapshot.forEach((doc) => docs.push(doc.data()));

    // console.log(docs);
    return docs;
  } catch (error) {
    console.error("Error:", error);
    notify("Something Went Wrong");
    return null;
  }
}
// Helper function to format a Date object to "dd/mm/yyyy" string
function formatDateToDDMMYYYY(date) {
  const day = String(date.getDate()).padStart(2, "0");
  const month = String(date.getMonth() + 1).padStart(2, "0"); // Months are 0-indexed
  const year = date.getFullYear();
  return `${day}/${month}/${year}`;
}

// Function to pad and normalize date to "dd/mm/yyyy" format
function padDate(date) {
  const dateString = formatDateToDDMMYYYY(date);
  const [day, month, year] = dateString.split("/");
  return `${day.padStart(2, "0")}/${month.padStart(2, "0")}/${year}`;
}

async function getBookingsBetweenDates(fromDate, toDate, reference, id, role) {
  const user = JSON.parse(localStorage.getItem("userDoc"));
  const collectionRef = collection(db, "place_bookings");

  try {
    console.log({ fromDate, toDate });

    let baseQuery = query(
      collectionRef,
      where("createdAtStandardized", ">=", fromDate),
      where("createdAtStandardized", "<=", toDate)
    );

    if (role !== "admin") {
      console.log("fetch only for:", user.email);
      baseQuery = query(baseQuery, where("userEmail", "==", user.email));
    }

    if (reference) {
      baseQuery = query(baseQuery, where("pickupReference1", "==", reference));
    }

    const querySnapshot = await getDocs(baseQuery);

    const bookings = querySnapshot.docs.map((doc) => ({
      id: doc.id,
      ...doc.data(),
    }));

    console.log("Fetched bookings:", bookings);
    return bookings.reverse();
  } catch (error) {
    console.error("Error fetching bookings:", error);
    notify("Something went wrong");
    return [];
  }
}

async function getBookingsOnlyBetweenDates(fromDateString, toDateString) {
  const collectionRef = collection(db, "place_bookings");
  try {
    const fromDate = new Date(fromDateString);
    fromDate.setHours(0, 0, 0, 0);
    const toDate = new Date(toDateString);
    toDate.setHours(23, 59, 59, 999);

    const fromDateFormatted = formatDateToDDMMYYYY(fromDate);
    const toDateFormatted = formatDateToDDMMYYYY(toDate);

    // Query Firestore to get bookings within the date range
    const baseQuery = query(
      collectionRef,
      where("date", ">=", fromDate),
      where("date", "<=", toDate)
    );

    const querySnapshot = await getDocs(baseQuery);
    const docs = [];

    querySnapshot.forEach((doc) => docs.push(doc.data()));

    return docs;
  } catch (error) {
    console.error("Error:", error);
    return [];
  }
}

async function fetchAllFirstNames() {
  try {
    const q = query(collection(db, "users"));
    const querySnapshot = await getDocs(q);

    const firstNames = [];
    querySnapshot.forEach((doc) => {
      const data = doc.data();
      if (data.firstName) {
        firstNames.push(data.firstName);
      }
    });

    return firstNames;
  } catch (error) {
    console.error("Error fetching first names:", error);
    throw error;
  }
}

async function fetchAllEmail() {
  try {
    const q = query(collection(db, "users"));
    const querySnapshot = await getDocs(q);

    const email = [];
    querySnapshot.forEach((doc) => {
      const data = doc.data();
      if (data.email) {
        email.push(data.email);
      }
    });

    return email;
  } catch (error) {
    console.error("Error fetching first names:", error);
    throw error;
  }
}

async function getPaidDocumentsFromCollection(collectionName) {
  try {
    const user = JSON.parse(localStorage.getItem("userDoc"));

    if (!user) {
      notify("You're not logged in");
      return [];
    }

    const collectionRef = collection(db, collectionName);
    const querySnapshot = await getDocs(
      query(collectionRef, where("payment", "==", "paid"))
    );

    const paidDocuments = querySnapshot.docs.map((doc) => doc.data());
    return paidDocuments;
  } catch (error) {
    notify("Something went wrong while fetching documents");
    return [];
  }
}

async function getUsersEmail() {
  const user = JSON.parse(localStorage.getItem("userDoc"));
  if (!user) {
    notify("You're not logged in");
    return [];
  }
  try {
    const q = collection(db, "users");
    const querySnapshot = await getDocs(q);
    const documents = querySnapshot.docs.map((doc) => doc.data().email);
    return documents;
  } catch (error) {
    console.error("Error fetching user emails: ", error);
    notify("Something Went Wrong fetching");
    return [];
  }
}

async function getUsersEmailAndNames() {
  const user = JSON.parse(localStorage.getItem("userDoc"));
  if (!user) {
    notify("You're not logged in");
    return [];
  }
  try {
    const q = collection(db, "users");
    const querySnapshot = await getDocs(q);
    const documents = querySnapshot.docs.map((doc) => ({
      email: doc.data().email,
      name: doc.data().firstName,
      role: doc.data().role,
    }));

    return documents;
  } catch (error) {
    console.error("Error fetching user emails: ", error);
    notify("Something Went Wrong fetching");
    return [];
  }
}

const sanitizeDate = (dateStr) => {
  if (!dateStr) return "";

  const [day, month, year] = dateStr.split("/");
  return `${year}-${month}-${day}`.trim();
};

const fetchBookingsBetweenDates = async (datesRange, user) => {
  const { start, end } = datesRange;
  const email = user.email;

  // Sanitize the date strings to remove spaces
  const sanitizedStart = sanitizeDate(start);
  const sanitizedEnd = sanitizeDate(end);
  console.log({ sanitizedStart, sanitizedEnd, email });

  const startDate = Timestamp.fromDate(new Date(sanitizedStart));
  const endDate = Timestamp.fromDate(new Date(sanitizedEnd));

  try {
    const bookingsRef = collection(db, "place_bookings");

    const bookingsQuery = query(
      bookingsRef,
      where("dateTimestamp", ">", startDate),
      where("dateTimestamp", "<", endDate),
      where("driverEmail", "==", email)
    );

    const querySnapshot = await getDocs(bookingsQuery);

    const bookings = querySnapshot.docs.map((doc) => ({
      id: doc.id,
      ...doc.data(),
    }));

    console.log("Fetched bookings:", bookings.length);
    return bookings;
  } catch (error) {
    console.error("Error fetching bookings:", error.message);
    throw new Error("Error fetching bookings");
  }
};

export {
  fetchDocById,
  fetchFrequentAddresses,
  fetchPlace_booking,
  fetchPlace_job,
  getDocByDateAndId,
  getCollection,
  fetchOptions,
  getBookingsBetweenDates,
  fetchAllFirstNames,
  getPaidDocumentsFromCollection,
  fetchAllEmail,
  fetchPlaceBookingsExistingAccsMonthly,
  getUsersEmail,
  getUsersEmailAndNames,
  getDrivers,
  getDriverBookings,
  fetchMyPdfsOfDoc,
  getBookingsOnlyBetweenDates,
  fetchBookingsBetweenDates,
};
