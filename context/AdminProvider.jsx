import { app } from "@/api/firebase/config";
import {
  collection,
  getFirestore,
  query,
  onSnapshot,
  limit,
  startAfter,
  orderBy,
} from "firebase/firestore";
import { createContext, useContext, useEffect, useState } from "react";

const AdminContext = createContext();

const useAdminContext = () => useContext(AdminContext);
export const db = getFirestore(app);

const AdminProvider = ({ children }) => {
  const [allBookings, setAllBookings] = useState([]);
  const [allUsers, setAllUsers] = useState([]);
  const [allDrivers, setAllDrivers] = useState([]);
  const [lastBookingDoc, setLastBookingDoc] = useState(null); // For pagination
  const [lastUserDoc, setLastUserDoc] = useState(null); // For pagination
  const [isLoading, setIsLoading] = useState(false); // Loading state

  const BOOKINGS_LIMIT = 10; // Number of docs per page
  const USERS_LIMIT = 10; // Number of docs per page

  // Function to fetch bookings with real-time listener and pagination
  const fetchBookingsWithPagination = (isInitial = false) => {
    setIsLoading(true);
    try {
      const bookingsRef = collection(db, "place_bookings");
      let bookingsQuery = query(
        bookingsRef,
        orderBy("createdAt", "desc"), // Order by newest first
        limit(BOOKINGS_LIMIT)
      );

      // If not the first load, start after the last fetched doc for pagination
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

      // Clean up the listener
      return unsubscribe;
    } catch (error) {
      console.error("Error fetching bookings:", error);
      setIsLoading(false);
    }
  };

  // Function to fetch users with real-time listener and pagination
  const fetchUsersWithPagination = (isInitial = false) => {
    setIsLoading(true);
    try {
      const usersRef = collection(db, "users");
      let usersQuery = query(
        usersRef,
        orderBy("createdAt", "desc"), // Order by newest first
        limit(USERS_LIMIT)
      );

      // If not the first load, start after the last fetched doc for pagination
      if (!isInitial && lastUserDoc) {
        usersQuery = query(usersQuery, startAfter(lastUserDoc));
      }

      const unsubscribe = onSnapshot(usersQuery, (querySnapshot) => {
        const documents = [];
        querySnapshot.forEach((doc) => {
          documents.push({ id: doc.id, ...doc.data() });
        });

        if (querySnapshot.docs.length > 0) {
          setLastUserDoc(querySnapshot.docs[querySnapshot.docs.length - 1]);
        }

        setAllUsers((prevUsers) =>
          isInitial ? documents : [...prevUsers, ...documents]
        );
        setAllDrivers((prevDrivers) =>
          isInitial
            ? documents.filter((user) => user.role === "driver")
            : [
                ...prevDrivers,
                ...documents.filter((user) => user.role === "driver"),
              ]
        );
        setIsLoading(false);
      });

      // Clean up the listener
      return unsubscribe;
    } catch (error) {
      console.error("Error fetching users:", error);
      setIsLoading(false);
    }
  };

  useEffect(() => {
    // Initial fetch for bookings and users
    const unsubscribeBookings = fetchBookingsWithPagination(true);
    const unsubscribeUsers = fetchUsersWithPagination(true);

    // Clean up listeners on component unmount
    return () => {
      if (unsubscribeBookings) unsubscribeBookings();
      if (unsubscribeUsers) unsubscribeUsers();
    };
  }, []);

  return (
    <AdminContext.Provider
      value={{
        allBookings,
        allUsers,
        allDrivers,
        fetchNextBookingsPage: () => fetchBookingsWithPagination(false), // Function to fetch next page
        fetchNextUsersPage: () => fetchUsersWithPagination(false), // Function to fetch next page
        isLoading,
      }}
    >
      {children}
    </AdminContext.Provider>
  );
};

export { AdminProvider };
export default useAdminContext;
