import React, { useState } from "react";
import { Modal, Button, Group } from "@mantine/core";
import { DatePickerInput } from "@mantine/dates";
// import { showNotification } from "@mantine/notifications";
import { getBookingsOnlyBetweenDates } from "@/api/firebase/functions/fetch";

export default function Reports() {
  const [opened, setOpened] = useState(false);
  const [loading, setLoading] = useState(false); // Added loading state
  const [bookings, setBookings] = useState([]);
  const [totalPrice, setTotalPrice] = useState(0);
  const [formData, setFormData] = useState({
    fromDate: null,
    toDate: null,
  });

  const handleSubmit = async () => {
    setLoading(true);
    try {
      const bookings = await getBookingsOnlyBetweenDates(
        formData.fromDate,
        formData.toDate
      );

      if (!bookings.length) {
        // showNotification({
        //   title: "No Bookings Found",
        //   message: "No bookings were found for the selected dates.",
        //   color: "red",
        // });
        setLoading(false);
        return;
      }

      setBookings(bookings);

      // Calculate the total price of all bookings, parsing each price as a number
      const total = bookings.reduce(
        (sum, booking) => sum + Number(booking?.totalPriceWithGST || 0),
        0
      );
      setTotalPrice(total.toFixed(2)); // Format the total to 2 decimal places
    } catch (error) {
      console.error(error);
      showNotification({
        title: "Error",
        message: "Something went wrong while fetching bookings.",
        color: "red",
      });
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
            valueFormat="DD MM YYYY"
          />
        </div>

        <div style={{ marginBottom: "1.5rem" }} className="w-full">
          <DatePickerInput
            className="w-full"
            placeholder="To Date"
            label="To Date"
            value={formData.toDate}
            onChange={(date) => setFormData({ ...formData, toDate: date })}
            valueFormat="DD MM YYYY"
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
                ${totalPrice.toLocaleString()}
              </span>
              <div className="mt-2 text-teal-100 font-medium">
                {bookings?.length === 1
                  ? "1 Booking"
                  : `${bookings?.length} Bookings`}
              </div>
            </div>
          </div>
          {/* <div className="mt-4 flex justify-center space-x-2">
            <span className="inline-block bg-teal-200 rounded-full px-3 py-1 text-sm font-semibold text-teal-800">
              #Revenue
            </span>
            <span className="inline-block bg-emerald-200 rounded-full px-3 py-1 text-sm font-semibold text-emerald-800">
              #Growth
            </span>
          </div> */}
        </div>
      </Modal>
    </>
  );
}
