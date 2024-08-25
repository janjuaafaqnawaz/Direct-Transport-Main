"use client";
import { fetchFrequentAddresses } from "@/api/firebase/functions/fetch";
import { Autocomplete, TextField } from "@mui/material";
import React, { useEffect, useState } from "react";

export default function FrequentAddress({
  address,
  handleChange,
  show,
  diseble,
  visible,
}) {
  const [frequentAddresses, setFrequentAddresses] = useState([]);

  useEffect(() => {
    async function fetchData() {
      try {
        const data = await fetchFrequentAddresses();
        console.log({ data }, "DSa", 6 + 6);
        setFrequentAddresses(data);
        const user = JSON.parse(localStorage.getItem("userDoc")) || {};
      } catch (error) {
        console.error("Error fetching data: ", error);
      }
    }
    fetchData();
  }, []);

  if (!visible) return null;

  const options = frequentAddresses?.map((option) => ({
    label: option.label,
  }));

  if (!frequentAddresses || frequentAddresses.length === 0) {
    return null;
  }

  return (
    <Autocomplete
      style={{
        width: "100%",
        margin: "30px 0",
      }}
      options={options}
      getOptionLabel={(option) => option.label}
      renderInput={(params) => (
        <TextField
          {...params}
          label="Frequent Address"
          placeholder="Select from saved address"
          variant="outlined"
        />
      )}
      value={address && address.label ? { label: address.label } : null} // Ensure value is an object with label
      onChange={(event, newValue) => {
        const newAddress = frequentAddresses.find(
          (option) => option.label === (newValue ? newValue.label : "")
        );
        handleChange(newAddress);

        show();
      }}
      disableClearable
      size="small"
    />
  );
}
