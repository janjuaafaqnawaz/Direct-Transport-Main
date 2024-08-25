function formatDateCurr(date) {
  const day = date.getDate().toString().padStart(2, "0");
  const month = (date.getMonth() + 1).toString().padStart(2, "0");
  const year = date.getFullYear();

  return `${day}/${month}/${year}`;
}

function formatTimeCurr(date) {
  let hours = date.getHours();
  const minutes = date.getMinutes();
  const ampm = hours >= 12 ? "PM" : "AM";
  hours = hours % 12;
  hours = hours ? hours : 12; // Handle midnight case

  const formattedTime = `${hours}:${minutes
    .toString()
    .padStart(2, "0")} ${ampm}`;
  return formattedTime;
}

// Get current date and time
const currentDate = new Date();

// Format date
const formattedDateCurrent = formatDateCurr(currentDate);

// Format time
const formattedTimeCurrent = formatTimeCurr(currentDate);

// console.log(`Date: ${formattedDateCurrent}`); // e.g., Date: 17/07/2024
// console.log(`Time: ${formattedTimeCurrent}`); // e.g., Time: 12:00 AM

// Function to format date as dd/mm/yyyy
function formatDate(dateObject) {
  const day = dateObject.day < 10 ? "0" + dateObject.day : dateObject.day;
  const month =
    dateObject.month < 10 ? "0" + dateObject.month : dateObject.month;
  const year = dateObject.year;
  return `${day}/${month}/${year}`;
}

// Function to format time as 12-hour format with AM/PM
function formatTime(timeObject) {
  let hour = timeObject.hour;
  const minute =
    timeObject.minute < 10 ? "0" + timeObject.minute : timeObject.minute;
  const period = hour >= 12 ? "PM" : "AM";
  hour = hour % 12 || 12;
  return `${hour}:${minute} ${period}`;
}

export { formatDate, formatTime, formattedDateCurrent, formattedTimeCurrent };
