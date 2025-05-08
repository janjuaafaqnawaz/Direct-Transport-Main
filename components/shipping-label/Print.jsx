import { useDisclosure } from "@mantine/hooks";
import { Modal, Button } from "@mantine/core";
import ShippingLabel from "./ShippingLabel";

export default function Print() {
  const [opened, { open, close }] = useDisclosure(false);

  return (
    <>
      <Modal opened={opened} size={"xl"} onClose={close} title="Print">
        {/* Modal content */}
        <ShippingLabel {...shippingData} />
      </Modal>

      <Button variant="default" onClick={open}>
        Print
      </Button>
    </>
  );
}

const shippingData = {
  shipTo: {
    name: "John Doe",
    address1: "123 Main Street",
    address2: "Apt 4B",
    city: "New York",
    postalCode: "10001",
    country: "USA",
  },
  from: {
    name: "ACME Corporation",
    address1: "456 Industrial Blvd",
    address2: "",
    city: "Los Angeles",
    postalCode: "90001",
    country: "USA",
  },
  orderId: "123456789",
  weight: "2.5 KG",
  dimensions: "12cmx12cmx12cm",
  shippingDate: "2024-08-31",
  remarks: "NO REMARKS",
};
