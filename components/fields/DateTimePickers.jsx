import { DatePicker } from "@mantine/dates";
import React, { useEffect, useState } from "react";
import { addDays, format, parse, isBefore } from "date-fns";

export default function DateTimePickers({
  handleDateTimeChange,
  service,
  date,
  time,
}) {
  const [selectedDate, setSelectedDate] = useState(null);
  const [selectedTime, setSelectedTime] = useState("");
  const [disabledDate, setDisabledDate] = useState(null);

  useEffect(() => {
    setSelectedDate(date);
    setSelectedTime(time);
  }, []);

  useEffect(() => {
    const todayDate = new Date();
    const tomorowDate = addDays(todayDate, +1);

    const selectedTimeDate = parse(selectedTime, "HH:mm", new Date());

    if (
      (service === "Standard" &&
        isBefore(selectedTimeDate, parse("13:01", "HH:mm", new Date()))) ||
      (service === "Express" &&
        isBefore(selectedTimeDate, parse("14:01", "HH:mm", new Date())))
    ) {
      setDisabledDate(tomorowDate);
    } else {
      setDisabledDate(todayDate);
    }
  }, [service, selectedTime]);

  const updateDateTime = (date, time) => {
    handleDateTimeChange({
      time,
      date,
    });
  };

  const handleTimeChange = (time) => {
    const maxTime =
      service === "Standard"
        ? "13:00"
        : service === "Express"
        ? "14:00"
        : "23:59";
    const selectedTimeDate = parse(time, "HH:mm", new Date());
    const maxTimeDate = parse(maxTime, "HH:mm", new Date());

    if (isBefore(selectedTimeDate, maxTimeDate) || time === maxTime) {
      setSelectedTime(time);
      updateDateTime(selectedDate, time);
    } else {
      alert(`Booking not allowed for the selected level of service after ${maxTime} 
      Please select another service type`);
      setSelectedTime("00:00");
      updateDateTime(selectedDate, "00:00");
    }
  };

  const handleDateChange = (date) => {
    const formattedDate = format(date, "dd/MM/yyyy");
    setSelectedDate(formattedDate);
    updateDateTime(formattedDate, selectedTime);
  };

  return (
    <>
      <DatePicker
        valueFormat="dd/MM/yyyy"
        clearable
        // dropdownType="modal"
        label="Ready date"
        placeholder="Ready date"
        onChange={handleDateChange}
        minDate={disabledDate}
      />

      <input
        type="time"
        value={selectedTime}
        onChange={(e) => handleTimeChange(e.target.value)}
        style={{
          padding: "0.5rem",
          fontSize: "1rem",
          borderRadius: "4px",
          border: "1px solid #ccc",
          boxShadow: "inset 0 1px 3px rgba(0, 0, 0, 0.1)",
          width: "100%",
          color: "#333",
        }}
      />
    </>
  );
}
