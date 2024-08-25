import React from "react";
import { TextField, MenuItem } from "@mui/material";
import { serviceOptions } from "@/components/static";

export default function ServicesFields({ value, handleChange, disable }) {
  return (
    <TextField
      fullWidth
      select
      size="small"
      label="Level of Service"
      helperText="Please select a level of service"
      variant="outlined"
      value={value}
      onChange={(e) => handleChange(e.target.value)}
      disabled={disable}
    >
      {serviceOptions.map((option) => (
        <MenuItem key={option.value} value={option.value}>
          <div className="flex flex-col align-middle">
            <p className="font-semibold">{option.value}</p>
            {option.disc && (
              <div>
                <p className="text-xs ">{option.disc}</p>
                <p className="text-xs  text-red-600">{option.disc2}</p>
              </div>
            )}
          </div>
        </MenuItem>
      ))}
    </TextField>
  );
}
