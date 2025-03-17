"use client";

import { ActionIcon, ModalBody, ModalHeader, Tooltip } from "@mantine/core";
import { NoteAddTwoTone } from "@mui/icons-material";
import Body from "./Body";
import Table from "./Table";

import { useDisclosure } from "@mantine/hooks";
import { Modal } from "@mantine/core";

export default function Notes({ booking }) {
  const [opened, { open, close }] = useDisclosure(false);

  return (
    <>
      <Modal size={"xl"} opened={opened} onClose={close} title="Booking Notes">
        <ModalBody>
          {opened && (
            <>
              <Body booking={booking} />
              <Table
                entries={booking.statusEntries}
                booking={booking}
                id={booking.id}
              />
            </>
          )}
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
