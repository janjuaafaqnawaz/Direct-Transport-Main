export const validateFutureDateTime = (invoice) => {
  const invoiceDateStr = invoice.date; // "08/05/2025" (DD/MM/YYYY)
  const invoiceTimeStr = invoice.time; // "8:31 AM"

  // --- 1. Get Current Date and Time ---
  const now = new Date(); // Gets the current date and time with milliseconds

  // --- 2. Parse Invoice Date and Time ---
  // Parse date (assuming format is DD/MM/YYYY)
  const [invoiceDay, invoiceMonth, invoiceYear] = invoiceDateStr
    .split("/")
    .map(Number);

  // Create date object (months are 0-indexed in JS)
  const invoiceDateObj = new Date(invoiceYear, invoiceMonth - 1, invoiceDay);

  // Parse time
  let [timePart, ampm] = invoiceTimeStr.split(" ");
  let [invoiceHours, invoiceMinutes] = timePart.split(":").map(Number);

  // Convert to 24-hour format
  if (ampm.toLowerCase() === "pm" && invoiceHours !== 12) {
    invoiceHours += 12;
  } else if (ampm.toLowerCase() === "am" && invoiceHours === 12) {
    invoiceHours = 0; // Midnight case
  }

  // Set the exact time (including seconds and milliseconds)
  invoiceDateObj.setHours(invoiceHours, invoiceMinutes, 0, 0);

  // --- 3. Validate Future DateTime ---
  let errorMessages = [];

  // Compare timestamps (milliseconds since epoch)
  if (invoiceDateObj.getTime() <= now.getTime()) {
    errorMessages.push(
      "Error: Invoice date and time must be in the future (current time is " +
        now.toString() +
        ")"
    );
  }

  // --- 4. Handle Errors ---
  if (errorMessages.length > 0) {
    console.error("Validation Failed:");
    errorMessages.forEach((msg) => alert(msg));
    return false;
  }

  console.log("Validation Passed: Invoice datetime is in the future");
  return true;
};

// Example test case (run this when testing)
export const testValidation = () => {
  const now = new Date();
  console.log("Current time:", now.toString());

  // Test with a time 1 minute in the past (should fail)
  const pastTime = new Date(now.getTime() - 60000); // now minus 1 minute
  const pastHours =
    pastTime.getHours() > 12 ? pastTime.getHours() - 12 : pastTime.getHours();
  const pastAmPm = pastTime.getHours() >= 12 ? "PM" : "AM";

  const pastInvoice = {
    date: `${pastTime.getDate().toString().padStart(2, "0")}/${(
      pastTime.getMonth() + 1
    )
      .toString()
      .padStart(2, "0")}/${pastTime.getFullYear()}`,
    time: `${pastHours}:${pastTime
      .getMinutes()
      .toString()
      .padStart(2, "0")} ${pastAmPm}`,
  };

  console.log("\nTesting with past time:", pastInvoice.date, pastInvoice.time);
  console.log("Should fail:");
  validateFutureDateTime(pastInvoice);

  // Test with a time 1 minute in the future (should pass)
  const futureTime = new Date(now.getTime() + 60000); // now plus 1 minute
  const futureHours =
    futureTime.getHours() > 12
      ? futureTime.getHours() - 12
      : futureTime.getHours();
  const futureAmPm = futureTime.getHours() >= 12 ? "PM" : "AM";

  const futureInvoice = {
    date: `${futureTime.getDate().toString().padStart(2, "0")}/${(
      futureTime.getMonth() + 1
    )
      .toString()
      .padStart(2, "0")}/${futureTime.getFullYear()}`,
    time: `${futureHours}:${futureTime
      .getMinutes()
      .toString()
      .padStart(2, "0")} ${futureAmPm}`,
  };

  console.log(
    "\nTesting with future time:",
    futureInvoice.date,
    futureInvoice.time
  );
  console.log("Should pass:");
  validateFutureDateTime(futureInvoice);
};

// Uncomment to run tests
// testValidation();
