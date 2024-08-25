"use client";

import { useState } from "react";
import { TextField, InputAdornment, Box, MenuItem } from "@mui/material";
import { useDisclosure } from "@mantine/hooks";
import { Button, Modal, Table } from "@mantine/core";
import DimensionsTable from "./DimensionsTable";

export default function ModifyDimensions({ items }) {
  const initForm = {
    weight: "",
    height: "",
    width: "",
  };
  const [allItems, setAllItems] = useState(items);
  const [opened, { open, close }] = useDisclosure(false);
  const [formData, setFormData] = useState(initForm);

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData((prevFormData) => ({
      ...prevFormData,
      [name]: value,
    }));
  };

  const handleSubmit = () => {
    const newItem = {
      weight: formData.weight,
      height: formData.height,
      width: formData.width,
    };
    setFormData(initForm);
  };

  return (
    <>
      <Button fullWidth variant="filled" onClick={open}>
        Add Item
      </Button>

      <Modal opened={opened} onClose={close} title="New Item" centered>
        <DimensionsTable items={allItems} handleDelete={null} diseble={true} />
        <br />
        <Box>
          <TextField
            InputProps={{
              endAdornment: (
                <InputAdornment position="start">kg</InputAdornment>
              ),
            }}
            type="number"
            style={{ margin: ".5rem", width: 120 }}
            label="Weight"
            name="weight"
            value={formData.weight}
            onChange={handleChange}
          />
          <TextField
            InputProps={{
              endAdornment: (
                <InputAdornment position="start">cm</InputAdornment>
              ),
            }}
            type="number"
            style={{ margin: ".5rem", width: 120 }}
            label="Height"
            name="height"
            value={formData.height}
            onChange={handleChange}
          />
          <TextField
            InputProps={{
              endAdornment: (
                <InputAdornment position="start">cm</InputAdornment>
              ),
            }}
            type="number"
            style={{ margin: ".5rem", width: 120 }}
            label="Width"
            name="width"
            value={formData.width}
            onChange={handleChange}
          />
        </Box>
        <Button style={{ width: "100%" }} onClick={handleSubmit}>
          Submit
        </Button>
        <Button style={{ width: "100%" }} onClick={null}>
          Save
        </Button>
      </Modal>
    </>
  );
}
