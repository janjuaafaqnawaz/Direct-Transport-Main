/* eslint-disable react-hooks/exhaustive-deps */
"use client";

import React, { useEffect, useState } from "react";
import useAdminContext from "@/context/AdminProvider";
import PdfButton from "./pdf/PdfButton";
import { Loader } from "@mantine/core";
import { Timestamp } from "firebase/firestore";

const pdfId = Math.floor(100000 + Math.random() * 900000);

export default function CreatePdfForDrivers({ datesRange, user }) {
  const [loading, setLoading] = useState(true);
  const [clientBookings, setClientBookings] = useState([]);
  const [driverBookings, setDriverBookings] = useState([]);
  const { allBookings } = useAdminContext();

  async function userBookings() {
    try {
      const parseDate = (dateString) => {
        const [day, month, year] = dateString.split("/");
        return new Date(year, month - 1, day);
      };

      const startDate = parseDate(datesRange.start);
      const endDate = parseDate(datesRange.end);

      const startTimestamp = Timestamp.fromDate(startDate);
      const endTimestamp = Timestamp.fromDate(endDate);

      // Filter bookings
      const filteredBookings = allBookings?.filter((item) => {
        if (item?.isArchived === true) return false;

        if (item?.createdAtStandardized) {
          const createdAtTimestamp = item.createdAtStandardized;

          // console.log({
          //   startTimestamp,
          //   endTimestamp,
          //   createdAtTimestamp,
          // });

          return (
            createdAtTimestamp.seconds >= startTimestamp.seconds &&
            createdAtTimestamp.seconds <= endTimestamp.seconds
          );
        }

        return false;
      });

      setClientBookings(filteredBookings);
    } catch (error) {
      console.error("Error filtering bookings:", error);
    } finally {
      setLoading(false);
    }
  }

  async function driverDeliveredBookings() {
    try {
      const filteredBookings = allBookings?.filter((item) => {
        if (item?.isArchived === true) return false;

        if (item?.progressInformation?.delivered) {
          const deliveredDate = item.progressInformation.delivered;

          const [datePart, timePart] = deliveredDate.split(" ");
          const [day, month, year] = datePart.split("/");
          const [hour, minute, second] = timePart.split(":");
          const deliveredDateObj = new Date(
            year,
            month - 1,
            day,
            hour,
            minute,
            second
          );

          const currentDate = new Date();

          const thirtyDaysAgo = new Date();
          thirtyDaysAgo.setDate(currentDate.getDate() - 30);

          return (
            deliveredDateObj >= thirtyDaysAgo && deliveredDateObj <= currentDate
          );
        }

        return false;
      });

      setDriverBookings(filteredBookings);
    } catch (error) {
      console.error("Error filtering bookings:", error);
    } finally {
      setLoading(false);
    }
  }

  useEffect(() => {
    userBookings();
    driverDeliveredBookings();
  }, [allBookings, user, datesRange]);

  if (loading) {
    return <Loader />;
  }

  return (
    <div style={{ borderRadius: 30, backgroundColor: "#f8f9fa", padding: 50 }}>
      {clientBookings.length > 0 ? (
        <PdfButton
          user={user}
          bookings={clientBookings}
          driverBookings={driverBookings}
          datesRange={datesRange}
          driverLayout={true}
          pdfId={"#" + pdfId}
        />
      ) : null}
    </div>
  );
}
