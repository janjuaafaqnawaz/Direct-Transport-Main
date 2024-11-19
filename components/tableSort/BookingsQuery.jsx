"use client";

import Image from "next/image";
import Link from "next/link";
import { PackageSearch } from "lucide-react";
import formatToSydneyTime from "@/lib/utils/formatToSydneyTime";

import { Button } from "@/components/ui/button";
import { CardTitle } from "@/components/ui/card";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import { PhotoView } from "react-photo-view";
import { useDisclosure } from "@mantine/hooks";
import { Modal, ScrollArea } from "@mantine/core";

export function ImgsDialog({ imgs }) {
  const [opened, { open, close }] = useDisclosure(false); // Manage modal state

  return (
    <>
      <div onClick={open} style={{ cursor: "pointer" }}>
        {imgs && imgs.length > 0 ? (
          <Image
            src={imgs[0] || ""}
            alt={`Image`}
            width={100}
            height={100}
            className="w-28 h-28 object-cover rounded-lg"
          />
        ) : (
          <span className="h-28 ">No images available.</span>
        )}
      </div>

      <Modal opened={opened} onClose={close} title="Images">
        <ScrollArea style={{ height: 500 }}>
          <div className="flex flex-wrap gap-2">
            {imgs && imgs.length > 0 ? (
              imgs.map((url, index) => (
                <PhotoView key={index} src={url}>
                  <Image
                    src={url}
                    alt={`Image ${url}`}
                    width={100}
                    height={100}
                    className="w-28 h-28 object-cover rounded-lg"
                  />
                </PhotoView>
              ))
            ) : (
              <span>No images available.</span>
            )}
          </div>
        </ScrollArea>
      </Modal>
    </>
  );
}

function calculateTotalQuantity(data) {
  let totalQty = 0;
  if (data.items && Array.isArray(data.items)) {
    data.items.forEach((item) => {
      if (item.qty) {
        totalQty += parseInt(item.qty, 10);
      }
    });
  }
  return totalQty;
}

function BookingTable({ bookings }) {
  return (
    <Table>
      <TableHeader>
        <TableRow>
          <TableHead>Job No</TableHead>
          <TableHead>Date & Time</TableHead>
          <TableHead>From</TableHead>
          <TableHead>To</TableHead>
          <TableHead>Service</TableHead>
          <TableHead>Status</TableHead>
          <TableHead>Pickup</TableHead>
          <TableHead>Delivery</TableHead>
          <TableHead className="w-28">Cost (ex GST)</TableHead>
          <TableHead>Items</TableHead>
          <TableHead>POD</TableHead>
        </TableRow>
      </TableHeader>
      <TableBody>
        {bookings?.map((booking) => (
          <TableRow key={booking?.docId}>
            <TableCell>{booking?.docId}</TableCell>
            <TableCell>{formatToSydneyTime(booking?.createdAt)}</TableCell>
            <TableCell>{booking?.address?.Origin?.label}</TableCell>
            <TableCell>{booking?.address?.Destination?.label}</TableCell>
            <TableCell>{booking?.service}</TableCell>
            <TableCell>{booking?.currentStatus || "Pending"}</TableCell>
            <TableCell>
              {booking?.progressInformation?.pickedup || "Pending"}
            </TableCell>
            <TableCell>
              {booking?.progressInformation?.delivered || "Pending"}
            </TableCell>
            <TableCell>${booking?.totalPrice}</TableCell>
            <TableCell>{calculateTotalQuantity(booking)}</TableCell>
            <TableCell>
              <ImgsDialog imgs={booking.images} />
            </TableCell>
          </TableRow>
        ))}
      </TableBody>
    </Table>
  );
}

export default function BookingsQuery({ bookings }) {
  return (
    <div className="mt-20">
      <CardTitle className=" text-2xl font-bold flex items-center gap-2">
        <PackageSearch className="w-6 h-6" />
        Track Booking
      </CardTitle>
      <div className="overflow-x-auto">
        <BookingTable bookings={bookings} />
      </div>
      <div className="mt-6 flex justify-center">
        <Link href="/ClientServices" passHref>
          <Button size="lg">Client Services</Button>
        </Link>
      </div>
    </div>
  );
}
