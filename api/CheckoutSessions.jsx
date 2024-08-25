import Stripe from "stripe";

const STRIPE_KEY =
  "sk_test_51O4j2pFE5aGTXnHxuJfpiic2Ix9AsgM0N4pnMjEN6Hmyd6Gq6C3qhCOWabIXZm92dp1jIvk8TReCwjog5t5sSxgp00NDyoqV6F";

const stripe = new Stripe(STRIPE_KEY);

export default async function CheckoutSessions(totalPrice, docId) {
  console.log(totalPrice, docId);
  try {
    const session = await stripe.checkout.sessions.create({
      payment_method_types: ["card"],
      line_items: [
        {
          price_data: {
            currency: "aud",
            product: "prod_Q1bIxf0l0quWV4",
            unit_amount: Math.round(totalPrice * 100),
          },
          quantity: 1,
        },
      ],
      mode: "payment",
      success_url: `https://dts.courierssydney.com.au/payment/success/${docId}`,
      cancel_url: `https://dts.courierssydney.com.au/payment/cancel/${docId}`,
    });
    return {
      sessionId: session.id,
      url: session.url,
    };
  } catch (error) {
    console.error("Error fetching invoice:", error);
    return {
      error: "Internal Server Error",
    };
  }
}
