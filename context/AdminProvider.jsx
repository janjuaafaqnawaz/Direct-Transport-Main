import { app } from "@/api/firebase/config";
import {
  collection,
  doc, // <-- Add doc for document reference
  getFirestore,
  query,
  onSnapshot,
  limit,
  startAfter,
  orderBy,
  getCountFromServer,
} from "firebase/firestore";
import { createContext, useContext, useEffect, useState } from "react";

const AdminContext = createContext();

const useAdminContext = () => useContext(AdminContext);
export const db = getFirestore(app);
const roleOptions = [
  { value: "admin", label: "Admin" },
  { value: "business", label: "Business" },
  { value: "user", label: "User" },
  { value: "archived", label: "Archived" },
];
const AdminProvider = ({ children }) => {
  const [allBookings, setAllBookings] = useState([]);
  const [allUsers, setAllUsers] = useState([]);
  const [allDrivers, setAllDrivers] = useState([]);
  const [allArchivedAccounts, setArchivedAccounts] = useState([]);
  const [lastBookingDoc, setLastBookingDoc] = useState(null);
  const [isLoading, setIsLoading] = useState(false);
  const [priceSettings, setPriceSettings] = useState(null); // <-- State for price settings

  const [totalBookings, setTotalBookings] = useState(0); // Store total bookings count
  const BOOKINGS_LIMIT = 100;

  // Function to fetch total document counts in Firestore collection
  const fetchDocumentCounts = async () => {
    try {
      const bookingsRef = collection(db, "place_bookings");
      const bookingsSnapshot = await getCountFromServer(query(bookingsRef));
      setTotalBookings(bookingsSnapshot.data().count);
    } catch (error) {
      console.error("Error counting documents:", error);
    }
  };

  // Function to fetch bookings with pagination and real-time updates
  const fetchBookingsWithPagination = (isInitial = false) => {
    setIsLoading(true);
    try {
      const bookingsRef = collection(db, "place_bookings");
      let bookingsQuery = query(
        bookingsRef,
        orderBy("createdAt", "desc"),
        limit(BOOKINGS_LIMIT)
      );

      if (!isInitial && lastBookingDoc) {
        bookingsQuery = query(bookingsQuery, startAfter(lastBookingDoc));
      }

      const unsubscribe = onSnapshot(bookingsQuery, (querySnapshot) => {
        const documents = [];
        querySnapshot.forEach((doc) => {
          documents.push({ id: doc.id, ...doc.data() });
        });

        if (querySnapshot.docs.length > 0) {
          setLastBookingDoc(querySnapshot.docs[querySnapshot.docs.length - 1]);
        }

        setAllBookings((prevBookings) =>
          isInitial ? documents : [...prevBookings, ...documents]
        );
        setIsLoading(false);
      });

      return unsubscribe; // Unsubscribe from the listener when done
    } catch (error) {
      console.error("Error fetching bookings:", error);
      setIsLoading(false);
    }
  };

  // Function to fetch users and drivers with real-time updates
  const fetchUsers = () => {
    setIsLoading(true);
    try {
      const usersRef = collection(db, "users");
      const usersQuery = query(usersRef);

      const unsubscribeUsers = onSnapshot(usersQuery, (querySnapshot) => {
        const documents = [];
        querySnapshot.forEach((doc) => {
          documents.push({ id: doc.id, ...doc.data() });
        });

        // Separate drivers from the user list
        setAllUsers(documents.filter((user) => user.role !== "archived"));
        setAllDrivers(documents.filter((user) => user.role === "driver"));
        setArchivedAccounts(
          documents.filter((user) => user.role === "archived")
        );
        setIsLoading(false); // Reset loading state after fetching
      });

      return unsubscribeUsers; // Return the unsubscribe function
    } catch (error) {
      console.error("Error fetching users:", error);
      setIsLoading(false); // Reset loading state on error
    }
  };

  // Function to fetch price settings with real-time updates
  const fetchPriceSettings = () => {
    try {
      const priceSettingsRef = doc(db, "data", "price_settings"); // Reference to 'price_settings' doc

      const unsubscribePriceSettings = onSnapshot(
        priceSettingsRef,
        (docSnapshot) => {
          if (docSnapshot.exists()) {
            setPriceSettings(docSnapshot.data());
          } else {
            console.log("Price settings document does not exist.");
          }
        }
      );

      return unsubscribePriceSettings; // Return the unsubscribe function
    } catch (error) {
      console.error("Error fetching price settings:", error);
    }
  };

  useEffect(() => {
    // Initial fetch for bookings and users
    const unsubscribeBookings = fetchBookingsWithPagination(true);
    const unsubscribeUsers = fetchUsers(); // Corrected fetchUsers call
    const unsubscribePriceSettings = fetchPriceSettings(); // Fetch price settings in real-time
    fetchDocumentCounts(); // Fetch the total bookings count

    // Clean up listeners on component unmount
    return () => {
      if (unsubscribeBookings) unsubscribeBookings();
      if (unsubscribeUsers) unsubscribeUsers(); // Unsubscribe from users snapshot listener
      if (unsubscribePriceSettings) unsubscribePriceSettings(); // Unsubscribe from price settings listener
    };
  }, []); // Run once on component mount

  const archivedBookings = allBookings.filter(
    (item) => item?.isArchived === true
  );
  const unArchivedBookings = allBookings.filter(
    (item) => item?.isArchived !== true
  );

  return (
    <AdminContext.Provider
      value={{
        allBookings: unArchivedBookings,
        allUsers,
        allDrivers,
        allArchivedAccounts,
        fetchNextBookingsPage: () => fetchBookingsWithPagination(false),
        isLoading,
        totalBookings,
        archivedBookings,
      }}
    >
      {children}
    </AdminContext.Provider>
  );
};

export { AdminProvider };
export default useAdminContext;
