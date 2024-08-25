"use client";
import { deleteUserAcc } from "@/api/firebase/functions/auth";
import {
  Table,
  TableHeader,
  TableColumn,
  TableBody,
  CircularProgress,
  TableCell,
  Button,
  TableRow,
  Chip,
} from "@nextui-org/react";
import { useRouter } from "next/navigation";
import useAdminContext from "@/context/AdminProvider";
import { useState } from "react";
import Create from "./Create";

function DriverTable({ filter }) {
  const router = useRouter();
  const { allDrivers } = useAdminContext();

  const [isLoading, setIsLoading] = useState(false);
  const filterVal = filter.toLowerCase();
  const filteredDrivers =
    filter === ""
      ? allDrivers
      : allDrivers.filter(
          (driver) =>
            driver.firstName.toLowerCase().includes(filterVal) ||
            driver.email.toLowerCase().includes(filterVal)
        );

  const handleDeleteUser = async (email) => {
    const res = await deleteUserAcc(email);
    // if (res) {
    //   setDriver(drivers.filter((driver) => driver.email !== email));
    // }
  };
  const emptyContent = isLoading ? (
    <CircularProgress className="mx-auto" color="warning" />
  ) : (
    <p>You have no more drivers to show here</p>
  );

  return (
    <Table className="w-[90vw]" aria-label="Example static collection table">
      <TableHeader>
        <TableColumn>No</TableColumn>
        <TableColumn>User Name</TableColumn>
        <TableColumn>Phone</TableColumn>
        <TableColumn>Role</TableColumn>
        <TableColumn>Email</TableColumn>
        <TableColumn>Action</TableColumn>
      </TableHeader>
      <TableBody emptyContent={emptyContent}>
        {filteredDrivers.length > 0 &&
          filteredDrivers.map((driver, index) => (
            <TableRow key={index}>
              <TableCell className="capitalize text-gray-700">
                <Chip> {index + 1}</Chip>
              </TableCell>
              <TableCell className="w-[12%] capitalize text-gray-700">
                {driver?.firstName}
              </TableCell>
              <TableCell className="w-[14%] capitalize text-gray-700">
                {driver?.phone || ""}
              </TableCell>
              <TableCell className="w-[12%] capitalize text-gray-700">
                {driver?.role}
              </TableCell>
              <TableCell className="w-[15%] text-gray-500 ">
                {driver?.email}
              </TableCell>
              <TableCell className="w-[45%] ">
                <Button
                  className=" mr-4"
                  onClick={() => handleDeleteUser(driver?.email)}
                  variant="solid"
                  color="danger"
                >
                  Delete
                </Button>
                <Button
                  className=" mr-4"
                  onClick={() => router.push(`/admin/drivers/${driver?.email}`)}
                  variant="solid"
                  color="primary"
                >
                  History
                </Button>
                <Create edit={true} driver={driver} />
                <Button className="w-40" variant="solid" color="primary">
                  Reset Password Link
                </Button>
              </TableCell>
            </TableRow>
          ))}
      </TableBody>
    </Table>
  );
}

export default DriverTable;
