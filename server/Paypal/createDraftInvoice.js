"use server";

import axios from "axios";
import { GenerateInvoiceNumber, getAccessToken } from "./api";
import { BASE_URL } from "./credentials";

export default async function sendInvoice(pdf) {
  const accessToken = await getAccessToken();
  const invoiceNumber = await GenerateInvoiceNumber();

  console.log({
    accessToken,
    invoiceNumber,
  });

  const currentDate = new Date().toISOString().split("T")[0]; // Today's date
  const dueDate = new Date();
  dueDate.setDate(dueDate.getDate() + 10); // NET_10 means 10 days from now
  const formattedDueDate = dueDate.toISOString().split("T")[0];

  try {
    const invoiceData = {
      detail: {
        invoice_number: invoiceNumber,
        reference: "deal-ref",
        invoice_date: currentDate,
        currency_code: "USD",
        note: "Thank you for your business.",
        terms_and_conditions: "No refunds after 10 days.",
        memo: "This is a long contract",
        payment_term: { term_type: "NET_10", due_date: formattedDueDate },
      },
      invoicer: {
        name: { given_name: "David", surname: "Larusso" },
        address: {
          address_line_1: "1234 First Street",
          address_line_2: "337673 Hillside Court",
          admin_area_2: "Anytown",
          admin_area_1: "CA",
          postal_code: "98765",
          country_code: "US",
        },
        email_address: "merchant@example.com",
      },
      primary_recipients: [
        {
          billing_info: {
            name: { given_name: "John", surname: "Doe" },
            email_address: "customer@example.com",
          },
        },
      ],
      items: [
        {
          name: "Web Development Service",
          quantity: 1,
          unit_amount: { currency_code: "USD", value: "500.00" },
          tax: { name: "Sales Tax", percent: "7.25" },
        },
      ],
      configuration: {
        allow_tip: false,
        tax_calculated_after_discount: true,
        tax_inclusive: false,
      },
    };

    const response = await axios.post(
      `${BASE_URL}/v2/invoicing/invoices`,
      invoiceData,
      {
        headers: {
          Authorization: `Bearer ${accessToken}`,
          "Content-Type": "application/json",
        },
      }
    );

    const invoiceId = response.data.id;
    console.log("Invoice created:", response.data);

    // Sending the invoice
    await axios.post(
      `${BASE_URL}/v2/invoicing/invoices/${invoiceId}/send`,
      {},
      {
        headers: {
          Authorization: `Bearer ${accessToken}`,
        },
      }
    );

    console.log("Invoice sent successfully!");
    return response.data;
  } catch (error) {
    console.error("Error creating invoice:", error.response?.data || error);
  }
}
