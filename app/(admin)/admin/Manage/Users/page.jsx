"use client";

import Users from "./components/Users"
import useAdminContext from "@/context/AdminProvider";

export default function Page() {
  const { allUsers } = useAdminContext();

  return (
    <>
      <Users users={allUsers.filter((user) => user.role !== "driver")} />;
    </>
  );
}
