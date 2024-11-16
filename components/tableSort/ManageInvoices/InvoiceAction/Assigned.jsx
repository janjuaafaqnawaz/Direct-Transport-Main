"use client";
import { getFormattedDateStr, getFormattedTime } from "@/api/DateAndTime";
import { updateDoc } from "@/api/firebase/functions/upload";
import { Button, Combobox, useCombobox } from "@mantine/core";
import { useState } from "react";
import NotifyUser from "@/api/NotifyUser";
import useAdminContext from "@/context/AdminProvider";
import {
  removePrevLocation,
  locationSharing,
} from "@/api/firebase/functions/realtime";

export default function App({ booking }) {
  const [isLoading, setIsLoading] = useState(false);
  const { allDrivers, loading } = useAdminContext();

  const handleAssignedEmail = async (email, firstName) => {
    setIsLoading(true);
    try {
      await removePrevLocation(booking?.driverEmail, booking?.docId);
      const updatedBooking = {
        ...booking,
        driverEmail: email,
        driverName: firstName,
        driverAssignedDate: getFormattedDateStr(),
        driverAssignedTime: getFormattedTime(),
      };
      await updateDoc("place_bookings", booking.docId, updatedBooking);
      await locationSharing(email, booking.docId);

      await NotifyUser(
        email,
        `Direct Transport Solution`,
        `New Booking ${booking.docId}`
      );
    } catch (error) {
      console.error("Error assigning booking to driver:", error);
    } finally {
      setIsLoading(false);
    }
  };

  const combobox = useCombobox({
    onDropdownClose: () => combobox.resetSelectedOption(),
  });

  const options = allDrivers.map((driver) => (
    <Combobox.Option
      value={driver.email}
      key={driver.email}
      onClick={() => handleAssignedEmail(driver.email, driver.firstName)}
    >
      {driver.firstName}
    </Combobox.Option>
  ));

  return (
    <>
      <Combobox
        store={combobox}
        onOptionSubmit={(val) => {
          const selectedDriver = allDrivers.find(
            (driver) => driver.email === val
          );
          if (selectedDriver) {
            handleAssignedEmail(selectedDriver.email, selectedDriver.firstName);
          }
          combobox.closeDropdown();
        }}
      >
        <Combobox.Target>
          <Button
            size="compact-md"
            mt={-16}
            w={90}
            h={50}
            loading={isLoading || loading} // Combine the loading states
            style={{ textTransform: "uppercase", fontSize: "12px" }}
            variant="light"
            color="yellow"
            onClick={() => combobox.toggleDropdown()}
          >
            {booking?.driverName || "Select"}
          </Button>
        </Combobox.Target>

        <Combobox.Dropdown>
          <Combobox.Options>{options}</Combobox.Options>
        </Combobox.Dropdown>
      </Combobox>
    </>
  );
}
