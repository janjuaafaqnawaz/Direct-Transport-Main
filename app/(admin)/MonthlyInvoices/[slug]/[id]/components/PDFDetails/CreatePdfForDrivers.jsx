/* eslint-disable react-hooks/exhaustive-deps */
"use client";

import React, { useEffect, useState } from "react";
import useAdminContext from "@/context/AdminProvider";
import PdfButton from "./pdf/PdfButton";
import { Loader } from "@mantine/core";
import { Timestamp } from "firebase/firestore";

const pdfId = Math.floor(100000 + Math.random() * 900000);

const parseDate = (dateString) => {
  const [day, month, year] = dateString.split("/");
  return new Date(year, month - 1, day);
};

export default function CreatePdfForDrivers({ datesRange, user }) {
  const [loading, setLoading] = useState(true);
  const [clientBookings, setClientBookings] = useState([]);
  const [driverBookings, setDriverBookings] = useState([]);
  const [bookings, setBookings] = useState([]);
  const { allBookings } = useAdminContext();

  async function userBookings() {
    try {
      const startDate = parseDate(datesRange.start);
      const endDate = parseDate(datesRange.end);

      const startTimestamp = Timestamp.fromDate(startDate);
      const endTimestamp = Timestamp.fromDate(endDate);

      // Filter bookings
      const filteredBookings = allBookings?.filter((item) => {
        if (item?.isArchived === true) return false;

        if (item?.createdAtStandardized) {
          const createdAtTimestamp = item.createdAtStandardized;

          return (
            createdAtTimestamp.seconds >= startTimestamp.seconds &&
            createdAtTimestamp.seconds <= endTimestamp.seconds &&
            user.email === item.userEmail
          );
        }

        return false;
      });

      setBookings(filteredBookings);
    } catch (error) {
      console.error("Error filtering bookings:", error);
    } finally {
      setLoading(false);
    }
  }

  async function driverDeliveredBookings() {
    try {
      const startDate = parseDate(datesRange.start);
      const endDate = parseDate(datesRange.end);

      const startTimestamp = Timestamp.fromDate(startDate);
      const endTimestamp = Timestamp.fromDate(endDate);

      const filteredBookings = allBookings?.filter((item) => {
        if (item?.isArchived === true) return false;

        if (item?.progressInformation?.delivered) {
          const createdAtTimestamp = item.createdAtStandardized;

          // const deliveredDate = item.progressInformation.delivered;
          // console.log(item?.progressInformation?.delivered);

          try {
            // const [datePart, timePart] = deliveredDate.split(" ");
            // const [day, month, year] = datePart.split("/");
            // const [hour, minute, second] = timePart.split(":");
            // const deliveredDateObj = new Date(
            //   year,
            //   month - 1,
            //   day,
            //   hour,
            //   minute,
            //   second
            // );

            // console.log(
            //   deliveredDateObj >= startDate && deliveredDateObj <= endDate
            // );

            return (
              createdAtTimestamp.seconds >= startTimestamp.seconds &&
              createdAtTimestamp.seconds <= endTimestamp.seconds &&
              item.driverEmail === user.email
            );
          } catch (error) {
            console.warn("Invalid delivered date format:", deliveredDate);
            return false;
          }
        }

        return false;
      });

      setBookings(filteredBookings);
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
      {bookings.length > 0 ? (
        <PdfButton
          user={user}
          bookings={bookings}
          datesRange={datesRange}
          driverLayout={true}
          pdfId={"#" + pdfId}
        />
      ) : null}
    </div>
  );
}
