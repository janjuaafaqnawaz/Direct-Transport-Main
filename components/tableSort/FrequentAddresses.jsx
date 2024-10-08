"use client";
import { useState } from "react";
import {
  Table,
  TableBody,
  TableCell,
  TableContainer,
  TableHead,
  TableRow,
  Paper,
} from "@mui/material";
import { updateFrequentAddress } from "../../api/firebase/functions/upload";
import { Button } from "@mantine/core";

export default function FrequentAddresses({ addresses }) {
  const [modifiedAddresses, setModifiedAddresses] = useState(addresses);
  console.log(addresses);

  const handleDelete = (index) => {
    // Use filter to create a new array without the item at the given index
    const updatedAddresses = modifiedAddresses.filter((_, i) => i !== index);
    setModifiedAddresses(updatedAddresses);
    updateFrequentAddress(updatedAddresses);
  };

  return (
    <div style={{ width: "97vw" }}>
      <TableContainer
        component={Paper}
        style={{ width: "80%", margin: "2rem auto" }}
      >
        <Table sx={{ minWidth: 650 }} aria-label="simple table">
          <TableHead>
            <TableRow>
              <TableCell>No</TableCell>
              <TableCell>Address</TableCell>
              <TableCell>Delete</TableCell>
            </TableRow>
          </TableHead>
          <TableBody>
            {modifiedAddresses &&
              modifiedAddresses.map((row, index) => (
                <TableRow key={index + 1}>
                  <TableCell>{index + 1}</TableCell>
                  <TableCell>{row?.label}</TableCell>
                  <TableCell>
                    <Button
                      variant="filled"
                      color="#1384e1"
                      onClick={() => handleDelete(index)}
                    >
                      Delete
                    </Button>
                  </TableCell>
                </TableRow>
              ))}
          </TableBody>
        </Table>
      </TableContainer>
    </div>
  );
}
