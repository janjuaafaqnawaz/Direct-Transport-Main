"use client";

import { useState, useEffect } from "react"; // Import missing hooks
import { Input } from "@mantine/core";
import { ApiRounded } from "@mui/icons-material";
import React from "react";
import { fetchDocById } from "@/api/firebase/functions/fetch";
import { updateDoc } from "@/api/firebase/functions/upload";

export default function Page() {
  const [priceSettings, setPriceSettings] = useState({});
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchSettings = async () => {
      try {
        const res = await fetchDocById("dev", "data");
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
      await updateDoc("data", "dev", priceSettings);
    } catch (error) {
      console.error("Failed to save settings:", error);
    } finally {
      setLoading(false);
    }
  };

  const handleChange = (field, value) => {
    setPriceSettings((prev) => ({
      ...prev,
      [field]: value,
    }));
  };

  return (
    <div>
      <Input
        value={priceSettings.GOOGLE_MAPS_API || ""}
        onChange={(e) => handleChange("GOOGLE_MAPS_API", e.target.value)}
        placeholder="GOOGLE MAPS API"
        leftSection={<ApiRounded size={16} />}
      />
      {/* Add a save button */}
      <button onClick={handleSave} disabled={loading}>
        {loading ? "Saving..." : "Save"}
      </button>
    </div>
  );
}
