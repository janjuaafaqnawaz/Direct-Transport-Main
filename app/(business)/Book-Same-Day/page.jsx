"use client";

import React, { useEffect, useState } from "react";
import { CAP } from "@/components/Index";
import Form from "@/components/review_booking/form";
import { Autocomplete, Container } from "@mantine/core";
import { getUsersEmailAndNames } from "@/api/firebase/functions/fetch";

export default function Page() {
  const [user, setUser] = useState(null);
  const [emails, setEmails] = useState([]);
  const [selectedEmail, setSelectedEmail] = useState({
    email: "",
    admin: false,
    name: "",
  });

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
      setEmails(uniqueUsers);
    };
    fetchEmails();
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
      <Form edit={true} selectedEmail={selectedEmail} />
    </>
  );
}
