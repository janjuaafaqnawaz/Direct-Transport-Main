"use client";

import { useState, useCallback } from "react";
import { useLoadScript, Autocomplete } from "@react-google-maps/api";
import { Input } from "@/components/ui/input";
import { Button } from "@nextui-org/react";
import { Save, Upload, Check, Loader2, UploadCloud } from "lucide-react";
import { addFrequentAddress } from "@/api/firebase/functions/upload";
import { fetchFrequentAddresses } from "@/api/firebase/functions/fetch";

const libraries = ["places"];

export default function GooglePlacesInput({ onLocationSelect }) {
  const [autocomplete, setAutocomplete] = useState(null);
  const [newAddress, setNewAddress] = useState(null);
  const [isSaving, setIsSaving] = useState(false);
  const [saveSuccess, setSaveSuccess] = useState(false);

  const API = "AIzaSyACXmi5Hwi2SRE_VqmYqSI7gdLOa9neomg";
  const { isLoaded, loadError } = useLoadScript({
    googleMapsApiKey: API,
    libraries: libraries,
  });

  const onLoad = useCallback((autocomplete) => {
    setAutocomplete(autocomplete);
  }, []);

  const onPlaceChanged = () => {
    if (autocomplete !== null) {
      const place = autocomplete.getPlace();
      if (!place.geometry) return;

      const lat = place.geometry.location.lat();
      const lng = place.geometry.location.lng();
      const addressComponents = place.address_components;

      const getAddressComponent = (types) => {
        const component = addressComponents.find((comp) =>
          types.some((type) => comp.types.includes(type))
        );
        return component ? component.long_name : null;
      };

      const formattedLocation = {
        coordinates: { lat, lng },
        label: place.formatted_address,
        address: {
          latitude: lat,
          longitude: lng,
          geometry: { type: "Point", coordinates: [lng, lat] },
          country: getAddressComponent(["country"]),
          countryCode: getAddressComponent(["country"]),
          county: getAddressComponent(["administrative_area_level_2"]),
          city: getAddressComponent(["locality", "sublocality"]),
          suburb: getAddressComponent(["sublocality_level_1", "neighborhood"]),
          state: getAddressComponent(["administrative_area_level_1"]),
          stateCode: getAddressComponent(["administrative_area_level_1"]),
          formattedAddress: place.formatted_address,
          addressLabel: place.name,
        },
      };

      console.log(formattedLocation);
      onLocationSelect(formattedLocation);
      setNewAddress(formattedLocation);
    }
  };

  const handleSubmit = async () => {
    if (!newAddress) return;

    setIsSaving(true);
    setSaveSuccess(false);
    const disabledReload = true;

    try {
      const company = {
        ...newAddress,
        label: newAddress.label,
      };
      await addFrequentAddress(company, disabledReload);
      await fetchFrequentAddresses();
      setSaveSuccess(true);
    } catch (error) {
      console.error("Error adding address:", error);
    } finally {
      setIsSaving(false);
      // setTimeout(() => setSaveSuccess(false), 10000);
    }
  };

  if (loadError) return <div>Error loading maps</div>;
  if (!isLoaded) return <div>Loading...</div>;

  return (
    <div className="w-full mb-2 mt-4">
      <Autocomplete
        onLoad={onLoad}
        onPlaceChanged={onPlaceChanged}
        options={{ componentRestrictions: { country: "AU" } }}
      >
        <div className="relative w-full flex flex-row">
          <Input
            id="place-input"
            type="text"
            placeholder="Enter a location"
            className="w-full border-gray-400 h-10 placeholder:text-gray-600"
          />
          <Button
            variant="bordered"
            className="rounded-md ml-1"
            isIconOnly
            onClick={handleSubmit}
            disabled={isSaving}
          >
            {isSaving ? (
              <Loader2 className="animate-spin" />
            ) : saveSuccess ? (
              <Check />
            ) : (
              <UploadCloud />
            )}
          </Button>
        </div>
      </Autocomplete>
    </div>
  );
}
