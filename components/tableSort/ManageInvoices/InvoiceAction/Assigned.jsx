"use client";
import { getFormattedDateStr, getFormattedTime } from "@/api/DateAndTime";
import { getDrivers } from "@/api/firebase/functions/fetch";
import { updateDoc } from "@/api/firebase/functions/upload";
import { ActionIcon } from "@mantine/core";
import { DriveEta } from "@mui/icons-material";
import {
  Modal,
  ModalContent,
  ModalHeader,
  ModalBody,
  ModalFooter,
  Button,
  useDisclosure,
  Table,
  TableHeader,
  TableBody,
  TableColumn,
  TableRow,
  TableCell,
} from "@nextui-org/react";
import { useEffect, useState } from "react";
import NotifyUser from "@/api/NotifyUser";

export default function App({ booking }) {
  const { isOpen, onOpen, onOpenChange, onClose } = useDisclosure();
  const [isLoading, setIsLoading] = useState(true);
  const [drivers, setDrivers] = useState([]);

  useEffect(() => {
    const fetchDrivers = async () => {
      try {
        const fetchedDrivers = await getDrivers();
        setDrivers(fetchedDrivers);
      } catch (error) {
        console.error("Error fetching drivers:", error);
      } finally {
        setIsLoading(false);
      }
    };

    fetchDrivers();
  }, []);

  const handleAssignedEmail = async (email, firstName) => {
    try {
      const updatedBooking = {
        ...booking,
        driverEmail: email,
        driverName: firstName,
        driverAssignedDate: getFormattedDateStr(),
        driverAssignedTime: getFormattedTime(),
      };
      await updateDoc("place_bookings", booking.docId, updatedBooking);

      await NotifyUser(
        email,
        `Direct Transport Solution`,
        `New Booking ${booking.docId}`
      );

      onClose();
    } catch (error) {
      console.error("Error assigning booking to driver:", error);
    }
  };

  return (
    <>
      <ActionIcon mx={1} bg={"lime"} onClick={onOpen} size="xl">
        <DriveEta />
      </ActionIcon>
      <Modal size="4xl" isOpen={isOpen} onOpenChange={onOpenChange}>
        <ModalContent>
          {(onClose) => (
            <>
              <ModalHeader className="flex flex-col gap-1">
                {booking?.driverEmail
                  ? "Booking assigned to the driver:" +
                    " " +
                    booking.driverEmail
                  : "Assign this booking to riders"}
              </ModalHeader>
              <ModalBody>
                <p>
                  Assigned to {booking?.driverName} on {""}
                  {booking?.driverAssignedDate || "-"}
                  {"-"}
                  {booking?.driverAssignedTime || "-"}
                </p>
                <Table aria-label="Example static collection table">
                  <TableHeader>
                    <TableColumn>Name</TableColumn>
                    <TableColumn>Email</TableColumn>
                    <TableColumn>Phone</TableColumn>
                    <TableColumn>Address</TableColumn>
                    <TableColumn>Assign</TableColumn>
                  </TableHeader>
                  <TableBody emptyContent={"No drivers available"}>
                    {drivers.length > 0
                      ? drivers.map(
                          (
                            { firstName, email, phone, companyAddress },
                            index
                          ) => (
                            <TableRow key={index}>
                              <TableCell className="text-gray-500 text-sm w-32">
                                {firstName}
                              </TableCell>
                              <TableCell className=" text-gray-700">
                                {email}
                              </TableCell>
                              <TableCell className="text-gray-500 text-sm w-60">
                                {phone || ""}
                              </TableCell>
                              <TableCell className="text-gray-500 w-80 text-sm">
                                {companyAddress || ""}
                              </TableCell>
                              <TableCell className="text-gray-500 text-sm">
                                <Button
                                  onClick={() =>
                                    handleAssignedEmail(email, firstName)
                                  }
                                  color="primary"
                                  fullWidth
                                  isLoading={isLoading}
                                  variant={
                                    email === booking?.driverEmail
                                      ? "flat"
                                      : "solid"
                                  }
                                >
                                  {email === booking?.driverEmail
                                    ? "Assigned"
                                    : "Assign"}
                                </Button>
                              </TableCell>
                            </TableRow>
                          )
                        )
                      : null}
                  </TableBody>
                </Table>
              </ModalBody>
              <ModalFooter>
                <Button color="danger" variant="light" onPress={onClose}>
                  Close
                </Button>
              </ModalFooter>
            </>
          )}
        </ModalContent>
      </Modal>
    </>
  );
}
