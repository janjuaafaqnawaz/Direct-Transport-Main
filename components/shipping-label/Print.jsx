import { useDisclosure } from "@mantine/hooks";
import { Modal, Button, Tooltip, ActionIcon } from "@mantine/core";
import ShippingLabel from "./ShippingLabel";
import { Printer } from "lucide-react";

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

export default function Print({ invoice, iconButton }) {
  const [opened, { open, close }] = useDisclosure(false);
  console.log(invoice);

  return (
    <>
      <Modal opened={opened} size={"xl"} onClose={close} title="Print">
        {/* Modal content */}
        {opened && (
          <ShippingLabel
            shipTo={{
              name: invoice?.address?.Destination?.name,
              address1: invoice?.address?.Destination?.label,
              address2: "",
              city: invoice?.address?.Destination?.address?.city,
              postalCode: "", // This seems to be the postcode for Springwood QLD
              country: invoice?.address?.Destination?.address?.country,
            }}
            from={{
              name: invoice?.address?.Origin?.name,
              address1: invoice?.address?.Origin?.label,
              address2: "",
              city: invoice?.pickupSuburb,
              postalCode: "", // Rhodes NSW postcode
              country: "Australia",
            }}
            orderId={invoice?.docId}
            items={invoice?.items}
            shippingDate={invoice?.date}
            remarks={invoice?.deliveryIns || "NO REMARKS"}
          />
        )}
      </Modal>

      {iconButton ? (
        <Tooltip label="Label">
          <ActionIcon mx={1}  onClick={open} size="xl">
            <Printer />
          </ActionIcon>
        </Tooltip>
      ) : (
        <Button variant="Label" onClick={open}>
          <Printer />
          Print
        </Button>
      )}
    </>
  );
}
