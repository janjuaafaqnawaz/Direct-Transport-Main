"use client";

import { useDisclosure } from "@mantine/hooks";
import { Modal, ActionIcon, Tooltip } from "@mantine/core";
import { Map, MapIcon } from "lucide-react";
import TrackDriverContent from "./TrackDriverContent";
import { Button } from "@/components/ui/button";

export default function TrackDriver({ booking, customBtn }) {
  const [opened, { open, close }] = useDisclosure(false);

  return (
    <>
      <Modal opened={opened} onClose={close} size="xl">
        {open && <TrackDriverContent booking={booking} />}
      </Modal>
      {!customBtn ? (
        <Tooltip label="Track Driver">
          <ActionIcon className="mr-1" bg="red" onClick={open} size="xl">
            <MapIcon />
          </ActionIcon>
        </Tooltip>
      ) : (
        <Button variant="outline" size="sm" onClick={open}>
          <Map className="mr-2 h-4 w-4" />
          Track
        </Button>
      )}
    </>
  );
}
