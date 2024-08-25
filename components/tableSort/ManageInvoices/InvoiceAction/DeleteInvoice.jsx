"use client";

import { useDisclosure } from "@mantine/hooks";
import { Modal, Button, ActionIcon, Center, Tooltip } from "@mantine/core";
import DeleteRoundedIcon from "@mui/icons-material/DeleteRounded";
import { deleteDocument } from "@/api/firebase/functions/upload";

export default function DeleteInvoice({ id }) {
  const [opened, { open, close }] = useDisclosure(false);

  return (
    <>
      <Modal opened={opened} onClose={close} withCloseButton={false}>
        <Center>Are you sure you want to delete this job?</Center>
        <br />
        <Button
          fullWidth
          variant="light"
          style={{ margin: 5 }}
          color="red"
          radius="md"
          size="xs"
          onClick={async () => {
            try {
              await deleteDocument("place_bookings", id);
            } catch (error) {
              console.error("Error deleting document:", error);
            } finally {
              close();
            }
          }}
        >
          Yes, Delete this Job
        </Button>
        <Button
          fullWidth
          variant="light"
          style={{ margin: 5 }}
          color="teal"
          radius="md"
          size="xs"
          onClick={close}
        >
          No, Go back
        </Button>
      </Modal>

      <Tooltip label="Delete Invoice">
        <ActionIcon bg="red" onClick={open} size="xl">
          <DeleteRoundedIcon />
        </ActionIcon>
      </Tooltip>
    </>
  );
}
