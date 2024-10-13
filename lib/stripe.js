import { loadStripe } from "@stripe/stripe-js";

const stripePromise = loadStripe(
  "pk_test_51OCUhgDkrX1S31jquC991u7GCVxn9QhASplr05nYt5AXcIBrr1WgvowkbrLSUyWALHPCBm5LYN444HC6EB62CAXE00jacnUoX3"
);

export default stripePromise;
