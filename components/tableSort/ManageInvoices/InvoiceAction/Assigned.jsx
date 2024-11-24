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
        <Tooltip label="Notes">
          <ActionIcon mx={2} color="yellow" size="xl">
            <Truck />
          </ActionIcon>
        </Tooltip>
      </DialogTrigger>
      <DialogContent className="sm:max-w-[800px]">
        <DialogHeader>
          <DialogTitle>Assign a Driver</DialogTitle>
        </DialogHeader>
        <ScrollArea className="h-[80vh]">
          {" "}
          <div className="space-y-4">
            <div className="flex items-center space-x-2">
              <Label htmlFor="current-driver" className="w-32">
                Current Driver:
              </Label>
              <Input
                id="current-driver"
                value={booking?.driverName || "None"}
                readOnly
                className="max-w-[200px]"
              />
            </div>
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
              <div className="rounded-md border">
                <Table>
                  <TableHeader>
                    <TableRow>
                      <TableHead>Name</TableHead>
                      <TableHead>Email</TableHead>
                      <TableHead>Phone</TableHead>
                      <TableHead>Role</TableHead>
                      <TableHead>Vehicle Details</TableHead>
                      <TableHead>Assign</TableHead>
                    </TableRow>
                  </TableHeader>
                  <TableBody>
                    {filteredDrivers.map((driver) => (
                      <TableRow key={driver?.id}>
                        <TableCell>{driver?.firstName}</TableCell>
                        <TableCell>{driver?.email}</TableCell>
                        <TableCell>{driver?.phone || "N/A"}</TableCell>
                        <TableCell>{driver?.role}</TableCell>
                        <TableCell>{driver?.vehicleDetails || "N/A"}</TableCell>
                        <TableCell>
                          <Button
                            onClick={() => handleAssignDriver(driver)}
                            disabled={isLoading}
                            variant={
                              driver?.firstName === booking?.driverName
                                ? "default"
                                : "outline"
                            }
                            size="sm"
                          >
                            {isLoading ? (
                              <span className="loading loading-spinner loading-xs">
                                Assigned
                              </span>
                            ) : driver?.firstName === booking?.driverName ? (
                              "Assigned"
                            ) : (
                              "Assign"
                            )}
                          </Button>
                        </TableCell>
                      </TableRow>
                    ))}
                  </TableBody>
                </Table>
              </div>
            )}
          </div>
        </ScrollArea>
      </DialogContent>
    </Dialog>
  );
}
