"use client";

import { useState } from "react";
import { Button } from "@/components/ui/button";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { getFormattedDateStr, getFormattedTime } from "@/api/DateAndTime";
import { updateDoc } from "@/api/firebase/functions/upload";
import NotifyUser from "@/api/NotifyUser";
import useAdminContext from "@/context/AdminProvider";
import {
  removePrevLocation,
  locationSharing,
} from "@/api/firebase/functions/realtime";
import { Search, Truck, UserCheck } from "lucide-react";
import { ActionIcon, ScrollArea, Tooltip } from "@mantine/core";
import { Chip } from "@nextui-org/react";

export default function DriverAssignmentModal({ booking }) {
  const [isOpen, setIsOpen] = useState(false);
  const [isLoading, setIsLoading] = useState(false);
  const [assigningDriverId, setAssigningDriverId] = useState(null);
  const [searchTerm, setSearchTerm] = useState("");

  const { allDrivers, loading } = useAdminContext();

  const handleAssignDriver = async (driver) => {
    setIsLoading(true);
    setAssigningDriverId(driver.id);
    try {
      await removePrevLocation(booking?.driverEmail, booking?.docId);

      const updatedBooking = {
        ...booking,
        driverEmail: driver.email,
        driverName: driver.firstName,
        driverAssignedDate: getFormattedDateStr(),
        driverAssignedTime: getFormattedTime(),

        progressInformation: {
          ...booking.progressInformation,
          Allocated: "Allocated",
        },
        currentStatus: "Allocated",
        isNew: false,
      };

      await updateDoc("place_bookings", booking.docId, updatedBooking);
      await locationSharing(driver.email, booking.docId);

      await NotifyUser(
        driver.email,
        `Direct Transport Solution`,
        `New Booking ${booking.docId}`
      );

      setIsOpen(false);
    } catch (error) {
      console.error("Error assigning booking to driver:", error);
    } finally {
      setIsLoading(false);
      setAssigningDriverId(null);
    }
  };

  const filteredDrivers = allDrivers.filter((driver) =>
    Object.values(driver).some((value) =>
      value.toString().toLowerCase().includes(searchTerm.toLowerCase())
    )
  );

  return (
    <Dialog open={isOpen} onOpenChange={setIsOpen}>
      <DialogTrigger asChild>
        <Tooltip label="Assign New Driver">
          <ActionIcon mx={2} color="yellow" size="xl">
            <Truck />
          </ActionIcon>
        </Tooltip>
      </DialogTrigger>
      <DialogContent className="sm:max-w-[800px]">
        <DialogHeader>
          <DialogTitle>Assign a Driver</DialogTitle>
        </DialogHeader>
        <ScrollArea className="">
          {" "}
          <div className="space-y-4">
            <div className="relative">
              <Search className="absolute left-2 top-2.5 h-4 w-4 text-muted-foreground" />
              <Input
                placeholder="Search drivers..."
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                className="pl-8"
              />
            </div>
            {loading ? (
              <p>Loading drivers...</p>
            ) : filteredDrivers.length === 0 ? (
              <p>No drivers available.</p>
            ) : (
              <div className="rounded-md  ">
                {filteredDrivers.map((driver) => (
                  <Chip
                    className="cursor-pointer m-2"
                    variant={
                      driver?.firstName === booking?.driverName
                        ? "solid"
                        : "flat"
                    }
                    color="primary"
                    size="lg"
                    key={driver?.id}
                    onClick={() => handleAssignDriver(driver)}
                  >
                    {driver?.firstName}
                  </Chip>
                ))}
              </div>
            )}
          </div>
        </ScrollArea>
      </DialogContent>
    </Dialog>
  );
}
