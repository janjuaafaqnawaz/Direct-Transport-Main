"use client";

import { useDisclosure } from "@mantine/hooks";
import { Modal, ActionIcon, Tooltip } from "@mantine/core";
import { MapIcon } from "lucide-react";
import TrackDriverContent from "./TrackDriverContent";

export default function TrackDriver({ booking }) {
  const [opened, { open, close }] = useDisclosure(false);

  return (
    <>
      <Modal
        opened={opened}
        onClose={close}
        size="xl"
        title="Driver's Live Location"
      >
        <TrackDriverContent booking={booking} />
      </Modal>

      <Tooltip label="Track Driver">
        <ActionIcon className="mr-1" bg="red" onClick={open} size="xl">
          <MapIcon />
        </ActionIcon>
      </Tooltip>
    </>
  );
}
