"use client";

import { fetchDocById } from "@/api/firebase/functions/fetch";
import { updateDoc } from "@/api/firebase/functions/upload";
import { Group, Input, NumberInput, rem } from "@mantine/core";
import {
  Button,
  Chip,
  Divider,
  Dropdown,
  DropdownItem,
  DropdownMenu,
  DropdownTrigger,
} from "@nextui-org/react";
import { IconClock12 } from "@tabler/icons-react";
import React, { useEffect, useState } from "react";
import determineReturnAndServiceTypes from "@/api/price_calculation/function/helper/determineReturnAndServiceTypes";
import ProcessPrice from "./calc_price_by_job_and_service/index";
import toast from "react-hot-toast";

export default function FixPrice({ booking, toggleShowPrice, setBooking }) {
  const [invoice, setInvoice] = useState({});
  const [load, setLoad] = useState(false);

  useEffect(() => {
    if (booking) {
      setInvoice(booking);
    }
  }, [booking]);

  const handleSubmit = async () => {
    try {
      // Fetching minimum wait time rate and GST
      const priceSettings = await fetchDocById("price_settings", "data");

      const gstVal = Number(priceSettings?.same_day?.gst?.GST);
      const minWaitTimeRate = Number(
        priceSettings?.same_day?.minWaitTime?.minWaitTimeRate
      );

      // Display both values in a formatted toast message
      // toast.success(`Min Wait Time Rate: ${minWaitTimeRate}, GST: ${gstVal}`);

      setLoad(true);

      // Extracting relevant invoice values with fallback
      const totalPrice = Number(invoice?.totalPrice) || 0;
      const serviceCharges = Number(invoice?.serviceCharges) || 0;
      const wTP = Number(invoice?.WaitingTimeAtPickupDefault) || 0;
      const wTD = Number(invoice?.WaitingTimeAtDropDefault) || 0;

      // Calculating waiting time charges
      const WaitingTimeAtPickup = wTP <= 10 ? 0 : (wTP - 10) * minWaitTimeRate;
      const WaitingTimeAtDrop = wTD <= 10 ? 0 : (wTD - 10) * minWaitTimeRate;

      // Summing up charges
      const chargesSum =
        totalPrice + serviceCharges + WaitingTimeAtPickup + WaitingTimeAtDrop;
      const gst = (chargesSum * gstVal) / 100;
      const totalPriceWithGST = chargesSum + gst;

      // Determining return type and service type
      const returnType = determineReturnAndServiceTypes(
        invoice?.service,
        invoice?.returnType
      );

      // Creating updated invoice object
      const updatedInvoice = {
        ...invoice,
        totalPrice,
        totalPriceWithGST: Number(totalPriceWithGST.toFixed(2)),
        gst: Number(gst.toFixed(2)),
        WaitingTimeAtPickup,
        WaitingTimeAtDrop,
        returnType,
      };

      // Updating state and database
      setInvoice(updatedInvoice);
      setBooking(updatedInvoice);
      console.log(updatedInvoice);

      // Persist updated invoice
      await updateDoc("place_bookings", invoice?.docId, updatedInvoice);
    } catch (error) {
      console.error("Error updating invoice:", error);
    } finally {
      setLoad(false);
    }
  };

  const handleAutoCalcSubmit = async () => {
    try {
      const type =
        invoice?.returnType[0] === "C"
          ? "Courier"
          : invoice?.returnType[0] + invoice?.returnType[1];
      // toast(type);
      const booking = await ProcessPrice({ ...invoice, returnType: type });

      toast("Updated Successfully");
      setInvoice(booking);
      setBooking(booking);
      await updateDoc("place_bookings", invoice.docId, booking);
      toast("Updated Successfully");
    } catch (error) {
      console.log({ error });
    }
  };

  const icon = (
    <IconClock12 style={{ width: rem(20), height: rem(20) }} stroke={1.5} />
  );

  return (
    <div className="bg-slate-100 rounded-lg p-2 my-6">
      <Group grow wrap="nowrap" align="flex-end">
        <NumberInput
          precision={0}
          decimalScale={0}
          leftSection={icon}
          min={0}
          label="Waiting time at pickup "
          mb={6}
          value={invoice.WaitingTimeAtPickupDefault}
          onChange={(value) =>
            setInvoice({ ...invoice, WaitingTimeAtPickupDefault: value })
          }
        />
        <Input
          placeholder="Description"
          value={invoice.WaitingTimeAtPickupDescription || ""}
          onChange={(e) =>
            setInvoice({
              ...invoice,
              WaitingTimeAtPickupDescription: e.target.value,
            })
          }
        />
      </Group>
      <Group grow wrap="nowrap" align="flex-end">
        <NumberInput
          precision={0}
          decimalScale={0}
          leftSection={icon}
          min={0}
          label="Waiting time at drop off "
          mb={6}
          value={invoice.WaitingTimeAtDropDefault}
          onChange={(value) =>
            setInvoice({ ...invoice, WaitingTimeAtDropDefault: value })
          }
        />
        <Input
          placeholder="Description"
          value={invoice.WaitingTimeAtDropDescription || ""}
          onChange={(e) =>
            setInvoice({
              ...invoice,
              WaitingTimeAtDropDescription: e.target.value,
            })
          }
        />
      </Group>
      <Group grow wrap="nowrap" align="flex-end">
        <NumberInput
          min={0}
          precision={2}
          label="Tolls"
          mb={6}
          value={invoice.totalTollsCost}
          onChange={(value) =>
            setInvoice({ ...invoice, totalTollsCost: value })
          }
        />
        <NumberInput
          min={1}
          precision={2}
          label="Service Charges"
          mb={6}
          value={invoice.serviceCharges || 0}
          onChange={(value) =>
            setInvoice({ ...invoice, serviceCharges: value })
          }
        />
      </Group>
      <NumberInput
        min={10}
        precision={2}
        label="Price"
        mb={6}
        value={invoice.totalPrice}
        onChange={(value) => setInvoice({ ...invoice, totalPrice: value })}
      />
      <p className="mt-2 text-sm text-gray-600">
        Click this button to recalculate the total price, including service
        charges and GST, and update the invoice accordingly.
      </p>
      <Button
        fullWidth
        isLoading={load}
        color="primary"
        onClick={handleSubmit}
        disabled={load}
      >
        Update
      </Button>

      <p className="mt-4 text-sm text-gray-600">
        Alternatively, you can use the Auto Calculate Price button to
        automatically recalculate the price based on the current settings.
      </p>

      <Divider className="my-2" />

      <div className="flex gap-1">
        <Dropdown>
          <DropdownTrigger>
            <Button fullWidth color="primary" className="mb-2" variant="flat">
              Job Type <Chip color="primary">{invoice?.returnType}</Chip>
            </Button>
          </DropdownTrigger>
          <DropdownMenu
            onAction={(e) => {
              setInvoice({ ...invoice, returnType: e });
            }}
            aria-label="Static Actions"
          >
            <DropdownItem key="Courier">Courier</DropdownItem>
            <DropdownItem key="HT">HT</DropdownItem>
            <DropdownItem key="1T">1T</DropdownItem>
            <DropdownItem key="2T">2T</DropdownItem>
            <DropdownItem key="4T">4T</DropdownItem>
            <DropdownItem key="6T">6T</DropdownItem>
            <DropdownItem key="8T">8T</DropdownItem>
            <DropdownItem key="10T">10T</DropdownItem>
            <DropdownItem key="12T">12T</DropdownItem>
          </DropdownMenu>
        </Dropdown>
        <Dropdown>
          <DropdownTrigger>
            <Button fullWidth color="primary" className="mb-2" variant="flat">
              Service <Chip color="primary">{invoice?.service}</Chip>
            </Button>
          </DropdownTrigger>
          <DropdownMenu
            onAction={(e) => {
              setInvoice({ ...invoice, service: e });
            }}
            aria-label="Static Actions"
          >
            <DropdownItem key="Standard">Standard</DropdownItem>
            <DropdownItem key="Express">Express</DropdownItem>
            <DropdownItem key="Direct">Direct</DropdownItem>
            <DropdownItem key="After Hours">After Hours</DropdownItem>
            <DropdownItem key="Weekend Deliveries">
              Weekend Deliveries
            </DropdownItem>
          </DropdownMenu>
        </Dropdown>
      </div>

      <Button fullWidth color="primary" onClick={handleAutoCalcSubmit}>
        Auto Calculate Price
      </Button>
      <p className="mt-2 text-sm text-gray-600">
        Use this button to automatically recalculate the total price based on
        the provided booking details and settings.
      </p>
      <br />
    </div>
  );
}
