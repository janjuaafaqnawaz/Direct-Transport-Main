"use client";

import React, { useEffect, useState } from "react";
import Form from "@/components/review_booking/form";
import { Autocomplete, Container } from "@mantine/core";
import { getUsersEmailAndNames } from "@/api/firebase/functions/fetch";
import { verifyAuth } from "@/api/firebase/functions/auth";

const initSelectedEmail = {
  email: "",
  admin: false,
  name: "",
};

export default function Page({ params }) {
  const [user, setUser] = useState(null);
  const [emails, setEmails] = useState([]);
  const [selectedEmail, setSelectedEmail] = useState(initSelectedEmail);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    const fetchData = async () => {
      try {
        const userData = await verifyAuth();
        setUser(userData);

        const users = await getUsersEmailAndNames();
        // Filter out duplicate names and non-driver roles
        const uniqueUsers = users.filter(
          (user, index, self) =>
            index === self.findIndex((u) => u.name === user.name)
        );
        setEmails(uniqueUsers.filter((user) => user.role !== "driver"));
      } catch (err) {
        setError("Failed to fetch data");
        console.error(err);
      } finally {
        setLoading(false);
      }
    };

    fetchData();
  }, []);

  const handleEmailChange = (value) => {
    if (!user) return;

    const selectedUser = emails.find((email) => email.name === value);
    if (selectedUser) {
      setSelectedEmail({
        ...selectedUser,
        admin: user.role === "admin",
      });
    }
  };

  if (loading) return <div>Loading...</div>;
  if (error) return <div>Error: {error}</div>;

  return (
    <>
      {user?.role === "admin" && (
        <Container size="xs" my={50}>
          <Autocomplete
            label="Create booking"
            placeholder="Select by Company names"
            data={emails.map((user) => user.name)}
            maxDropdownHeight={200}
            onChange={handleEmailChange}
          />
        </Container>
      )}
      <Form
        type={params.type}
        edit={true}
        selectedEmail={selectedEmail}
        resetSelectedEmail={() => setSelectedEmail(initSelectedEmail)}
      />
    </>
  );
}
