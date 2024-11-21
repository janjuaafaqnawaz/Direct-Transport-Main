"use client";

import { useDisclosure } from "@mantine/hooks";
import { Modal, Tooltip } from "@mantine/core";
import { MapIcon } from "lucide-react";
import TrackDriverContent from "./TrackDriverContent";
import { Button } from "@/components/ui/button";

export default function TrackDriver({ email }) {
  const [opened, { open, close }] = useDisclosure(false);

  return (
    <>
      <Modal
        opened={opened}
        onClose={close}
        size="xl"
        title="Driver's Live Location"
      >
        {open && <TrackDriverContent email={email} />}
      </Modal>

      <Tooltip label="Track Driver">
        <Button onClick={open} variant="outline" size="sm" className="mt-1">
          <MapIcon />
        </Button>
      </Tooltip>
    </>
  );
}
