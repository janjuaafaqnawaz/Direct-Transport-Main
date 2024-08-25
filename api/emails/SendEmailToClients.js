import emailjs from "emailjs-com";

async function SendEmailToClients(toEmail) {
  try {
    const templateParams = {
      toEmail: toEmail,
      url: `https://dts.courierssydney.com.au/ClientServices/monthly_invoices_history/${toEmail}`,
    };

    await emailjs.send(
      "service_f67p0db", // Your service ID from email.js
      "template_yg9cora", // Your template ID from email.js
      templateParams,
      "Mo93nAQPsQ-HJMrAi" // Your user ID from email.js
    );

    console.log("Email sent successfully");
    return true;
  } catch (error) {
    console.error("Error while processing data:", error);
    return null; // Return null to indicate error
  }
}

export default SendEmailToClients;
