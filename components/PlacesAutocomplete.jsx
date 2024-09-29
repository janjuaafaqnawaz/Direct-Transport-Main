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

    autocompleteRef.current = Radar.ui.autocomplete({
      countryCode: "AU",
      container: containerId,
      placeholder: address?.label || "Search Address",
      responsive: true,
      limit: 20,
      maxHeight: "300px",
      onSelection: (address) => {
        const vals = {
          coordinates: {
            lat: address?.latitude,
            lng: address?.longitude,
          },
          label: address?.formattedAddress,
          address,
        };
        console.log(vals);
        onLocationSelect(vals);
      },
    });

    return () => {
      autocompleteRef.current?.remove();
    };
  }, [containerId, onLocationSelect, address]);

  return (
    <>
      <div className="w-full">
        <div id={containerId} />
      </div>
    </>
  );
}
