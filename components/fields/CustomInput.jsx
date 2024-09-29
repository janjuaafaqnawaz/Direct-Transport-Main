"use client";

import { TextField } from "@mui/material";

export default function CustomInput({
  name,
  label,
  value,
  handleChange,
  type,
}) {
  return (
    <TextField
      fullWidth
      style={{ maxWidth: 700, marginTop: 10 }}
      name={name || ""}
      placeholder={label || ""}
      variant="outlined"
      label={`Enter ${label || ""}  `}
    
      size="small"
      value={value || ""}
      onChange={handleChange}
      type={type}
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
