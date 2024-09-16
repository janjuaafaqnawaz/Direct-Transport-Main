"use client";
import { useFirebase } from "@/context/FirebaseContext";
import GooglePlacesAutocomplete, {
  geocodeByAddress,
  getLatLng,
} from "react-google-places-autocomplete";

export default function PlacesAutocomplete({
  onLocationSelect,
  pickup,
  width,
}) {
  const { loading, priceSettings } = useFirebase();

  const apiKey = priceSettings?.GOOGLE_MAPS_API;

  const handleLocationSelect = async (selected) => {
    try {
      console.log(selected);

      const results = await geocodeByAddress(selected.label);
      const latLng = await getLatLng(results[0]);

      // Extract the suburb from the address components
      const addressComponents = results[0].address_components;
      let suburb = "";

      addressComponents.forEach((component) => {
        if (
          component.types.includes("sublocality") ||
          component.types.includes("locality")
        ) {
          suburb = component.long_name;
        }
      });

      const vals = { coordinates: latLng, label: selected.label, suburb };

      onLocationSelect(vals);
    } catch (error) {
      console.log(error);
    }
  };

  if (loading) {
    return null;
  }

  return (
    <>
      <div
        style={{
          width:
            width === false || width === undefined || width === null
              ? "100%"
              : "100%",
          background: "#fff",
        }}
      >
        <GooglePlacesAutocomplete
          apiKey={apiKey}
          autocompletionRequest={{
            componentRestrictions: { country: "AU" },
          }}
          selectProps={{
            onChange: handleLocationSelect,
          }}
        />
      </div>
      <div>
        <p
          style={{
            fontWeight: 400,
            fontSize: "13px",
            marginLeft: "1rem",
            color: "gray",
          }}
        >
          {pickup ? "Pick Up Address" : "Delivery Address"}
        </p>
      </div>
    </>
  );
}
