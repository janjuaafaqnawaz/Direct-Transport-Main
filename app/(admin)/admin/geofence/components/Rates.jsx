"use client";

import { updateDoc } from "@/api/firebase/functions/upload";
import { fetchDocById } from "@/api/firebase/functions/fetch";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import React, { useState, useEffect } from "react";
import { Loader2 } from "lucide-react";

export default function Component() {
  const [priceSettings, setPriceSettings] = useState({
    long_distance: {
      rateSmallVolume: "",
      rateLargeVolume: "",
      minServices: {},
      services: {},
    },
  });
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchSettings = async () => {
      try {
        const res = await fetchDocById("price_settings", "data");
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
      await updateDoc("data", "price_settings", priceSettings);
    } catch (error) {
      console.error("Failed to save settings:", error);
    } finally {
      setLoading(false);
    }
  };

  const handleChange = (e) => {
    const { name, value } = e.target;
    const keys = name.split(".");

    setPriceSettings((prev) => {
      const updatedSettings = { ...prev };
      let current = updatedSettings.long_distance;

      keys.slice(1).forEach((key, index) => {
        if (index === keys.length - 2) {
          current[key] = value; // Set the value on the last key
        } else {
          current = current[key] = { ...current[key] }; // Create nested objects if they don't exist
        }
      });

      return updatedSettings;
    });
  };

  if (loading) {
    return (
      <div className="flex justify-center items-center h-screen">
        <Loader2 className="h-8 w-8 animate-spin" />
      </div>
    );
  }

  return (
    <Card className="w-full">
      <CardHeader>
        <CardTitle className="text-2xl font-bold">
          Long Distance Rates
        </CardTitle>
      </CardHeader>
      <CardContent>
        <div className="space-y-4">
          <h3 className="text-lg font-semibold">Minimum Services</h3>
          <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4">
            {Object.entries(priceSettings.long_distance.minServices).map(
              ([service, min]) => (
                <Input
                  key={service}
                  type="number"
                  value={min}
                  name={`long_distance.minServices.${service}`}
                  onChange={handleChange}
                  placeholder={`Min for ${service}`}
                  label={`Min ${service}`}
                />
              )
            )}
          </div>
        </div>
        <div className="mt-6 space-y-4">
          <h3 className="text-lg font-semibold">Services</h3>
          <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4">
            {Object.entries(priceSettings.long_distance.services).map(
              ([service, cost]) => (
                <Input
                  key={service}
                  type="number"
                  value={cost}
                  name={`long_distance.services.${service}`}
                  onChange={handleChange}
                  placeholder={`Cost for ${service}`}
                  label={service}
                />
              )
            )}
          </div>
        </div>
        <Button className="w-full mt-6" onClick={handleSave} disabled={loading}>
          {loading ? (
            <>
              <Loader2 className="mr-2 h-4 w-4 animate-spin" />
              Saving...
            </>
          ) : (
            "Save"
          )}
        </Button>
      </CardContent>
    </Card>
  );
}
