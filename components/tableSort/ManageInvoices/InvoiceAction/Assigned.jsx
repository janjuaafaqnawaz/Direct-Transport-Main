"use client";

import { useState } from "react";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog";
import { Input } from "@/components/ui/input";
import { getFormattedDateStr, getFormattedTime } from "@/api/DateAndTime";
import { updateDoc } from "@/api/firebase/functions/upload";
import useAdminContext from "@/context/AdminProvider";
import {
  removePrevLocation,
  locationSharing,
} from "@/api/firebase/functions/realtime";
import { Search, Truck, UserCheck } from "lucide-react";
import { ActionIcon, ScrollArea, Tooltip } from "@mantine/core";
import { Chip } from "@nextui-org/react";
import toast from "react-hot-toast";
import sendNotification from "@/server/sendNotification";

export default function DriverAssignmentModal({ booking }) {
  const [isOpen, setIsOpen] = useState(false);
  const [isLoading, setIsLoading] = useState(false);
  const [searchTerm, setSearchTerm] = useState("");

  const { allDrivers, loading } = useAdminContext();

  const handleAssignDriver = async (driver) => {
    setIsLoading(true);
    try {
      await removePrevLocation(booking?.driverEmail, booking?.docId);

      const updatedBooking = {
        ...booking,
        driverEmail: driver.email,
        driverName: driver.firstName,
        expoPushToken: driver?.expoPushToken || null,
        driverAssignedDate: getFormattedDateStr(),
        driverAssignedTime: getFormattedTime(),

        progressInformation: {
          ...booking.progressInformation,
          Allocated: "Allocated",
        },
        currentStatus: "Allocated",
        isNew: false,
      };

      if (driver.expoPushToken) {
        await sendNotification(driver.expoPushToken);
      } else {
        console.log("Driver Device not registered for push notifications.");
      }

      await updateDoc("place_bookings", booking.docId, updatedBooking);
      await locationSharing(driver.email, booking.docId);

      setIsOpen(false);
    } catch (error) {
      console.error("Error assigning booking to driver:", error);
    } finally {
      setIsLoading(false);
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
