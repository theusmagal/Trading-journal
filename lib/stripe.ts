
import Stripe from "stripe";

export const StripePkg = Stripe;

export type StripeSub = Stripe.Subscription;
export const stripe = new Stripe(process.env.STRIPE_SECRET_KEY!);

export function createPortalSession(customerId: string, returnUrl: string) {
  return stripe.billingPortal.sessions.create({
    customer: customerId,
    return_url: returnUrl,
  });
}
