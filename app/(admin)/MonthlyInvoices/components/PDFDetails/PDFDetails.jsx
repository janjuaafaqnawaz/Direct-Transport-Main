"use client";

import useAdminContext from "@/context/AdminProvider";
import { Container } from "@mantine/core";
import { User } from "@nextui-org/react";
import React, { useState } from "react";
import DatePick from "./DatePick";
import History from "./History";
import CreatePdf from "./CreatePdf";

export default function PDFDetails({ email }) {
  const [datesRange, setDatesRange] = useState({});
  const { allUsers } = useAdminContext();

  const user = allUsers.find(
    (user) => user.email.toLowerCase() === email.toLowerCase()
  );

  if (!user) {
    console.log("User not found");
    return null;
  }

  return (
    <Container size={"md"} className="flex flex-col content-center mt-32 gap-6">
      <User
        name={user.firstName}
        description={user.email}
        avatarProps={{
          src: "",
        }}
        className="mr-auto"
      />
      <DatePick handleDatesRange={(date) => setDatesRange(date)} />

      <CreatePdf datesRange={datesRange} user={user} />

      <History email={email} />
    </Container>
  );
}
