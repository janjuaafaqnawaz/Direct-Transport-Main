"use client";
import React, { useEffect, useRef } from "react";
import Radar from "radar-sdk-js";
import "radar-sdk-js/dist/radar.css";

export default function PlacesAutocomplete({
  onLocationSelect,
  pickup,
  address,
}) {
  const autocompleteRef = useRef(null);
  const containerId = `autocomplete-${pickup ? "pick" : "drop"}`;

  useEffect(() => {
    Radar.initialize("prj_live_pk_fa04fb62631b87f8ef351d78bddf2c5717d482d9");

    // Initialize the autocomplete component
    autocompleteRef.current = Radar.ui.autocomplete({
      countryCode: "AU",
      container: containerId,
      placeholder: address?.label || "Search Address",
      responsive: true,
      onSelection: (selectedAddress) => {
        console.log(selectedAddress);

        // Set the value of the input field after selection
        const inputElement = document.querySelector(`#${containerId} input`);
        if (inputElement) {
          inputElement.value = selectedAddress?.formattedAddress || "";
        }

        // Pass the selected location data to the parent component
        const vals = {
          coordinates: {
            lat: selectedAddress?.latitude,
            lng: selectedAddress?.longitude,
          },
          label: selectedAddress?.formattedAddress,
          address: selectedAddress,
        };
        onLocationSelect(vals);
      },
    });

    return () => {
      autocompleteRef.current?.remove();
    };
  }, [ ]);

  return (
    <div className="w-full">
      <div id={containerId} />
    </div>
  );
}
