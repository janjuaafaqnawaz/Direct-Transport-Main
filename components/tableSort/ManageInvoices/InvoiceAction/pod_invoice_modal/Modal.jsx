"use client";

import POD from "./POD";
import QrCodeScannerRoundedIcon from "@mui/icons-material/QrCodeScannerRounded";
import { useEffect, useState } from "react";
import { fetchDocById } from "@/api/firebase/functions/fetch";
import {
  Modal,
  ModalContent,
  ModalHeader,
  ModalBody,
  ModalFooter,
  Button,
  useDisclosure,
} from "@nextui-org/react";
import { ActionIcon, Tooltip } from "@mantine/core";

export default function InvoicePOD({ id }) {
  const [booking, setBooking] = useState([]);
  const { isOpen, onOpen, onOpenChange } = useDisclosure();

  useEffect(() => {
    const fetchInvoice = async () => {
      if (id) {
        const data = await fetchDocById(id, "place_bookings");
        setBooking(data);
      }
    };

    fetchInvoice();
  }, [id]);

  return (
    <>
      <Tooltip label="New POD">
        <ActionIcon mx={1} onClick={onOpen} size="xl">
          <QrCodeScannerRoundedIcon />
        </ActionIcon>
      </Tooltip>

      <Modal
        scrollBehavior="outside"
        size="2xl"
        isOpen={isOpen}
        onOpenChange={onOpenChange}
      >
        <ModalContent>
          {(onClose) => (
            <>
              <ModalHeader className="flex flex-col gap-1">POD</ModalHeader>
              <ModalBody>
                <POD booking={booking} close={onClose} />
              </ModalBody>
            </>
          )}
        </ModalContent>
      </Modal>
    </>
  );
}
