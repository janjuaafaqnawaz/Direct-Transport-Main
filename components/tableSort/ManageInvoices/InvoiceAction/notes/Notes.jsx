"use client";

import { ActionIcon, ModalBody, ModalHeader, Tooltip } from "@mantine/core";
import { NoteAddTwoTone } from "@mui/icons-material";
import Body from "./Body";

import { useDisclosure } from "@mantine/hooks";
import { Modal } from "@mantine/core";

export default function Notes({ booking }) {
  const [opened, { open, close }] = useDisclosure(false);

  return (
    <>
      <Modal size={"xl"} opened={opened} onClose={close} title="Booking Notes">
        <ModalBody>
          <Body booking={booking} />
        </ModalBody>
      </Modal>
      <Tooltip label="Notes">
        <ActionIcon mx={1} onClick={open} size="xl">
          <NoteAddTwoTone />
        </ActionIcon>
      </Tooltip>
    </>
  );
}