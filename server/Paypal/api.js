"use server";

import axios from "axios";
import { BASE_URL, PAYPAL_CLIENT_ID, PAYPAL_SECRET } from "./credentials";

// Helper function to get access token
export const getAccessToken = async () => {
  try {
    const auth = Buffer.from(`${PAYPAL_CLIENT_ID}:${PAYPAL_SECRET}`).toString(
      "base64"
    );
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
  } catch (error) {
    console.error(
      "Error getting access token:",
      error.response?.data || error.message
    );
    throw new Error("Failed to authenticate with PayPal");
  }
};

// Function to get payout item details
export const getPayout = async (id) => {
  try {
    const accessToken = await getAccessToken();

    const response = await axios.get(
      `${BASE_URL}/v1/payments/payouts/${id}`,
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
      "Error getting payout item:",
      error.response?.data || error.message
    );
    throw new Error(`Failed to retrieve payout item: ${error.message}`);
  }
};
