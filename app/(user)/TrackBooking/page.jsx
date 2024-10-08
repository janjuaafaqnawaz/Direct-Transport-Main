"use client";

import { useEffect, useState } from "react";
import { TextField, Grid } from "@mui/material";
import { Button } from "@mantine/core";
import { getBookingsBetweenDates } from "@/api/firebase/functions/fetch";
import { BookingsQuery } from "@/components/Index";
import { DatePickerInput } from "@mantine/dates";
import Link from "next/link";
import { useSearchParams } from "next/navigation";

const styleField = {
  width: "16rem",
};

const containerStyle = {
  marginTop: "1rem",
  display: "flex",
  alignItems: "center",
  justifyContent: "center",
  width: "100%",
};

export default function Page() {
  const searchParams = useSearchParams();
  const [role, setRole] = useState(null);
  const [show, setShow] = useState(false);
  const [bookings, setBookings] = useState([]);
  const [formData, setFormData] = useState({
    fromDate: null,
    toDate: null,
    reference: "",
  });

  useEffect(() => {
    const role =
      (JSON.parse(localStorage.getItem("userDoc")) || {}).role || null;
    setRole(role);

    // Parse URL parameters
    const fromDate = searchParams.get("fromDate");
    const toDate = searchParams.get("toDate");
    const reference = searchParams.get("reference");

    // Update form data with URL parameters
    setFormData({
      fromDate: fromDate ? new Date(fromDate) : null,
      toDate: toDate ? new Date(toDate) : null,
      reference: reference || "",
    });

    // If all parameters are present, automatically submit the query
    if (fromDate && toDate && reference) {
      handleSubmit();
    }
  }, [searchParams]);

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData((prevFormData) => ({ ...prevFormData, [name]: value }));
  };

  const handleSubmit = async () => {
    try {
      const bookings = await getBookingsBetweenDates(
        formData.fromDate,
        formData.toDate,
        formData.reference,
        formData.reference,
        role
      );
      if (!bookings.length) {
        alert("Not Found");
        return;
      }
      setBookings(bookings);
      setShow(true);
    } catch (error) {
      console.error(error);
    }
  };

  return (
    <div style={{ width: "90%", margin: "auto" }}>
      {show ? (
        <BookingsQuery bookings={bookings} />
      ) : (
        <Grid container style={containerStyle}>
          <div
            style={{
              display: "flex",
              flexDirection: "column",
              justifyContent: "center",
              alignItems: "center",
            }}
          >
            <h1>TRACK BOOKINGS</h1>

            <DatePickerInput
              w={255}
              label="From Date"
              placeholder="From Date"
              value={formData.fromDate}
              onChange={(date) => setFormData({ ...formData, fromDate: date })}
              valueFormat="DD MM YYYY"
            />
            <DatePickerInput
              w={255}
              placeholder="To Date"
              label="To Date"
              value={formData.toDate}
              onChange={(date) => setFormData({ ...formData, toDate: date })}
              valueFormat="DD MM YYYY"
            />

            <br />
            <TextField
              style={styleField}
              name="reference"
              label="Job Number"
              placeholder="Job Number"
              variant="outlined"
              value={formData.reference}
              onChange={handleChange}
            />
            <p style={{ color: "ghostwhite" }}>...</p>

            <Button
              onClick={() => handleSubmit()}
              variant="filled"
              color="#1384e1"
              size="lg"
              style={styleField}
            >
              Run Query
            </Button>
            <Link href="/ClientServices" style={{ textDecoration: "none" }}>
              <Button
                style={styleField}
                variant="filled"
                mt={10}
                color="#1384e1"
                size="lg"
              >
                Client Services
              </Button>
            </Link>
          </div>
        </Grid>
      )}
    </div>
  );
}


// http://localhost:3000/TrackBooking?fromDate=2023-06-01&toDate=2023-06-30&reference=JOB123