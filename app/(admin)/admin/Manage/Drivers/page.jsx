"use client";

import { useState } from "react";
import { Search } from "lucide-react";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog";
import DriverTable from "./components/Table";
import Create from "./components/Create";
import { Divider } from "@nextui-org/react";

export default function Page() {
  const [filter, setFilter] = useState("");
  const [isDialogOpen, setIsDialogOpen] = useState(false);
  const [selectedUser, setSelectedUser] = useState(null);

  const handleSearchChange = (event) => {
    setFilter(event.target.value);
  };

  return (
    <div className="mx-[3%]  py-10">
      <div className="flex justify-between items-center mb-6">
        <div className="relative w-full max-w-sm">
          <Search className="absolute left-2 top-2.5 h-4 w-4 text-muted-foreground" />
          <Input
            placeholder="Search drivers"
            value={filter}
            onChange={handleSearchChange}
            className="pl-8"
          />
        </div>
        <Dialog open={isDialogOpen} onOpenChange={setIsDialogOpen}>
          <DialogTrigger asChild>
            <Button onClick={() => setSelectedUser(null)}>
              <Search className="mr-2 h-4 w-4" /> Add Driver
            </Button>
          </DialogTrigger>
          <DialogContent>
            <DialogHeader>
              <DialogTitle>
                {selectedUser ? "Modify Driver" : "Create Driver"}
              </DialogTitle>
            </DialogHeader>
            <Create
              edit={!!selectedUser}
              driver={selectedUser}
              onClose={() => setIsDialogOpen(false)}
            />
          </DialogContent>
        </Dialog>
      </div>
      <Divider className="my-6" />
      <DriverTable filter={filter} />
    </div>
  );
}