import emailjs from "emailjs-com";

async function sendResetPasswordEmail(email, password) {
  try {
    const templateParams = {
      email: email,
      password: password,
    };

    await emailjs.send(
      "service_i9cmmnr", // Your service ID from email.js
      "template_brkzqd7", // Your template ID from email.js
      templateParams,
      "vYni03aqa3sHW_yf9" // Your user ID from email.js
    );

    console.log("Email sent successfully");
    alert("Email sent successfully")
    return true;
  } catch (error) {
    console.error("Error while processing data:", error);
    return null; // Return null to indicate error
  }
}

export default sendResetPasswordEmail;
