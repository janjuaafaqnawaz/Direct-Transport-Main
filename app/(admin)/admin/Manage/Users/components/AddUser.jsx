"use client";

import React, { useEffect, useState } from "react";
import {
  Box,
  Button,
  Container,
  Grid,
  TextField,
  Select,
  MenuItem,
} from "@mui/material";
import {
  saveUserDataToUserDoc,
  signUpWithEmail,
} from "@/api/firebase/functions/auth";

export default function AddUser({ data }) {
  const [formData, setFormData] = useState({
    firstName: "",
    email: "",
    password: "",
    role: "user",
    companyAddress: "",
    billingEmail: "",
  });
  const [reload, setReload] = useState(null);

  useEffect(() => {
    if (data) {
      setFormData({
        firstName: data.firstName,
        email: data.email,
        billingEmail: data.billingEmail,
        password: data.password,
        role: data.role,
        companyAddress: data?.companyAddress || "",
      });
      console.log(data);
    }
  }, [data]);

  const handleChange = (event) => {
    const { name, value } = event.target;
    setFormData({
      ...formData,
      [name]: value,
    });
  };

  const createUser = async (event) => {
    event.preventDefault();
    try {
      await signUpWithEmail(formData.email, formData.password, formData);
    } catch (error) {
      console.error(error);
    }
  };

  const updateUser = async (event) => {
    event.preventDefault();
    try {
      await saveUserDataToUserDoc(formData.email, formData);
    } catch (error) {
      console.error(error);
    }
  };

  return (
    <>
      <Container component="main" maxWidth="xs">
        <Box
          component="form"
          noValidate
          onSubmit={data ? updateUser : createUser}
          sx={{ mt: 3 }}
        >
          <Grid container spacing={2}>
            <Grid item xs={12}>
              <TextField
                autoComplete="given-name"
                name="firstName"
                required
                fullWidth
                id="firstName"
                label="Company Name" // Adjusted label
                autoFocus
                value={formData.firstName}
                onChange={handleChange}
              />
            </Grid>
            <Grid item xs={12}>
              <TextField
                autoComplete="given-name"
                name="companyAddress"
                required
                fullWidth
                id="companyAddress"
                label="Company Address"
                value={formData?.companyAddress || ""}
                onChange={handleChange}
              />
            </Grid>
            <Grid item xs={12}>
              <TextField
                required
                fullWidth
                id="email"
                label="Email Address"
                name="email"
                autoComplete="email"
                value={formData.email}
                onChange={handleChange}
                disabled={data ? true : false}
              />
            </Grid>
            <Grid item xs={12}>
              <TextField
                fullWidth
                id="billingEmail"
                label="Billing Email Address"
                name="billingEmail"
                autoComplete="billingEmail"
                value={formData.billingEmail}
                onChange={handleChange}
                key={reload}
              />
              <Button
                variant="text"
                onClick={() => {
                  setFormData({ ...formData, billingEmail: "" });
                  setReload(null);
                }}
              >
                Remove Billing Email
              </Button>
            </Grid>
            <Grid item xs={12}>
              <TextField
                required
                fullWidth
                name="password"
                label="Password"
                type="password"
                id="password"
                autoComplete="new-password"
                value={formData.password}
                onChange={handleChange}
                disabled={data ? true : false}
              />
            </Grid>
            <Grid item xs={12}>
              <Select
                label="Role"
                id="role"
                name="role"
                fullWidth
                value={formData.role}
                onChange={handleChange}
              >
                <MenuItem value="admin">Admin</MenuItem>
                <MenuItem value="business">Business</MenuItem>
                <MenuItem value="user">User</MenuItem>
              </Select>
            </Grid>
          </Grid>
          <Button
            type="submit"
            fullWidth
            variant="contained"
            sx={{ mt: 3, mb: 2 }}
          >
            {data ? "Modify User" : "Create User"}
          </Button>
        </Box>
      </Container>
    </>
  );
}
