"use client"; // Error boundaries must be Client Components

import { useEffect } from "react";

export default function Error({ error, reset }) {
  useEffect(() => {
    // Log the error to an error reporting service
    console.error(error);

    // Clear site cache and storage
    const clearSiteData = async () => {
      try {
        // Clear Cache Storage
        if ("caches" in window) {
          const cacheNames = await caches.keys();
          await Promise.all(cacheNames.map((cache) => caches.delete(cache)));
        }

        // Clear LocalStorage and SessionStorage
        localStorage.clear();
        sessionStorage.clear();

        // Clear IndexedDB
        if (window.indexedDB) {
          const databases = await indexedDB.databases();
          databases.forEach((db) => {
            if (db.name) {
              indexedDB.deleteDatabase(db.name);
            }
          });
        }
      } catch (err) {
        console.error("Error clearing site data:", err);
      }
    };

    clearSiteData();
  }, [error]);

  return (
    <div>
      <h2>Something went wrong!</h2>
      <button
        onClick={() => reset()} // Attempt to recover by re-rendering the segment
      >
        Try again
      </button>
    </div>
  );
}
