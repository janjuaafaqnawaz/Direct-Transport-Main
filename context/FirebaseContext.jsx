import React, { createContext, useContext, useState, useEffect } from "react";
import { fetchDocById } from "@/api/firebase/functions/fetch";

// Create a context
const FirebaseContext = createContext();

// Context Provider
export const FirebaseProvider = ({ children }) => {
  const [loading, setLoading] = useState(false);
  const [priceSettings, setPriceSettings] = useState({});

  useEffect(() => {
    const auth = async () => {
      try {
        const userDoc = JSON.parse(localStorage.getItem("userDoc")) || {};
        const userRole = userDoc.role || null;

        if (userRole) {
          await fetch();
        } else {
          setLoading(false);
        }
      } catch (error) {
        console.error("Error parsing user data:", error);
        setLoading(false);
      }
    };

    auth();
  }, []);

  const fetch = async () => {
    setLoading(true);
    try {
      const res = await fetchDocById("dev", "data");
      setPriceSettings(res);
    } catch (err) {
      console.log("Error fetching price settings:", err);
    } finally {
      setLoading(false);
    }
  };

  return (
    <FirebaseContext.Provider
      value={{
        loading,
        priceSettings,
        setPriceSettings,
      }}
    >
      {children}
    </FirebaseContext.Provider>
  );
};

// Custom hook to use FirebaseContext
export const useFirebase = () => useContext(FirebaseContext);
