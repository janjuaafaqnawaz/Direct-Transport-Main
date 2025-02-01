import axios from "axios";
import React from "react";

export default async function CreateDraftInvoice() {
  try {
    const response = await axios({
      url: "https://api-m.sandbox.paypal.com/v2/invoicing/invoices",
      method: "POST",
      headers: {
        Authorization: "Bearer zekwhYgsYYI0zDg0p_Nf5v78VelCfYR0", // Replace with your valid OAuth token
        "Content-Type": "application/json",
        Prefer: "return=representation",
      },
      data: {
        detail: {
          invoice_number: "#123",
          reference: "deal-ref",
          invoice_date: "2018-11-12",
          currency_code: "USD",
          note: "Thank you for your business.",
          term: "No refunds after 30 days.",
          memo: "This is a long contract",
          payment_term: { term_type: "NET_10", due_date: "2018-11-22" },
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

        amount: {
          breakdown: {
            custom: {
              label: "Packing Charges",
              amount: { currency_code: "USD", value: "10.00" },
            },
            shipping: {
              amount: { currency_code: "USD", value: "10.00" },
              tax: { name: "Sales Tax", percent: "7.25" },
            },
            discount: { invoice_discount: { percent: "5" } },
          },
        },
      },
    });

    console.log("Invoice created successfully", response.data);
    return response.data;
  } catch (error) {
    console.error("Error creating invoice", error);
  }
}
