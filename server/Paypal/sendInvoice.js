"use server";

import axios from "axios";
import { deleteInvoice, generateInvoiceNumber, getAccessToken } from "./api";
import { BASE_URL } from "./credentials";
import toast from "react-hot-toast";

export default async function sendInvoice(
  finalDriverPay,
  pdfId,
  firstName,
  payPalEmail,
  datesRange
) {
  let accessToken;
  try {
    accessToken = await getAccessToken();
  } catch (error) {
    console.error("Failed to get access token:", error);

    return {
      success: false,
      message: "Failed to get access token.",
      error: error.message,
    };
  }

  const invoiceNumber = pdfId;
  const currentDate = new Date().toISOString().split("T")[0];
  const dueDate = new Date();
  dueDate.setDate(dueDate.getDate() + 10);
  const formattedDueDate = dueDate.toISOString().split("T")[0];

  let invoiceId = null;

  try {
    const invoiceData = {
      detail: {
        invoice_number: invoiceNumber,
        reference: "deal-ref",
        invoice_date: currentDate,
        currency_code: "AUD",
        note: "Thank you for your business.",
        terms_and_conditions: "No refunds after 10 days.",
        memo: "This is a long contract",
        payment_term: { term_type: "NET_10", due_date: formattedDueDate },
      },
      invoicer: {
        name: { given_name: firstName, surname: "" }, // Recipient of the payment
        email_address: payPalEmail, // PayPal account that will receive payment
      },
      primary_recipients: [
        {
          billing_info: {
            name: {
              given_name: "Direct Transport Solutions Pty Ltd",
              surname: "",
            },
            email_address: "accounts@directtransport.com.au", // The one who pays
          },
        },
      ],
      items: [
        {
          name: `${datesRange.start} - ${datesRange.end}`,
          unit_amount: { currency_code: "AUD", value: finalDriverPay },
          quantity: 1,
        },
      ],
      configuration: {
        allow_tip: false,
        tax_calculated_after_discount: true,
        tax_inclusive: false,
      },
    };

    console.log("Creating invoice...");
    const createResponse = await axios.post(
      `${BASE_URL}/v2/invoicing/invoices`,
      invoiceData,
      {
        headers: {
          Authorization: `Bearer ${accessToken}`,
          "Content-Type": "application/json",
        },
      }
    );

    console.log("Invoice created successfully!", createResponse.data);
    await new Promise((resolve) => setTimeout(resolve, 3000));

    const invoiceUrl = createResponse.data.href;
    invoiceId = invoiceUrl.split("/").pop();

    console.log(`Invoice ID: ${invoiceId}, sending invoice...`);
    const sendResponse = await axios.post(
      `${BASE_URL}/v2/invoicing/invoices/${invoiceId}/send`,
      {},
      {
        headers: {
          Authorization: `Bearer ${accessToken}`,
          "Content-Type": "application/json",
        },
      }
    );

    console.log("Invoice sent successfully!", sendResponse.data);

    return {
      success: true,
      message: "Invoice created and sent successfully!",
      data: sendResponse.data,
      invoiceId,
    };
  } catch (error) {
    const errorPayPal = error.response?.data;

    console.error(
      "Error in invoice process:",
      errorPayPal.details[0].description
    );

    if (invoiceId) {
      console.log(`Deleting invoice with ID: ${invoiceId}`);
      try {
        await deleteInvoice(invoiceId);
      } catch (deleteError) {
        console.error("Failed to delete invoice:", deleteError);
      }
    }

    return {
      success: false,
      message: "Failed to create or send invoice.",
      error: errorPayPal,
    };
  }
}
