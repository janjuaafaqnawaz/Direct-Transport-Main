"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import DriverDetailsDialog from "./Overview";
import { Trash2, History, RefreshCw } from "lucide-react";
import { deleteUserAcc } from "@/api/firebase/functions/auth";
import useAdminContext from "@/context/AdminProvider";
import Create from "./Create";

export default function DriverTable({ filter }) {
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
  };

  return (
    <div className="rounded-md border">
      <Table>
        <TableHeader>
          <TableRow>
            <TableHead className="w-[50px]">No</TableHead>
            <TableHead>User Name</TableHead>
            <TableHead>Phone</TableHead>
            <TableHead>Role</TableHead>
            <TableHead>Email</TableHead>
            <TableHead className="text-right">Action</TableHead>
          </TableRow>
        </TableHeader>
        <TableBody>
          {isLoading ? (
            <TableRow>
              <TableCell colSpan={6} className="h-24 text-center">
                <div className="flex justify-center">
                  <svg
                    className="animate-spin h-5 w-5 text-primary"
                    xmlns="http://www.w3.org/2000/svg"
                    fill="none"
                    viewBox="0 0 24 24"
                  >
                    <circle
                      className="opacity-25"
                      cx="12"
                      cy="12"
                      r="10"
                      stroke="currentColor"
                      strokeWidth="4"
                    ></circle>
                    <path
                      className="opacity-75"
                      fill="currentColor"
                      d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"
                    ></path>
                  </svg>
                </div>
              </TableCell>
            </TableRow>
          ) : filteredDrivers.length === 0 ? (
            <TableRow>
              <TableCell colSpan={6} className="h-24 text-center">
                You have no more drivers to show here
              </TableCell>
            </TableRow>
          ) : (
            filteredDrivers.map((driver, index) => (
              <TableRow key={index}>
                <TableCell>
                  <Badge variant="outline">{index + 1}</Badge>
                </TableCell>
                <TableCell className="font-medium">
                  <DriverDetailsDialog driverDetails={driver} />

                  {/* {driver?.firstName} */}
                </TableCell>
                <TableCell>{driver?.phone || "N/A"}</TableCell>
                <TableCell>
                  <Badge variant="secondary" className="bg-gray-700">
                    {driver?.role}
                  </Badge>
                </TableCell>
                <TableCell>{driver?.email}</TableCell>
                <TableCell className="text-right">
                  <Button
                    variant="destructive"
                    size="sm"
                    onClick={() => handleDeleteUser(driver?.email)}
                    className="mr-2"
                  >
                    <Trash2 className="mr-2 h-4 w-4" /> Delete
                  </Button>
                  <Button
                    variant="outline"
                    size="sm"
                    onClick={() =>
                      router.push(`/admin/Manage/Drivers/${driver?.email}`)
                    }
                    className="mr-2"
                  >
                    <History className="mr-2 h-4 w-4" /> History
                  </Button>
                  <Create edit={true} driver={driver} />
                  <Button variant="outline" size="sm">
                    <RefreshCw className="mr-2 h-4 w-4" /> Reset Password
                  </Button>
                </TableCell>
              </TableRow>
            ))
          )}
        </TableBody>
      </Table>
    </div>
  );
}
