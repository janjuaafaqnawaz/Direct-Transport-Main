"use client";

import React, { useEffect, useState } from "react";
import {
  Modal,
  TextInput,
  NumberInput,
  Group,
  LoadingOverlay,
} from "@mantine/core";
import { useDisclosure } from "@mantine/hooks";
import { signUpWithEmail } from "@/api/firebase/functions/auth";
import { toast } from "react-toastify";
import { Button } from "@nextui-org/react";
import { updateDoc } from "@/api/firebase/functions/upload";

export default function Create({ edit, driver }) {
  const [opened, { open, close }] = useDisclosure(false);
  const [form, setForm] = useState({
    firstName: "",
    phone: "",
    companyAddress: "",
    password: "",
    email: "",
  });
  const [isLoading, setIsLoading] = useState(false);

  useEffect(() => {
    if (driver) {
      setForm(driver);
    }
  }, [driver]);

  const handleChange = (event) => {
    const { name, value } = event.target;
    setForm((prevForm) => ({ ...prevForm, [name]: value }));
  };

  const handleCreateOrUpdate = async () => {
    const { password, email } = form;

    setIsLoading(true);
    try {
      const userData = {
        ...form,
        role: "driver",
      };
      if (edit) {
        // Assuming updateDoc is defined and imported
        await updateDoc("users", email, userData);
        toast("User updated successfully.");
      } else {
        const res = await signUpWithEmail(email, password, userData);
        if (res) {
          toast("User created successfully.");
        } else {
          toast("Failed to create user. Please try again.");
        }
      }
    } catch (error) {
      console.error("Error creating/updating user:", error);
      toast("An error occurred. Please try again.");
    } finally {
      setIsLoading(false);
      close();
    }
  };

  return (
    <>
      <Button
        size={edit ? "" : "lg"}
        onClick={open}
        color="primary"
        className="mr-2"
      >
        {edit ? "Edit Driver" : "Add Driver"}
      </Button>

      <Modal
        opened={opened}
        onClose={close}
        title={edit ? "Edit Driver" : "Create New Driver"}
        centered
      >
        <LoadingOverlay visible={isLoading} overlayBlur={2} />

        <TextInput
          label="Name"
          name="firstName"
          placeholder="Name"
          value={form.firstName}
          onChange={handleChange}
          mb={10}
          required
          fullWidth
        />

        <NumberInput
          label="Phone"
          name="phone"
          placeholder="Phone"
          value={form.phone}
          onChange={(value) =>
            setForm((prevForm) => ({ ...prevForm, phone: value }))
          }
          required
          fullWidth
        />

        <TextInput
          label="Address"
          name="companyAddress"
          placeholder="Address"
          value={form.companyAddress}
          onChange={handleChange}
          mb={10}
          required
          fullWidth
        />

        <TextInput
          label="Password"
          name="password"
          placeholder="Password"
          value={form.password}
          onChange={handleChange}
          mb={10}
          required={!edit}
          disabled={edit}
          fullWidth
        />

        <TextInput
          label="Email"
          name="email"
          placeholder="Email"
          value={form.email}
          onChange={handleChange}
          mb={10}
          required={!edit}
          disabled={edit}
          fullWidth
        />

        <Group position="right" mt="md">
          <Button fullWidth color="primary" variant="flat" onClick={close}>
            Close
          </Button>
          <Button fullWidth color="primary" onClick={handleCreateOrUpdate}>
            {edit ? "Update" : "Create"}
          </Button>
        </Group>
      </Modal>
    </>
  );
}
