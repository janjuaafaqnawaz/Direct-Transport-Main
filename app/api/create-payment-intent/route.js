import { NextResponse } from "next/server";
import Stripe from "stripe";

const stripe = new Stripe(
  "sk_test_51OCUhgDkrX1S31jq5IKUBHsrBqVa72TqAEQpx2TVjoXGqsb5gTmKUtPeSR2Y0tR8z9pvJUcqAZaWsaY2qbx9R5uf005p7hrEZk",
  {
    apiVersion: "2023-10-16",
  }
);

export async function POST(request) {
  const { amount } = await request.json();

  try {
    const paymentIntent = await stripe.paymentIntents.create({
      amount: amount * 100,
      currency: "usd",
    });

    console.log(paymentIntent);

    return NextResponse.json({ clientSecret: paymentIntent.client_secret });
  } catch (error) {
    return NextResponse.json({ error: error.message }, { status: 500 });
  }
}
