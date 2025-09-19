import { loadStripe } from "@stripe/stripe-js";

type PayOptions = {
  slug?: string;
  interval?: string;
  userId?: number;
};

export async function pay(options: PayOptions = {}) {
  const publishableKey = process.env.NEXT_PUBLIC_STRIPE_PUBLISHABLE_KEY;
  if (!publishableKey) {
    throw new Error("Stripe publishable key is not configured");
  }

  const stripe = await loadStripe(publishableKey);
  if (!stripe) {
    throw new Error("Failed to load Stripe.js");
  }

  const response = await fetch("/api/stripe/checkout", {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify(options),
  });

  const payload = await response.json();
  if (!response.ok) {
    throw new Error(payload.error ?? "Failed to create checkout session");
  }

  const sessionId: string | undefined = payload.sessionId;
  if (!sessionId) {
    throw new Error("Stripe sessionId is missing in the response");
  }

  const { error } = await stripe.redirectToCheckout({ sessionId });
  if (error) {
    throw error;
  }
}
