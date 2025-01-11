"use client";

import { useDisclosure } from "@mantine/hooks";
import { Modal, Button, Tooltip, ActionIcon } from "@mantine/core";
import { IdCardIcon } from "lucide-react";
import { useState } from "react";
import FixPrice from "./FixPrice";

export default function FixPriceModal({ booking }) {
  const [opened, { open, close }] = useDisclosure(false);
  const [invoice, setInvoice] = useState(booking);

  return (
    <>
      <Modal size={"xl"} opened={opened} onClose={close} title="Update Price">
        <FixPrice
          booking={invoice}
          setBooking={setInvoice}
          toggleShowPrice={open}
          onClose={close}
        />
      </Modal>

      <Tooltip label="Edit Invoice ">
        <ActionIcon mx={1} onClick={open} size="xl">
          <IdCardIcon />
        </ActionIcon>
      </Tooltip>
    </>
  );
}
