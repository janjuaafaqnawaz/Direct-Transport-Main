import { useDisclosure } from "@mantine/hooks";
import { Modal, Button } from "@mantine/core";
import ShippingLabel from "./ShippingLabel";

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

export default function Print({ invoice }) {
  const [opened, { open, close }] = useDisclosure(false);
  console.log(invoice);

  return (
    <>
      <Modal opened={opened} size={"xl"} onClose={close} title="Print">
        {/* Modal content */}
        <ShippingLabel
          shipTo={{
            name: invoice.address.Destination.name,
            address1: invoice.address.Destination.label,
            address2: "",
            city: invoice.address.Destination.address.city,
            postalCode: "4127", // This seems to be the postcode for Springwood QLD
            country: invoice.address.Destination.address.country,
          }}
          from={{
            name: invoice.address.Origin.name,
            address1: invoice.address.Origin.label,
            address2: "",
            city: invoice.pickupSuburb,
            postalCode: "2138", // Rhodes NSW postcode
            country: "Australia",
          }}
          orderId={invoice.docId}
          weight={`${invoice.items[0].weight} KG`}
          dimensions={`${invoice.items[0].length}cm x ${invoice.items[0].width}cm x ${invoice.items[0].height}cm`}
          shippingDate={invoice.date}
          remarks={invoice.deliveryIns || "NO REMARKS"}
        />
      </Modal>

      <Button variant="default" onClick={open}>
        Print
      </Button>
    </>
  );
}
