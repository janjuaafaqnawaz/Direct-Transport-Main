"use client";

import { Container } from "@mantine/core";
import Search from "./components/Search";
import DriverTable from "./components/Table";
import Create from "./components/Create";
import { Divider } from "@nextui-org/react";
import { useState } from "react";

export default function Page() {
  const [filter, setFilter] = useState("");

  return (
    <div className="w-[94vw] ml-[3vw] overflow-x-hidden ">
      <div className="flex mt-20 ">
        <Search handleChange={(value) => setFilter(value.target.value)} />
        <Divider className="mx-4" orientation="vertical" />
        <Create />
      </div>
      <Divider className="my-8" />
      <DriverTable filter={filter} />
    </div>
  );
}
