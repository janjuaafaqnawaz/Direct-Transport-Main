"use server";

import axios from "axios";
import { getAccessToken } from "./api";
import { BASE_URL } from "./credentials";

export default async function sendPayout(
  finalDriverPay,
  pdfId,
  firstName,
  email
) {
  const accessToken = await getAccessToken();

  try {
    const payoutData = {
      sender_batch_header: {
        sender_batch_id: `batch_${pdfId}`,
        email_subject: "You have a payout!",
        email_message: `Hi ${firstName}, you have received a payout! Thanks for using our service!`,
      },
      items: [
        {
          recipient_type: "EMAIL",
          amount: {
            // value: "10",
            value: finalDriverPay.toString(),
            currency: "USD",
          },
          note: `Payment for your services.`,
          sender_item_id: `item_${pdfId}`,
          receiver: email,
          notification_language: "en-US",
        },
      ],
    };

    // Send the payout request
    const payoutResponse = await axios.post(
      `${BASE_URL}/v1/payments/payouts`,
      payoutData,
      {
        headers: {
          Authorization: `Bearer ${accessToken}`,
          "Content-Type": "application/json",
          "PayPal-Request-Id": `payout_${pdfId}`,
        },
      }
    );

    console.log("Payout sent successfully!");
    return {
      success: true,
      message: "Payout sent successfully!",
      data: payoutResponse.data,
    };
  } catch (error) {
    console.error(
      "Error in payout process:",
      error.response?.data || error.message
    );
    return {
      success: false,
      message: "Failed to send payout.",
      error: error.response?.data || error.message,
    };
  }
}
