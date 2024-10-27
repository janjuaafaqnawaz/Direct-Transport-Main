"use client";

import { useDisclosure } from "@mantine/hooks";
import {
  Modal,
  Button,
  ActionIcon,
  Center,
  Tooltip,
  Text,
} from "@mantine/core";
import DeleteRoundedIcon from "@mui/icons-material/DeleteRounded";
import ArchiveRoundedIcon from "@mui/icons-material/ArchiveRounded";
import RestoreRoundedIcon from "@mui/icons-material/RestoreRounded";
import { deleteDocument, updateDoc } from "@/api/firebase/functions/upload";
import { DeleteOutlineRounded } from "@mui/icons-material";
import toast from "react-hot-toast";

export default function DeleteInvoice({ isArchived, id, booking }) {
  const [opened, { open, close }] = useDisclosure(false);

  const handleDeleteOrArchive = async () => {
    try {
      if (isArchived) {
        await deleteDocument("place_bookings", id);
        toast.success("Archived job deleted successfully.");
      } else {
        await updateDoc("place_bookings", id, { ...booking, isArchived: true });
        toast.info("Job archived successfully.");
      }
    } catch (error) {
      console.error("Error updating or deleting document:", error);
      // toast.error("Error occurred while processing your request.");
    } finally {
      close();
    }
  };

  const handleRestore = async () => {
    try {
      await updateDoc("place_bookings", id, { ...booking, isArchived: false });
    } catch (error) {
      console.error("Error restoring document:", error);
    } finally {
      close();
    }
  };

  return (
    <>
      <Modal opened={opened} onClose={close} withCloseButton={false}>
        <Center>
          {isArchived ? (
            <>
              <Text size="lg" weight={500} style={{ marginTop: 10 }}>
                Are you sure you want to delete this archived job?
              </Text>
            </>
          ) : (
            <>
              <Text size="lg" weight={500} style={{ marginTop: 10 }}>
                Are you sure you want to archive this job?
              </Text>
            </>
          )}
        </Center>
        <br />
        {isArchived && (
          <Button
            fullWidth
            variant="light"
            style={{ margin: 5 }}
            color="green"
            radius="md"
            size="xs"
            onClick={handleRestore}
          >
            <RestoreRoundedIcon style={{ marginRight: 5 }} />
            Restore this Job
          </Button>
        )}
        <Button
          fullWidth
          variant="light"
          style={{ margin: 5 }}
          color="red"
          radius="md"
          size="xs"
          onClick={handleDeleteOrArchive}
        >
          <DeleteOutlineRounded style={{ marginRight: 5 }} />
          {isArchived ? "Delete" : "Archive"} this Job
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

      <Tooltip
        label={isArchived ? "Delete Archived Invoice" : "Archive Invoice"}
      >
        <ActionIcon bg="red" onClick={open} size="xl">
          {isArchived ? <DeleteRoundedIcon /> : <ArchiveRoundedIcon />}
        </ActionIcon>
      </Tooltip>
      {isArchived && (
        <Tooltip label={"Restore Invoice"}>
          <ActionIcon mx={2} bg="green" onClick={open} size="xl">
            <RestoreRoundedIcon onClick={open} />
          </ActionIcon>
        </Tooltip>
      )}
    </>
  );
}
