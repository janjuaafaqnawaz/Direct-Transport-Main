"use server";

import axios from "axios";
import { BASE_URL, PAYPAL_CLIENT_ID, PAYPAL_SECRET } from "./credentials";

export const getAccessToken = async () => {
  const auth = btoa(`${PAYPAL_CLIENT_ID}:${PAYPAL_SECRET}`);
  const response = await axios.post(
    `${BASE_URL}/v1/oauth2/token`,
    "grant_type=client_credentials",
    {
      headers: {
        Authorization: `Basic ${auth}`,
        "Content-Type": "application/x-www-form-urlencoded",
      },
    }
  );
  return response.data.access_token;
};

export const generateInvoiceNumber = async () => {
  try {
    const accessToken = await getAccessToken();

    const response = await fetch(
      "https://api-m.sandbox.paypal.com/v2/invoicing/generate-next-invoice-number",
      {
        method: "POST",
        headers: {
          Authorization: `Bearer ${accessToken}`,
          "Content-Type": "application/json",
        },
      }
    );

    const data = await response.json();
    return data.invoice_number;
  } catch (error) {
    console.error("Error generating invoice number:", error);
    throw error;
  }
};
