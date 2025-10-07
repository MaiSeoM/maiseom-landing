import Stripe from "stripe";

const stripeSecret = process.env.STRIPE_SECRET_KEY;
const webUrl = process.env.WEB_URL || process.env.NEXT_PUBLIC_APP_URL || "http://localhost:3000";
const fallbackCustomer = process.env.STRIPE_TEST_CUSTOMER_ID;

export async function getStripePortalUrl() {
  if (!stripeSecret || !fallbackCustomer) {
    return "https://billing.stripe.com/p/login/test_123";
  }
  const stripe = new Stripe(stripeSecret, { apiVersion: "2023-10-16" });
  const session = await stripe.billingPortal.sessions.create({
    customer: fallbackCustomer,
    return_url: webUrl,
  });
  return session.url;
}
