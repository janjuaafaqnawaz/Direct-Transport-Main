"use client";

import { startOfMonth, endOfMonth, subMonths, format } from "date-fns";

// const { startOfMonth, endOfMonth, subMonths, format } = require('date-fns');

const getFormattedDateStr = () => {
  const today = new Date();
  const day = String(today.getDate()).padStart(2, "0");
  const month = String(today.getMonth() + 1).padStart(2, "0");
  const year = today.getFullYear();

  return `${day}/${month}/${year}`;
};

const getFormattedTime = () => {
  const now = new Date();
  let hours = now.getHours();
  const minutes = String(now.getMinutes()).padStart(2, "0");
  const ampm = hours >= 12 ? "PM" : "AM";

  hours = hours % 12 || 12; // Convert to 12-hour format and handle midnight (0 -> 12)
  hours = String(hours).padStart(2, "0");

  return `${hours}:${minutes} ${ampm}`;
};

function getCurrentMonthDates() {
  const now = new Date();

  // Get the start of the month
  const startOfMonth = new Date(now.getFullYear(), now.getMonth(), 1);
  const endOfMonth = new Date(now.getFullYear(), now.getMonth() + 1, 0);

  return {
    startDate: startOfMonth.toString(),
    endDate: endOfMonth.toString(),
  };
}

function getPreviousMonthDates() {
  const now = new Date();

  // Calculate the start and end dates of the previous month
  const startOfPreviousMonth = startOfMonth(subMonths(now, 1));
  const endOfPreviousMonth = endOfMonth(subMonths(now, 1));

  // Format dates as strings
  const startDateStr = format(startOfPreviousMonth, "dd-MM-yyyy");
  const endDateStr = format(endOfPreviousMonth, "dd-MM-yyyy");

  return {
    startDate: startOfPreviousMonth.toString(),
    endDate: endOfPreviousMonth.toString(),
    startDateStr: startDateStr,
    endDateStr: endDateStr,
  };
}
// console.log(getPreviousMonthDates());
function getCurrentMonthDate() {
  const now = new Date();

  // Calculate the start and end dates of the current month
  const startOfCurrentMonth = startOfMonth(now);
  const endOfCurrentMonth = endOfMonth(now);

  // Format dates as strings
  const startDateStr = format(startOfCurrentMonth, "dd-MM-yyyy");
  const endDateStr = format(endOfCurrentMonth, "dd-MM-yyyy");

  return {
    startDate: startOfPreviousMonth.toString(),
    endDate: endOfPreviousMonth.toString(),
    startDateStr: startDateStr,
    endDateStr: endDateStr,
  };
}

function getCurrentMonthDatesStr() {
  const now = new Date();

  // Get the start of the month
  const startOfMonth = new Date(now.getFullYear(), now.getMonth(), 1);
  const endOfMonth = new Date(now.getFullYear(), now.getMonth() + 1, 0);

  // Format dates as "dd/mm/yyyy"
  const formatDate = (date) => {
    const day = String(date.getDate()).padStart(2, "0");
    const month = String(date.getMonth() + 1).padStart(2, "0"); // Months are zero-based
    const year = date.getFullYear();
    return `${day}/${month}/${year}`;
  };

  return {
    startDate: formatDate(startOfMonth),
    endDate: formatDate(endOfMonth),
  };
}

function getFirstDateOfCurrentMonth() {
  const now = new Date();
  const year = now.getFullYear();
  const month = String(now.getMonth() + 1).padStart(2, "0"); // Add leading zero if needed
  const day = "01";
  return `${day}-${month}-${year}`;
}

export {
  getFormattedDateStr,
  getFormattedTime,
  getCurrentMonthDates,
  getCurrentMonthDatesStr,
  getPreviousMonthDates,
  getFirstDateOfCurrentMonth,
  getCurrentMonthDate,
};
