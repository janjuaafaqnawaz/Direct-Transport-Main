"use client";

import { useState, useEffect } from "react";

const SYDNEY_TIMEZONE = "Australia/Sydney";

export default function useAutoRefresh() {
  const [nextRefresh, setNextRefresh] = useState(null > null);

  useEffect(() => {
    function calculateNextRefresh() {
      const now = new Date();
      const sydneyTime = new Date(
        now.toLocaleString("en-US", { timeZone: SYDNEY_TIMEZONE })
      );
      const tomorrow = new Date(sydneyTime);
      tomorrow.setDate(tomorrow.getDate() + 1);
      tomorrow.setHours(0, 0, 0, 0);
      return new Date(
        tomorrow.toLocaleString("en-US", { timeZone: SYDNEY_TIMEZONE })
      );
    }

    function scheduleRefresh() {
      const next = calculateNextRefresh();
      setNextRefresh(next);
    }

    scheduleRefresh();

    // Re-schedule refresh when the component mounts or after a refresh occurs
    window.addEventListener("focus", scheduleRefresh);
    return () => {
      window.removeEventListener("focus", scheduleRefresh);
    };
  }, []);

  return nextRefresh;
}

// With these changes, your auto-refresh functionality should work as expected, even if the user's PC goes to sleep or they come back to the site the next day without manually refreshing. Here's what happens:

// 1. The `AutoRefresh` component is rendered as part of your layout, so it's present on every page.
// 2. The `useAutoRefresh` hook calculates the next refresh time (12:00 AM Sydney time) and updates it when needed.
// 3. The `AutoRefresh` component sets a timeout to refresh the page at the calculated time.
// 4. If the user's PC goes to sleep or they close the browser, the timeout will be cleared.
// 5. When the user comes back to the site, the `focus` event will trigger, recalculating the next refresh time and setting a new timeout if needed.
// 6. The page will refresh automatically at 12:00 AM Sydney time, or shortly after if the page wasn't open at exactly that time.

// This implementation should provide a robust solution for automatically refreshing your site at midnight Sydney time, regardless of the user's actions or device state .
