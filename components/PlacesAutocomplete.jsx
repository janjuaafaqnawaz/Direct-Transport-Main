"use client";

import { useState, useCallback } from "react";
import { useLoadScript, Autocomplete } from "@react-google-maps/api";
import { Input } from "@/components/ui/input";

const libraries = ["places"];

export default function GooglePlacesInput({ onLocationSelect }) {
  const [autocomplete, setAutocomplete] = useState(null);

  const { isLoaded, loadError } = useLoadScript({
    googleMapsApiKey: "AIzaSyAqVtf4qM9DSMTbxeWH_742j7aD8zqQVvI", // Use your own API key
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
        coordinates: {
          lat: lat,
          lng: lng,
        },
        label: place.formatted_address,
        address: {
          latitude: lat,
          longitude: lng,
          geometry: {
            type: "Point",
            coordinates: [lng, lat],
          },
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
    }
  };

  if (loadError) return <div>Error loading maps</div>;
  if (!isLoaded) return <div>Loading...</div>;

  return (
    <div className="w-full">
      <Autocomplete
        onLoad={onLoad}
        onPlaceChanged={onPlaceChanged}
        options={{
          componentRestrictions: { country: "AU" }, // Restrict to Australia
        }}
      >
        <Input
          id="place-input"
          type="text"
          placeholder="Enter a location"
          className="w-full"
        />
      </Autocomplete>
    </div>
  );
}
