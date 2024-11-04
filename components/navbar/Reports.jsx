import React, { useState } from "react";
import { Modal, Button, Group } from "@mantine/core";
import { DatePickerInput } from "@mantine/dates";
import useAdminContext from "@/context/AdminProvider";
import { parse, startOfDay } from "date-fns";
import toast from "react-hot-toast";

function formatDateToDDMMYYYY(date) {
  const day = String(date.getDate()).padStart(2, "0");
  const month = String(date.getMonth() + 1).padStart(2, "0"); // Months are 0-indexed
  const year = date.getFullYear();
  return `${day}/${month}/${year}`;
}

const parseDate = (dateString) => {
  try {
    const parsedDate = parse(dateString, "dd/MM/yyyy", new Date());
    return startOfDay(parsedDate);
  } catch (error) {
    console.error("Error parsing date:", error, "Date string:", dateString);
    return null;
  }
};

export default function Reports() {
  const { allBookings } = useAdminContext();
  const [opened, setOpened] = useState(false);
  const [loading, setLoading] = useState(false);
  const [bookings, setBookings] = useState([]);
  const [totalPrice, setTotalPrice] = useState(0);
  const [formData, setFormData] = useState({
    fromDate: null,
    toDate: null,
  });

  const handleSubmit = async () => {
    setLoading(true);
    try {
      const { fromDate, toDate } = formData;

      // Check if both dates are selected
      if (!fromDate || !toDate) {
        toast.error("Please select both From and To dates.");
        return;
      }

      // Parse the dates
      const fromDateParsed = startOfDay(fromDate);
      const toDateParsed = startOfDay(toDate);

      // Filter bookings based on date range
      const filteredBookings = allBookings.filter((booking) => {
        if (!booking.date) return false;
        const bookingDate = parseDate(booking.date); // Assuming booking.date is in "DD/MM/YYYY" format
        return (
          bookingDate &&
          bookingDate >= fromDateParsed &&
          bookingDate <= toDateParsed
        );
      });

      console.log(filteredBookings);

      if (!filteredBookings.length) {
        setLoading(false);
        return;
      }

      setBookings(filteredBookings);

      const total = filteredBookings.reduce(
        (sum, booking) => sum + Number(booking?.totalPriceWithGST),
        0
      );
      setTotalPrice(total.toFixed(2));
    } catch (error) {
      console.error(error);
      toast.error("Something went wrong while fetching bookings.");
    } finally {
      setLoading(false);
    }
  };

  return (
    <>
      <Button onClick={() => setOpened(true)} variant="light" color="#1384e1">
        Report
      </Button>

      <Modal
        opened={opened}
        onClose={() => setOpened(false)}
        title="Booking Report"
        size="lg"
      >
        <div style={{ marginBottom: "1.5rem" }} className="w-full">
          <DatePickerInput
            className="w-full"
            label="From Date"
            placeholder="From Date"
            value={formData.fromDate}
            onChange={(date) => setFormData({ ...formData, fromDate: date })}
            valueFormat="DD/MM/YYYY"
          />
        </div>

        <div style={{ marginBottom: "1.5rem" }} className="w-full">
          <DatePickerInput
            className="w-full"
            placeholder="To Date"
            label="To Date"
            value={formData.toDate}
            onChange={(date) => setFormData({ ...formData, toDate: date })}
            valueFormat="DD/MM/YYYY"
          />
        </div>

        <Group position="center" mt="md">
          <Button
            fullWidth
            onClick={handleSubmit}
            size="md"
            variant="filled"
            color="green"
            loading={loading}
          >
            Get Bookings
          </Button>
        </Group>

        <div className="mt-8 p-4 bg-gradient-to-r from-teal-500 to-emerald-500 rounded-lg shadow-lg transform hover:scale-95 transition-transform duration-300 ease-in-out">
          <div className="text-center">
            <h3 className="text-2xl font-bold text-white mb-2 tracking-wide">
              Total Revenue
            </h3>
            <div className="inline-block">
              <span className="text-5xl font-extrabold text-white drop-shadow-md">
                ${Number(totalPrice).toLocaleString()}
              </span>
              <div className="mt-2 text-teal-100 font-medium">
                {bookings.length === 1
                  ? "1 Booking"
                  : `${bookings.length} Bookings`}
              </div>
            </div>
          </div>
        </div>
      </Modal>
    </>
  );
}
