"use client";

import { useState, useEffect, useCallback } from "react";
import { CalendarDate } from "@internationalized/date";
import { Calendar, TimeInput } from "@nextui-org/react";
import {
  Time,
  getLocalTimeZone,
  today,
  isWeekend as isWeekendDate,
} from "@internationalized/date";
import { parse } from "date-fns";

// Constants for time values
const TIME_VALUES = {
  FOUR_PM: new Time(16, 0),
  FIVE_PM: new Time(17, 0),
  FIVE_AM: new Time(5, 0),
  SEVEN_AM: new Time(7, 0),
  SIX_PM: new Time(18, 0),
  THREE_PM: new Time(15, 0),
  MIDNIGHT: new Time(24, 0),
  ZERO_TIME: new Time(0, 0),
};

export default function DateTime({
  handle_date,
  handle_time,
  service,
  handleInvalid,
  admin = false,
  date = null,
  time = null,
}) {
  const [timeValue, setTimeValue] = useState(TIME_VALUES.ZERO_TIME);
  const [maxTime, setMaxTime] = useState(TIME_VALUES.MIDNIGHT);
  const [minTime, setMinTime] = useState(TIME_VALUES.ZERO_TIME);
  const [dateValue, setDateValue] = useState(today(getLocalTimeZone()));
  const [isInvalid, setIsInvalid] = useState(true);
  const [errorMessage, setErrorMessage] = useState("");

  // Initialize component with provided date and time or current values
  useEffect(() => {
    const initializeDateTime = () => {
      const now = new Date();
      
      if (date && time) {
        try {
          const parsedTime = parse(time, "hh:mm a", new Date());
          const parsedDate = parse(date, "dd/MM/yyyy", new Date());
          
          const currTime = new Time(
            parsedTime.getHours(),
            parsedTime.getMinutes()
          );
          const currDate = new CalendarDate(
            parsedDate.getFullYear(),
            parsedDate.getMonth() + 1, // Months are 1-based in CalendarDate
            parsedDate.getDate()
          );
          
          setTimeValue(currTime);
          setDateValue(currDate);
          handle_time("time", currTime);
          handle_date("date", currDate);
          return;
        } catch (error) {
          console.error("Error parsing date/time:", error);
        }
      }
      
      // Default to current time if no valid date/time provided
      try {
        const defaultTime = new Time(now.getHours(), now.getMinutes());
        setTimeValue(defaultTime);
        handle_time("time", defaultTime);
      } catch (error) {
        console.error("Error setting default time:", error);
      }
    };

    initializeDateTime();
  }, [date, time, handle_date, handle_time]);

  const handleTimeChange = useCallback((value) => {
    setTimeValue(value);
    handle_time("time", value);
  }, [handle_time]);

  const handleDateChange = useCallback((value) => {
    setDateValue(value);
    handle_date("date", value);
  }, [handle_date]);

  // Validate time based on service type and date
  useEffect(() => {
    const currentDate = today(getLocalTimeZone());
    const isCurrentOrFutureDate = dateValue?.compare(currentDate) >= 0;
    const isWeekend = isWeekendDate(dateValue, "en-au");

    let timeInvalid = false;
    let error = "";

    if (!admin && isCurrentOrFutureDate) {
      switch (service) {
        case "Standard":
          setMaxTime(TIME_VALUES.THREE_PM);
          setMinTime(TIME_VALUES.ZERO_TIME);
          timeInvalid = timeValue.compare(TIME_VALUES.THREE_PM) > 0;
          if (timeInvalid) {
            error = `Please select "Express" or "Direct" Service`;
          }
          break;
          
        case "Express":
          setMaxTime(TIME_VALUES.FOUR_PM);
          setMinTime(TIME_VALUES.ZERO_TIME);
          timeInvalid = timeValue.compare(TIME_VALUES.FOUR_PM) > 0;
          if (timeInvalid) {
            error = `Please select "Direct" Service`;
          }
          break;
          
        case "Direct":
          setMaxTime(TIME_VALUES.FIVE_PM);
          setMinTime(TIME_VALUES.SEVEN_AM);
          timeInvalid = timeValue.compare(TIME_VALUES.SEVEN_AM) < 0 || 
                       timeValue.compare(TIME_VALUES.SIX_PM) >= 0;
          if (timeInvalid) {
            error = `Please select a time within the 7 AM to 5 PM window`;
          }
          break;
          
        case "After Hours":
          setMaxTime(TIME_VALUES.FIVE_PM);
          setMinTime(TIME_VALUES.SEVEN_AM);
          timeInvalid = timeValue.compare(TIME_VALUES.FIVE_PM) < 0 && 
                       timeValue.compare(TIME_VALUES.SEVEN_AM) > 0;
          if (timeInvalid) {
            error = `Please select a time within the 5 PM to 7 AM window`;
          }
          break;
          
        case "Weekend Deliveries":
          setMaxTime(TIME_VALUES.FIVE_PM);
          setMinTime(TIME_VALUES.ZERO_TIME);
          if (!isWeekend) {
            timeInvalid = true;
            error = `Service is only available on Saturday and Sunday`;
          }
          break;
          
        default:
          setMaxTime(TIME_VALUES.MIDNIGHT);
          setMinTime(TIME_VALUES.ZERO_TIME);
      }
    } else {
      setMaxTime(TIME_VALUES.MIDNIGHT);
      setMinTime(TIME_VALUES.ZERO_TIME);
    }

    setIsInvalid(timeInvalid);
    handleInvalid(timeInvalid);
    setErrorMessage(timeInvalid ? error : "");
  }, [service, dateValue, timeValue, admin, handleInvalid]);

  return (
    <div className="space-y-4">
      <div className="w-full bg-slate-50 py-4 rounded-md flex justify-center align-middle">
        <Calendar
          valueFormat="dd/MM/yyyy"
          label="Ready Date"
          onChange={handleDateChange}
          value={dateValue}
          minValue={admin ? undefined : today(getLocalTimeZone())}
          showMonthAndYearPickers={true}
        />
      </div>
      
      <TimeInput
        label="Ready Time"
        value={timeValue}
        onChange={handleTimeChange}
        isInvalid={isInvalid}
        errorMessage={errorMessage}
        maxValue={maxTime}
        minValue={minTime}
      />
    </div>
  );
}