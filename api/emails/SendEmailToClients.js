import emailjs from "emailjs-com";

async function SendEmailToClients(toEmail) {
  try {
    const templateParams = {
      toEmail: toEmail,
      url: `https://dts.courierssydney.com.au/ClientServices/monthly_invoices_history/${toEmail}`,
    };

    await emailjs.send(
      "service_i9cmmnr", // Your service ID from email.js
      "template_mgshxy4", // Your template ID from email.js
      templateParams,
      "vYni03aqa3sHW_yf9" // Your user ID from email.js
    );

    console.log("Email sent successfully");
    return true;
  } catch (error) {
    console.error("Error while processing data:", error);
    return null; // Return null to indicate error
  }
}

export default SendEmailToClients;
