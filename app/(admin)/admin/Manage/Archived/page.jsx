"use client";

import { useState, useEffect } from "react";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { Search, Send, Trash2 } from "lucide-react";
import { updateDoc } from "@/api/firebase/functions/upload";
import { deleteUserAcc } from "@/api/firebase/functions/auth";
import sendResetPasswordEmail from "@/api/sendResetPasswordEmail";
import useAdminContext from "@/context/AdminProvider";

export default function Users() {
  const { allArchivedAccounts } = useAdminContext();

  const [searchTerm, setSearchTerm] = useState("");
  const [filteredUsers, setFilteredUsers] = useState(allArchivedAccounts);

  useEffect(() => {
    setFilteredUsers(allArchivedAccounts);
  }, [allArchivedAccounts]);

  const handleSearchChange = (event) => {
    const term = event.target.value;
    setSearchTerm(term);

    const filtered = allArchivedAccounts.filter((user) =>
      user.email.toLowerCase().includes(term.toLowerCase())
    );
    setFilteredUsers(filtered);
  };

  const handleStatusChange = async (value, user) => {
    const changedUser = { ...user, role: value };

    console.log(changedUser);

    await updateDoc("users", user.email, changedUser);
  };

  const handlePassReset = (email, password) => {
    sendResetPasswordEmail(email, password);
  };

  const handleDeleteUser = (email, pass) => {
    deleteUserAcc(email, pass);
  };

  return (
    <div className="  mx-[3%] py-10  ">
      <div className="flex justify-between items-center mb-6">
        <div className="relative w-full max-w-sm">
          <Search className="absolute left-2 top-2.5 h-4 w-4 text-muted-foreground" />
          <Input
            placeholder="Search by email"
            value={searchTerm}
            onChange={handleSearchChange}
            className="pl-8"
          />
        </div>
      </div>

      <div className="rounded-md border">
        <Table>
          <TableHeader>
            <TableRow>
              <TableHead className="w-[50px]">No</TableHead>
              <TableHead>Full Name</TableHead>
              <TableHead>Email</TableHead>
              <TableHead>Reset</TableHead>
              <TableHead>Remove</TableHead>
              <TableHead>Role</TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            {filteredUsers.map((row, index) => {
              const { firstName, email, role, password } = row;
              const roleOptions = [
                { value: "archived", label: "Archived" },
                ...(row?.driverOnly
                  ? [{ value: "driver", label: "Driver" }]
                  : [
                      { value: "admin", label: "Admin" },
                      { value: "user", label: "User" },
                      { value: "business", label: "Business" },
                    ]),
              ];

              return (
                <TableRow key={index}>
                  <TableCell>{index + 1}</TableCell>
                  <TableCell className="font-medium">{firstName}</TableCell>
                  <TableCell>{email}</TableCell>

                  <TableCell>
                    <Button
                      variant="outline"
                      size="sm"
                      onClick={() => handlePassReset(email, password)}
                    >
                      <Send className="mr-2 h-4 w-4" /> Send
                    </Button>
                  </TableCell>
                  <TableCell>
                    <Button
                      variant="destructive"
                      size="sm"
                      onClick={() => handleDeleteUser(email, password)}
                    >
                      <Trash2 className="mr-2 h-4 w-4" /> Delete
                    </Button>
                  </TableCell>

                  <TableCell>
                    <Select
                      value={role}
                      onValueChange={(value) => handleStatusChange(value, row)}
                    >
                      <SelectTrigger className="w-[120px]">
                        <SelectValue placeholder="Select role" />
                      </SelectTrigger>
                      <SelectContent>
                        {roleOptions
                          .filter((acc) => acc !== null)
                          .map((option) => (
                            <SelectItem
                              className="bg-white"
                              key={option.value}
                              value={option.value}
                            >
                              {option.label}
                            </SelectItem>
                          ))}
                      </SelectContent>
                    </Select>
                  </TableCell>
                </TableRow>
              );
            })}
          </TableBody>
        </Table>
      </div>
    </div>
  );
}
