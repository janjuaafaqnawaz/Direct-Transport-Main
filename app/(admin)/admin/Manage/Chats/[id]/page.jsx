"use client";

import React from "react";
import Chat from "./components/Chat";
import useAdminContext from "@/context/AdminProvider";

export default function Page({ params }) {
  const id = decodeURIComponent(params.id);

  const { allUsers } = useAdminContext();

  const user = allUsers.find((user) => user.email === id);

  if (!id && !user) {
    return <div>User not found</div>;
  }

  return (
    <div>
      {id}

      <Chat id={id} user={user} />
    </div>
  );
}
