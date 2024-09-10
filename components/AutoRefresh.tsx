"use client";

import { useEffect } from "react";
import useAutoRefresh from "@/hooks/useAutoRefresh";
import { logout } from "@/api/firebase/functions/auth";

export function AutoRefresh() {
  const nextRefresh = useAutoRefresh();

  useEffect(() => {
    if (nextRefresh) {
      const now = new Date();
      const timeUntilRefresh = nextRefresh.getTime() - now.getTime();

      const refreshTimeout = setTimeout(() => {
        logout();
        window.location.reload();
      }, timeUntilRefresh);

      return () => clearTimeout(refreshTimeout);
    }
  }, [nextRefresh]);

  // return (
  //   <div className="fixed bottom-4 right-4 bg-gray-200 p-2 rounded shadow text-sm">
  //     Next refresh: {nextRefresh ? nextRefresh.toLocaleString() : 'Calculating...'}
  //   </div>
  // );

  return null;
}
