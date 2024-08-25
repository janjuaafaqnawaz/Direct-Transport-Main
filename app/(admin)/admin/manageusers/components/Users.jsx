"use client";
import { useEffect, useState } from "react";
import { TextField, InputAdornment, MenuItem, Select } from "@mui/material";
import SearchIcon from "@mui/icons-material/Search";
import CustomPrice from "./Pricing";
import { Button, Modal } from "@mantine/core";
import { updateDoc } from "@/api/firebase/functions/upload";
import { useDisclosure } from "@mantine/hooks";
import AddUser from "./AddUser";
import { deleteUserAcc } from "@/api/firebase/functions/auth";
import sendResetPasswordEmail from "@/api/sendResetPasswordEmail";
import {
  Chip,
  Table,
  TableBody,
  TableCell,
  TableColumn,
  TableHeader,
  TableRow,
  Button as NextButton,
  Switch,
} from "@nextui-org/react";

const roleOptions = [
  { value: "admin", label: "Admin" },
  { value: "business", label: "Business" },
  { value: "user", label: "User" },
];

export default function Users({ users }) {
  const [opened, { open, close }] = useDisclosure(false);
  const [searchTerm, setSearchTerm] = useState("");
  const [filteredUsers, setFilteredUsers] = useState(users);
  const [selectedUser, setSelectedUser] = useState({});

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

  const handleStatusChange = async (event, index) => {
    const selectedRole = event.target.value;

    const updatedUsers = [...filteredUsers];
    const changedUser = updatedUsers[index];
    changedUser.role = selectedRole;
    setFilteredUsers(updatedUsers);

    await updateDoc("users", changedUser.email, changedUser);
  };

  const handlePassReset = (email, password) => {
    sendResetPasswordEmail(email, password);
  };

  const handleDeleteUser = (email, pass) => {
    deleteUserAcc(email, pass);
  };

  return (
    <div style={{ width: "80%", margin: "2rem auto" }}>
      <Modal
        opened={opened}
        onClose={close}
        title={selectedUser ? "Modify User" : "Create User"}
      >
        <AddUser data={selectedUser} />
      </Modal>

      {/* Styled Search Bar */}
      <div className="w-full flex  items-center justify-around">
        <TextField
          fullWidth
          variant="outlined"
          label="Search by Email"
          value={searchTerm}
          onChange={handleSearchChange}
          style={{ margin: "1rem 0", width: "80%" }}
          InputProps={{
            startAdornment: (
              <InputAdornment position="start">
                <SearchIcon />
              </InputAdornment>
            ),
          }}
        />
        <NextButton
          variant="shadow"
          color="secondary"
          size="lg"
          fullWidth
          className="max-w-40 ml-2"
          onClick={(e) => {
            open(), setSelectedUser(false);
          }}
        >
          Add User
        </NextButton>
      </div>
      <Table>
        <TableHeader>
          <TableColumn>No</TableColumn>
          <TableColumn>Full</TableColumn>
          <TableColumn>Email</TableColumn>
          <TableColumn>Price Switch</TableColumn>
          <TableColumn>Pricing</TableColumn>
          <TableColumn>Reset</TableColumn>
          <TableColumn>Remove</TableColumn>
          <TableColumn>Role</TableColumn>
          <TableColumn>Action</TableColumn>
        </TableHeader>
        <TableBody>
          {filteredUsers &&
            filteredUsers.map((row, index) => {
              const { firstName, email, role, password } = row;
              const handleToggle = async (val) =>
                await updateDoc("users", row.email, { ...row, usePrice: val });

              return (
                <TableRow key={index + 1}>
                  <TableCell>{index + 1}</TableCell>
                  <TableCell className="capitalize">{`${firstName}`}</TableCell>
                  <TableCell>{email}</TableCell>
                  <TableCell>
                    <Switch
                      isSelected={row?.usePrice}
                      onValueChange={handleToggle}
                    />
                  </TableCell>
                  <TableCell>
                    <CustomPrice user={row} />
                  </TableCell>
                  <TableCell>
                    <Button
                      variant="filled"
                      color="#1384e1"
                      onClick={() => handlePassReset(email, password)}
                    >
                      Send
                    </Button>
                  </TableCell>
                  <TableCell>
                    <Button
                      variant="filled"
                      color="#1384e1"
                      onClick={() => handleDeleteUser(email, password)}
                    >
                      Delete User
                    </Button>
                  </TableCell>
                  <TableCell>
                    <Select
                      value={role}
                      onChange={(event) => handleStatusChange(event, index)}
                      style={{
                        width: "100%",
                        height: 36,
                        backgroundColor: "#339af0",
                        borderRadius: 4,
                        color: "#fff",
                      }}
                    >
                      {roleOptions.map((option) => (
                        <MenuItem
                          key={option.value}
                          style={{
                            backgroundColor: "#339af0",
                            padding: 15,
                            color: "#fff",
                            borderRadius: 10,
                            margin: 5,
                          }}
                          value={option.value}
                        >
                          {option.label}
                        </MenuItem>
                      ))}
                    </Select>
                  </TableCell>
                  <TableCell>
                    <Button
                      onClick={(e) => {
                        setSelectedUser(row);
                        open();
                      }}
                    >
                      Action
                    </Button>
                  </TableCell>
                </TableRow>
              );
            })}
        </TableBody>
      </Table>
    </div>
  );
}
