"use client";

import React, { useEffect, useState } from "react";
import { CAP } from "@/components/Index";
import Form from "@/components/review_booking/form";
import { Autocomplete, Container } from "@mantine/core";
import { getUsersEmailAndNames } from "@/api/firebase/functions/fetch";

const initSelectedEmail = {
  email: "",
  admin: false,
  name: "",
};

export default function Page({ params }) {
  const [user, setUser] = useState(null);
  const [emails, setEmails] = useState([]);
  const [selectedEmail, setSelectedEmail] = useState(initSelectedEmail);

  const resetSelectedEmail = () => setSelectedEmail(initSelectedEmail);

  useEffect(() => {
    const user = JSON.parse(localStorage.getItem("userDoc")) || null;
    setUser(user);

    const fetchEmails = async () => {
      const users = await getUsersEmailAndNames();
      // Filter out duplicate names
      const uniqueUsers = users.filter(
        (user, index, self) =>
          index === self.findIndex((u) => u.name === user.name)
      );
      setEmails(uniqueUsers.filter((user) => user.role !== "driver"));
    };
    fetchEmails();
    resetSelectedEmail();
  }, []);

  const handleEmailChange = (value) => {
    const selectedUser = emails.find((email) => email.name === value);
    if (selectedUser) {
      setSelectedEmail({
        ...selectedUser,
        admin: user.role === "admin",
      });
    }
  };

  return (
    <>
      {user && user?.role === "admin" && (
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
        resetSelectedEmail={resetSelectedEmail}
      />
    </>
  );
}
