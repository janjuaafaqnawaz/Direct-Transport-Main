"use server";

import axios from "axios";
import { generateInvoiceNumber, getAccessToken } from "./api";
import { BASE_URL } from "./credentials";

export default async function sendInvoice(
  finalDriverPay,
  pdfId,
  firstName,
  payPalEmail,
  datesRange
) {
  const accessToken = await getAccessToken();
  const invoiceNumber = pdfId;

  const currentDate = new Date().toISOString().split("T")[0];
  const dueDate = new Date();
  dueDate.setDate(dueDate.getDate() + 10);
  const formattedDueDate = dueDate.toISOString().split("T")[0];

  try {
    const invoiceData = {
      detail: {
        invoice_number: invoiceNumber.slice(1),
        reference: "deal-ref",
        invoice_date: currentDate,
        currency_code: "AUD",
        note: "Thank you for your business.",
        terms_and_conditions: "No refunds after 10 days.",
        memo: "This is a long contract",
        payment_term: { term_type: "NET_10", due_date: formattedDueDate },
      },
      invoicer: {
        name: { given_name: "Direct Transport Solutions Pty Ltd", surname: "" },
        address: {
          address_line_1: "ABN 87 658 348 808",
          address_line_2: "1353 The Horsley Dr, Wetherill Park NSW 2164",
          admin_area_1: "(02) 9030 0333",
          country_code: "AU",
        },
        email_address: "sb-ttuuv36087370@business.example.com",
      },
      primary_recipients: [
        {
          billing_info: {
            name: { given_name: firstName, surname: "" },
            email_address: payPalEmail,
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

    // Create the invoice
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

    const invoiceUrl = createResponse.data.href;
    const invoiceId = invoiceUrl.split("/").pop();
    console.log("Invoice created successfully!");

    // Send the invoice
    const sendResponse = await axios.post(
      `${BASE_URL}/v2/invoicing/invoices/${invoiceId}/send`,
      {},
      {
        headers: {
          Authorization: `Bearer ${accessToken}`,
        },
      }
    );

    console.log("Invoice sent successfully!");
    return {
      success: true,
      message: "Invoice created and sent successfully!",
      data: sendResponse.data,
      invoiceId,
    };
  } catch (error) {
    console.error(
      "Error in invoice process:",
      error.response?.data || error.message
    );
    return {
      success: false,
      message: "Failed to create or send invoice.",
      error: error.response?.data || error.message,
    };
  }
}
