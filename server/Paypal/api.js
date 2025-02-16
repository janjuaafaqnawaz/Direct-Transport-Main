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
      `${BASE_URL}/v2/invoicing/generate-next-invoice-number`,
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

export const getInvoice = async (id) => {
  console.log(id);

  try {
    const accessToken = await getAccessToken();

    const response = await axios.get(
      `${BASE_URL}/v2/invoicing/invoices/${id}`,
      {
        headers: {
          Authorization: `Bearer ${accessToken}`,
          "Content-Type": "application/json",
        },
      }
    );

    return response.data;
  } catch (error) {
    console.error(
      "Error fetching invoice details:",
      error.response?.data || error.message
    );
    throw error;
  }
};

export const deleteInvoice = async (id) => {
  try {
    console.log(`Attempting to delete invoice with ID: ${id}`);

    const accessToken = await getAccessToken();
    console.log("Access token retrieved successfully.");

    const response = await axios.delete(
      `${BASE_URL}/v2/invoicing/invoices/${id}`,
      {
        headers: {
          Authorization: `Bearer ${accessToken}`,
          "Content-Type": "application/json",
        },
      }
    );

    console.log("Invoice deleted successfully:", response.data);

    return response.data;
  } catch (error) {
    console.error(
      "Error deleting invoice:",
      error.response?.data || error.message
    );
    throw error;
  }
};
