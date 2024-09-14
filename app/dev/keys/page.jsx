"use client";

import React, { useState } from "react";
import { Input, Button, Stack, Loader, Center } from "@mantine/core";
import { ApiRounded } from "@mui/icons-material";
import { updateDoc } from "@/api/firebase/functions/upload";
import { useFirebase } from "@/context/FirebaseContext";

export default function Page() {
  const { loading, priceSettings, setPriceSettings } = useFirebase();
  const [saving, setSaving] = useState(false);

  const handleSave = async () => {
    setSaving(true);
    try {
      await updateDoc("data", "dev", priceSettings); // Save the entire priceSettings object
    } catch (error) {
      console.error("Failed to save settings:", error);
    } finally {
      setSaving(false);
    }
  };

  const handleChange = (value) => {
    setPriceSettings((prevSettings) => ({
      ...prevSettings,
      GOOGLE_MAPS_API: value, // Update the GOOGLE_MAPS_API key in priceSettings
    }));
  };

  return (
    <Center style={{ minHeight: "100vh", backgroundColor: "#f8f9fa" }}>
      {loading ? (
        <Loader />
      ) : (
        <Stack
          spacing="md"
          sx={{
            width: 400,
            padding: 20,
            backgroundColor: "#fff",
            borderRadius: 8,
            boxShadow: "0 4px 12px rgba(0,0,0,0.1)",
          }}
        >
          <Input
            value={priceSettings.GOOGLE_MAPS_API || ""}
            onChange={(e) => handleChange(e.target.value)} // Update priceSettings directly
            placeholder="Enter GOOGLE MAPS API Key"
            icon={<ApiRounded />}
            size="md"
          />
          <Button onClick={handleSave} loading={saving} fullWidth>
            Save
          </Button>
        </Stack>
      )}
    </Center>
  );
}
