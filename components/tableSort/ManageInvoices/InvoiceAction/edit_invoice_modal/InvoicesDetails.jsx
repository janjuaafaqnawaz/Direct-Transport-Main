/* eslint-disable react-hooks/exhaustive-deps */
"use client";

import { useEffect, useState } from "react";
import {
  Card,
  Text,
  Group,
  Title,
  Badge,
  Divider,
  TextInput,
  Stack,
} from "@mantine/core";
import "tailwindcss/tailwind.css";
import ItemDimensions from "@/components/ItemDimensions";
import { formatDate, formatTime } from "@/api/DateAndTime/format";
import DateTime from "@/components/fields/DateTime";
import { Button, Chip } from "@nextui-org/react";
import { updateDoc } from "@/api/firebase/functions/upload";
import PdfButton from "@/components/PdfButton";

export default function InvoicesDetails({ invoice, admin, onClose }) {
  const [isLoading, setIsLoading] = useState(false);
  const [formData, setFormData] = useState({
    contact: invoice?.contact || "",
    userEmail: invoice?.userEmail || "",
    userName: invoice?.userName || "",
    service: invoice?.service || "",
    date: invoice?.date || "",
    time: invoice?.time || "",
    address: invoice?.address || "",
    deliveryIns: invoice?.deliveryIns || "",
    pickupReference1: invoice?.pickupReference1 || "",
    internalReference: invoice?.internalReference || "",
    pickupCompanyName: invoice?.pickupCompanyName || "",
    dropCompanyName: invoice?.dropCompanyName || "",
  });

  console.log(invoice);

  useEffect(() => {
    if (invoice.isNew === true) {
      updateDoc("place_bookings", invoice.docId, { ...invoice, isNew: false });
    }
  }, [updateDoc]);

  const handleChange = (field) => (event) => {
    setFormData({ ...formData, [field]: event.target.value });
  };
  const handleChangeAddressLabel = (field) => (event) => {
    setFormData({
      ...formData,
      address: {
        ...formData.address,
        [field]: {
          ...formData.address[field],
          label: event.target.value,
        },
      },
    });
  };
  const handleChangeAddressSuburb = (field) => (event) => {
    setFormData({
      ...formData,
      address: {
        ...formData.address,
        [field]: {
          ...formData.address[field],
          suburb: event.target.value,
        },
      },
    });
  };

  const handleDateChange = (name, val) =>
    setFormData({ ...formData, [name]: val });

  const handleSubmit = async () => {
    setIsLoading(true);
    try {
      const update = { ...invoice, ...formData };
      await updateDoc("place_bookings", invoice.docId, update);
    } catch (error) {
      console.log(error);
    } finally {
      setIsLoading(false);
      onClose;
    }
  };

  return (
    <>
      <div className="min-h-screen flex justify-center items-center">
        <Card shadow="lg" padding="lg" className="w-full max-w-4xl">
          <Stack spacing="md">
            <Group grow wrap="nowrap" align="flex-end">
              <Text className="font-semibold">Job No.</Text>
              <Text>{invoice.docId}</Text>
            </Group>
            <Group grow wrap="nowrap" align="flex-end">
              <Text className="font-semibold">Service:</Text>
              <Group grow wrap="nowrap" align="flex-end">
                <Badge color="teal" variant="light" size="lg">
                  {formData.service}
                </Badge>
                <Chip size="sm" color="danger">
                  <PdfButton size="xs" invoice={invoice} />
                </Chip>
              </Group>
            </Group>
            <Divider my="sm" />
            <Group grow wrap="nowrap" align="flex-end">
              <Text className="font-semibold">Pickup Company Name :</Text>
              <TextInput
                value={formData?.pickupCompanyName}
                onChange={handleChange("pickupCompanyName")}
                className="w-64"
              />
            </Group>
            <Group grow wrap="nowrap" align="flex-end">
              <Text className="font-semibold">Pickup Address:</Text>
              <TextInput
                value={formData.address.Origin.label}
                onChange={handleChangeAddressLabel("Origin")}
                className="w-64"
              />
            </Group>
            {/* <Group grow wrap="nowrap" align="flex-end">
              <Text className="font-semibold">Suburb:</Text>
              <TextInput
                value={formData?.address?.Origin?.suburb || ""}
                onChange={handleChangeAddressSuburb("Origin")}
                className="w-64"
              />
            </Group> */}
            <Group grow wrap="nowrap" align="flex-end">
              <Text className="font-semibold">Pickup Reference:</Text>
              <TextInput
                value={formData.pickupReference1}
                onChange={handleChange("pickupReference1")}
                className="w-64"
              />
            </Group>
            <Group grow wrap="nowrap" align="flex-end">
              <Text className="font-semibold">Delivery Company Name :</Text>
              <TextInput
                value={formData?.dropCompanyName}
                onChange={handleChangeAddressLabel("dropCompanyName")}
                className="w-64"
              />
            </Group>
            <Group grow wrap="nowrap" align="flex-end">
              <Text className="font-semibold">Delivery Address:</Text>
              <TextInput
                value={formData.address.Destination.label}
                onChange={handleChangeAddressLabel("Destination")}
                className="w-64"
              />
            </Group>
            {/* <Group grow wrap="nowrap" align="flex-end">
              <Text className="font-semibold">Suburb:</Text>
              <TextInput
                value={formData?.address?.Destination?.suburb || ""}
                onChange={handleChangeAddressSuburb("Destination")}
                className="w-64"
              />
            </Group> */}
            <Group grow wrap="nowrap" align="flex-end">
              <Text className="font-semibold">Delivery Instruction:</Text>
              <TextInput
                value={formData.deliveryIns}
                onChange={handleChange("deliveryIns")}
                className="w-64"
              />
            </Group>
            <Divider my="sm" />
            <Group grow wrap="nowrap" align="flex-end">
              <Text className="font-semibold">User Name:</Text>
              <Text>{formData.userName}</Text>
            </Group>
            <Group grow wrap="nowrap" align="flex-end">
              <Text className="font-semibold">Email:</Text>
              <Text>{invoice.userEmail}</Text>
            </Group>
            <Group grow wrap="nowrap" align="flex-end">
              <Text className="font-semibold">Contact:</Text>
              <TextInput
                value={formData.contact}
                onChange={handleChange("contact")}
                className="w-64"
              />
            </Group>
            <Group grow wrap="nowrap" align="flex-end">
              <Text className="font-semibold">Internal Reference:</Text>
              <TextInput
                value={formData.internalReference}
                onChange={handleChange("internalReference")}
                className="w-64"
              />
            </Group>
            <Divider my="sm" />
            <Group grow wrap="nowrap" align="flex-end">
              <Text className="font-semibold">Job Type:</Text>
              <Text>{invoice.returnType}</Text>
            </Group>
            {invoice?.serviceCharges !== 0 && invoice?.serviceCharges ? (
              <Group grow wrap="nowrap" align="flex-end">
                <Text className="font-semibold">Service Charges:</Text>
                <Text>${Number(invoice?.serviceCharges)?.toFixed(2)}</Text>
              </Group>
            ) : null}
            {invoice?.WaitingTimeAtPickup ? (
              <Group grow wrap="nowrap" align="flex-end">
                <Text className="font-semibold">Waiting time at pickup:</Text>
                <span className="flex justify-between">
                  <Text>
                    ${Number(invoice?.WaitingTimeAtPickup)?.toFixed(2)}
                  </Text>
                  <Text> {invoice?.WaitingTimeAtPickupDescription}</Text>
                </span>
              </Group>
            ) : null}
            {invoice?.WaitingTimeAtDrop ? (
              <Group grow wrap="nowrap" align="flex-end">
                <Text className="font-semibold">Waiting time at drop off:</Text>
                <span className="flex justify-between">
                  <Text>${Number(invoice?.WaitingTimeAtDrop)?.toFixed(2)}</Text>
                  <Text> {invoice?.WaitingTimeAtDropDescription} </Text>
                </span>
              </Group>
            ) : null}
            <Group grow wrap="nowrap" align="flex-end">
              <Text className="font-semibold">Tolls:</Text>
              <Text>${Number(invoice.totalTollsCost)?.toFixed(2)}</Text>
            </Group>
            <Group grow wrap="nowrap" align="flex-end">
              <Text className="font-semibold">Price:</Text>
              <Text>${Number(invoice.totalPrice)?.toFixed(2)}</Text>
            </Group>
            <Group grow wrap="nowrap" align="flex-end">
              <Text className="font-semibold">Gst:</Text>
              <Text>${Number(invoice.gst)?.toFixed(2)}</Text>
            </Group>
            <Group grow wrap="nowrap" align="flex-end">
              <Text className="font-semibold">Total Price with GST:</Text>
              <Text>
                $
                {(
                  Number(invoice.totalPriceWithGST) +
                  Number(invoice?.totalTollsCost || 0)
                )?.toFixed(2)}
              </Text>
            </Group>
            <Divider my="sm" />
            <Group grow wrap="nowrap" align="flex-end">
              <Text className="font-semibold hidden sm:block">Date:</Text>
              <div className="flex flex-col min-w-96">
                <Chip color="success">
                  <p className="text-xs text-gray-700 font-semibold">
                    Ready Date: {formData?.date}
                  </p>
                </Chip>
                <span className="text-gray-600 text-xs font-bold mt-6 mb-2 ml-2">
                  Select New Ready Date Here
                </span>
                <DateTime
                  service={formData.service}
                  handle_date={(name, val) =>
                    handleDateChange(name, formatDate(val))
                  }
                  handle_time={(name, val) =>
                    handleDateChange(name, formatTime(val))
                  }
                  handleInvalid={(e) => console.log(e)}
                  admin={true}
                  date={invoice?.date}
                  time={invoice?.time}
                />
              </div>
            </Group>
            <Divider my="sm" />
            <Group>
              <ItemDimensions
                defaultItems={invoice?.items}
                diseble={true}
                add={true}
                admin={admin}
                invoice={invoice}
              />
            </Group>
            <Divider my="sm" />
          </Stack>
        </Card>
      </div>
      <Button
        fullWidth
        variant="solid"
        color={isLoading ? "success" : "primary"}
        onPress={handleSubmit}
        isLoading={isLoading}
      >
        Save
      </Button>
      <Divider my="sm" />
    </>
  );
}

{
  /* <Group grow wrap="nowrap" align="flex-end">
<Text className="font-semibold">Distance Data:</Text>
<div className="w-64">
  <Text>Status: {invoice.distanceData.status}</Text>
  <Text>Distance: {invoice.distanceData.distance.text}</Text>
  <Text>Duration: {invoice.distanceData.duration.text}</Text>
</div>
</Group> */
}
