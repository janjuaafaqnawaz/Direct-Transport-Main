"use client";

import { TextField } from "@mui/material";

export default function CustomInput({ name, label, value, handleChange }) {
  return (
    <TextField
      fullWidth
      style={{ maxWidth: 700, marginTop: 10 }}
      name={name || ""}
      label={label || ""}
      variant="outlined"
      helperText={`Enter ${label || ""}  `}
      size="small"
      value={value || ""}
      onChange={handleChange}
    />
  );
}

// <Input
// fullWidth
// className="my-4"
// name={name || ""}
// label={label || ""}
// placeholder={`Enter ${label || "your"}`}
// value={value}
// onChange={handleChange}
// />
