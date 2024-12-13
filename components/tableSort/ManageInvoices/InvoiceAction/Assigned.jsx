"use client";

import { useState } from "react";
import {
  Modal,
  Button,
  TextInput,
  ActionIcon,
  ScrollArea,
  Tooltip,
} from "@mantine/core";
import { Search, Truck } from "lucide-react";
import { Chip } from "@nextui-org/react";
import toast from "react-hot-toast";
import { getFormattedDateStr, getFormattedTime } from "@/api/DateAndTime";
import { updateDoc } from "@/api/firebase/functions/upload";
import useAdminContext from "@/context/AdminProvider";
import {
  removePrevLocation,
  locationSharing,
} from "@/api/firebase/functions/realtime";
import { newAssignedBookingNotification } from "@/server/sendNotification";

export default function DriverAssignmentModal({ booking }) {
  const [isOpen, setIsOpen] = useState(false);
  const [searchTerm, setSearchTerm] = useState("");

  const { allDrivers, loading } = useAdminContext();

  const handleAssignDriver = async (driver) => {
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

      setIsOpen(false);
      toast.success("Driver assigned successfully!");
    } catch (error) {
      console.error("Error assigning booking to driver:", error);
      toast.error("Failed to assign driver. Please try again.");
    }
  };

  // Filter drivers based on the search term
  const filteredDrivers = allDrivers.filter((driver) =>
    Object.values(driver)
      .filter((value) => typeof value === "string")
      .some((value) => value.toLowerCase().includes(searchTerm.toLowerCase()))
  );

  return (
    <>
      <Tooltip label="Assign New Driver">
        <ActionIcon
          mx={2}
          color="yellow"
          size="xl"
          aria-label="Assign Driver"
          onClick={() => setIsOpen(true)}
        >
          <Truck />
        </ActionIcon>
      </Tooltip>

      <Modal
        opened={isOpen}
        onClose={() => setIsOpen(false)}
        title="Assign a Driver"
        size="lg"
        centered
      >
        <ScrollArea>
          <div className="space-y-4">
            {/* Search Input */}
            <div className="relative">
              <TextInput
                icon={<Search />}
                placeholder="Search drivers..."
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
              />
            </div>

            {/* Driver List */}
            {loading ? (
              <p>Loading drivers...</p>
            ) : filteredDrivers.length === 0 ? (
              <p>No drivers available.</p>
            ) : (
              <div className="rounded-md">
                {filteredDrivers.map((driver) => (
                  <>
                    {isOpen && (
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
                        onClick={() => {
                          newAssignedBookingNotification(driver?.expoPushToken);
                          handleAssignDriver(driver);
                        }}
                      >
                        {driver?.firstName}
                      </Chip>
                    )}
                  </>
                ))}
              </div>
            )}
          </div>
        </ScrollArea>
      </Modal>
    </>
  );
}
