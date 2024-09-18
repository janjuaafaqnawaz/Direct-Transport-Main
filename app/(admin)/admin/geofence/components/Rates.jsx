"use client";

import { updateDoc } from "@/api/firebase/functions/upload";
import { fetchDocById } from "@/api/firebase/functions/fetch";

import { Button, Input } from "@mantine/core";
import React, { useState, useEffect } from "react"; // Added useEffect

export default function Rates() {
  const [priceSettings, setPriceSettings] = useState({});
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchSettings = async () => {
      try {
        const res = await fetchDocById("price_settings", "data");
        console.log(res);

        setPriceSettings(res);
      } catch (error) {
        console.error("Error fetching price settings:", error);
      } finally {
        setLoading(false);
      }
    };
    fetchSettings();
  }, []);

  const handleSave = async () => {
    setLoading(true);

    try {
      console.log(priceSettings);

      await updateDoc("data", "price_settings", priceSettings);
    } catch (error) {
      console.error("Failed to save settings:", error);
    } finally {
      setLoading(false);
    }
  };

  const handleChange = (e) => {
    setPriceSettings({
      ...priceSettings,
      long_distance: {
        ...priceSettings.long_distance,
        [e.target.name]: e.target.value,
      },
    });
  };

  return (
    <div className="m-6">
      <div className="grid grid-cols-2 gap-2">
        <Input
          type="number"
          value={priceSettings?.long_distance?.rateSmallVolume || ""}
          name="rateSmallVolume"
          onChange={handleChange}
          placeholder="Rate for Small Volume (≤ 1000)"
        />
        <Input
          type="number"
          value={priceSettings?.long_distance?.rateLargeVolume || ""}
          name="rateLargeVolume"
          onChange={handleChange}
          placeholder="Rate for Large Volume (> 1000)"
        />
      </div>
      <Button mt={6} fullWidth loading={loading} onClick={handleSave}>
        Save
      </Button>
    </div>
  );
}
