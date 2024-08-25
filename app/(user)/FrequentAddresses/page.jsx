"use client";
import { useEffect, useState } from "react";
import { Typography } from "@mui/material";
import { Button, Modal } from "@mantine/core";
import { useDisclosure } from "@mantine/hooks";
import { CAP, FrequentAddresses, PlacesAutocomplete } from "@/components/Index";
import { fetchFrequentAddresses } from "@/api/firebase/functions/fetch";
import { addFrequentAddress } from "@/api/firebase/functions/upload";
import Loading from "@/components/Loading";
import CustomInput from "@/components/fields/CustomInput";

export default function Page() {
  const [address, setAddress] = useState([]);
  const [newAddress, setNewAddress] = useState({});
  const [isLoading, setIsLoading] = useState(true);
  const [opened, { open, close }] = useDisclosure(false);

  useEffect(() => {
    const fetchData = async () => {
      try {
        const addresses = await fetchFrequentAddresses();
        setAddress(addresses);
        setIsLoading(false);
      } catch (error) {
        console.error("Error fetching addresses:", error);
      }
    };

    fetchData();
  }, []);

  const handleSubmit = async () => {
    const company = {
      ...newAddress,
      label: (newAddress.name ? newAddress.name + "-" : "") + newAddress.label,
    };
    try {
      await addFrequentAddress(company);
      close();
      const updatedAddresses = await fetchFrequentAddresses();
      setAddress(updatedAddresses);
    } catch (error) {
      console.error("Error adding address:", error);
    }
  };

  if (isLoading) {
    return <Loading />;
  }

  return (
    <div
      style={{
        display: "flex",
        justifyContent: "center",
        alignItems: "center",
        width: "97vw",
        flexDirection: "column",
      }}
    >
      <Button onClick={open}>Add Address</Button>

      <Modal opened={opened} onClose={close} title="Write Address">
        <Typography id="modal-modal-title" variant="h6" component="h2">
          Write Your Address
        </Typography>

        <div style={{ height: "50vh" }}>
          <PlacesAutocomplete
            onLocationSelect={(loc) => setNewAddress(loc)}
            width={true}
          />

          <CustomInput
            label="Label"
            value={newAddress.name || ""}
            handleChange={(event) =>
              setNewAddress({
                ...newAddress,
                name: event.currentTarget.value,
              })
            }
          />
        </div>
        <Button onClick={handleSubmit}>Add Address</Button>
      </Modal>

      <FrequentAddresses singleBtn={false} addresses={address} />
    </div>
  );
}
