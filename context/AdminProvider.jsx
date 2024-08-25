import { app } from "@/api/firebase/config";
import {
  collection,
  getFirestore,
  query,
  onSnapshot,
} from "firebase/firestore";
import { createContext, useContext, useEffect, useState } from "react";

const AdminContext = createContext();

const useAdminContext = () => useContext(AdminContext);
export const db = getFirestore(app);

const AdminProvider = ({ children }) => {
  const [allBookings, setAllBookings] = useState([]);
  const [allUsers, setAllUsers] = useState([]);
  const [allDrivers, setAllDrivers] = useState([]);

  useEffect(() => {
    const fetchDashboardDataAndSetListeners = async () => {
      try {
        // Real-time listener for bookings
        const bookingsRef = collection(db, "place_bookings");
        const bookingsQuery = query(bookingsRef);
        const unsubscribeBookings = onSnapshot(
          bookingsQuery,
          (querySnapshot) => {
            const documents = [];
            querySnapshot.forEach((doc) => {
              documents.push({ id: doc.id, ...doc.data() });
            });
            setAllBookings(documents);
          }
        );

        // Real-time listener for users
        const usersRef = collection(db, "users");
        const usersQuery = query(usersRef);
        const unsubscribeUsers = onSnapshot(usersQuery, (querySnapshot) => {
          const documents = [];
          querySnapshot.forEach((doc) => {
            documents.push({ id: doc.id, ...doc.data() });
          });
          console.log(documents);
          setAllUsers(documents);
          setAllDrivers(documents.filter((user) => user.role === "driver"));
        });

        // Clean up listeners on unmount
        return () => {
          unsubscribeBookings();
          unsubscribeUsers();
        };
      } catch (error) {
        console.log(error);
      }
    };

    fetchDashboardDataAndSetListeners();
  }, []);

  return (
    <AdminContext.Provider
      value={{
        allBookings,
        allUsers,
        allDrivers,
      }}
    >
      {children}
    </AdminContext.Provider>
  );
};

export { AdminProvider };
export default useAdminContext;
