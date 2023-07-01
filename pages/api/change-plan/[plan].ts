import Result from "@/libs/Result";
import { authentified, handle } from "@/libs/endpoint";
import Stripe from "stripe";
import { z } from "zod";

const stripe = new Stripe(process.env.STRIPE_SECRET_KEY as string, {
  apiVersion: "2022-11-15",
});

export default handle({
  post: authentified(
    async (user, { plan: priceId }) => {
      // Create the subscription. Note we're expanding the Subscription's
      // latest invoice and that invoice's payment_intent
      // so we can pass it to the front end to confirm the payment
      const [subscription, price] = await Promise.all([
        stripe.subscriptions.create({
          customer: user.accountId,
          items: [
            {
              price: priceId,
            },
          ],
          payment_behavior: "default_incomplete",
          payment_settings: { save_default_payment_method: "on_subscription" },
          expand: ["latest_invoice.payment_intent"],
        }),
        stripe.prices.retrieve(priceId, {
          expand: ["product"],
        }),
      ]);

      return Result.ok({
        subscriptionId: subscription.id,
        clientSecret: (
          (subscription.latest_invoice as Stripe.Invoice)
            ?.payment_intent as Stripe.PaymentIntent
        )?.client_secret,
        name: (price.product as Stripe.Product).name,
        price: (price.unit_amount || 0) / 100,
        currency: price.currency,
        mbPerMonth: Number(
          (price.product as Stripe.Product).metadata.mbPerMonth
        ),
        retentionDays: Number(
          (price.product as Stripe.Product).metadata.retentionDays
        ),
      });
    },
    z.object({
      plan: z.string(),
    })
  ),
});
