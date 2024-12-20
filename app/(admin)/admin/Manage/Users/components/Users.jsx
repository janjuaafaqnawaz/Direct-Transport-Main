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
import { Switch } from "@/components/ui/switch";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog";
import { Search, UserPlus, Send, Trash2, Edit, Archive } from "lucide-react";
import { updateDoc } from "@/api/firebase/functions/upload";
import { deleteUserAcc } from "@/api/firebase/functions/auth";
import sendResetPasswordEmail from "@/api/sendResetPasswordEmail";
import AddUser from "./AddUser";
import CustomPrice from "./Pricing";
import Link from "next/link";
import toast from "react-hot-toast";
const roleOptions = [
  { value: "admin", label: "Admin" },
  { value: "business", label: "Business" },
  { value: "user", label: "User" },
  { value: "archived", label: "Archived" },
];

export default function Users({ users }) {
  const [searchTerm, setSearchTerm] = useState("");
  const [filteredUsers, setFilteredUsers] = useState(users);
  const [selectedUser, setSelectedUser] = useState(null);
  const [isDialogOpen, setIsDialogOpen] = useState(false);

  useEffect(() => {
    setFilteredUsers(users);
  }, [users]);

  const handleSearchChange = (event) => {
    const term = event.target.value;
    setSearchTerm(term);

    const filtered = users.filter((user) =>
      user.email.toLowerCase().includes(term.toLowerCase())
    );
    setFilteredUsers(filtered);
  };

  const handleStatusChange = async (value, index) => {
    const updatedUsers = [...filteredUsers];
    const changedUser = updatedUsers[index];
    changedUser.role = value;
    setFilteredUsers(updatedUsers);

    await updateDoc("users", changedUser.email, changedUser);
  };

  const handlePassReset = (email, password) => {
    sendResetPasswordEmail(email, password);
  };

  const handleArchiveUser = async (row) => {
    await updateDoc("users", row.email, { ...row, role: "archived" });
    toast.success("User archived successfully");
  };

  const handleSaveChange = async (data) =>
    await updateDoc("users", data.email, data);

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
        <div>
          <Link className="mr-4" href={"/admin/Manage/Archived"}>
            <Button>Archived</Button>
          </Link>
          <Dialog open={isDialogOpen} onOpenChange={setIsDialogOpen}>
            <DialogTrigger asChild>
              <Button onClick={() => setSelectedUser(null)}>
                <UserPlus className="mr-2 h-4 w-4" /> Add User
              </Button>
            </DialogTrigger>
            <DialogContent>
              <DialogHeader>
                <DialogTitle>
                  {selectedUser ? "Modify User" : "Create User"}
                </DialogTitle>
              </DialogHeader>
              <AddUser
                data={selectedUser}
                onClose={() => setIsDialogOpen(false)}
              />
            </DialogContent>
          </Dialog>
        </div>
      </div>

      <div className="rounded-md border">
        <Table>
          <TableHeader>
            <TableRow>
              <TableHead className="w-[50px]">No</TableHead>
              <TableHead>Full Name</TableHead>
              <TableHead>Email</TableHead>
              <TableHead>Price Switch</TableHead>
              {/* <TableHead>Track Location</TableHead> */}
              <TableHead>Pricing</TableHead>
              <TableHead>Role</TableHead>
              <TableHead>Reset</TableHead>
              <TableHead>Remove</TableHead>
              <TableHead>Action</TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            {filteredUsers.map((row, index) => {
              const { firstName, email, role, password } = row;
              const handleToggle = async (val) =>
                await updateDoc("users", row.email, { ...row, usePrice: val });

              const toggleTracking = () => {
                console.log("Toggle tracking for user:", row.email);

                handleSaveChange({
                  ...row,
                  tracking: row?.tracking === undefined ? true : !row?.tracking,
                });
              };

              return (
                <TableRow key={index}>
                  <TableCell>{index + 1}</TableCell>
                  <TableCell className="font-medium">{firstName}</TableCell>
                  <TableCell>{email}</TableCell>
                  <TableCell>
                    <Switch
                      className="bg-slate-300"
                      checked={row?.usePrice}
                      onCheckedChange={handleToggle}
                    />
                  </TableCell>

                  {/* <TableCell>
                    <Switch
                      className="bg-slate-300"
                      checked={row?.tracking}
                      onCheckedChange={toggleTracking}
                    />
                  </TableCell> */}

                  <TableCell>
                    <CustomPrice user={row} />
                  </TableCell>
                  <TableCell>
                    <Select
                      value={role}
                      onValueChange={(value) =>
                        handleStatusChange(value, index)
                      }
                    >
                      <SelectTrigger className="w-[120px]">
                        <SelectValue placeholder="Select role" />
                      </SelectTrigger>
                      <SelectContent>
                        {roleOptions.map((option) => (
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
                      variant="outline"
                      size="sm"
                      onClick={() => handleArchiveUser(row)}
                    >
                      <Archive className="mr-2 h-4 w-4" />
                      Archive
                    </Button>
                  </TableCell>

                  <TableCell>
                    <Button
                      variant="outline"
                      size="sm"
                      onClick={() => {
                        setSelectedUser(row);
                        setIsDialogOpen(true);
                      }}
                    >
                      <Edit className="mr-2 h-4 w-4" /> Edit
                    </Button>
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
