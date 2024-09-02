"use client";

import { Refresh } from "@mui/icons-material";
import { Button } from "@nextui-org/react";
import { useEffect } from "react";

export default function Error({
  error,
  reset,
}: {
  error: Error;
  reset: () => void;
}) {
  useEffect(() => {
    // Log the error to an error reporting service
    /* eslint-disable no-console */
    console.error(error);
  }, [error]);

  return (
    <div>
      <h2>Something went wrong!</h2>
      <Button
        color="warning"
        variant="flat"
        startContent={<Refresh />}
        onClick={
          // Attempt to recover by trying to re-render the segment
          () => reset()
        }
      >
        Refreash
      </Button>
    </div>
  );
}
