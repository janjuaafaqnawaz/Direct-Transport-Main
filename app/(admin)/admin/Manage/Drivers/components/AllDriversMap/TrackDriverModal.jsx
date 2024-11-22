"use client";

import { useDisclosure } from "@mantine/hooks";
import { Modal } from "@mantine/core";
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

      <Button onClick={open} className="mr-4" variant={"outline"}>
        Location
      </Button>
    </>
  );
}
