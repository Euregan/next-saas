import prisma from "@/libs/prisma";
import Stripe from "stripe";
import { IncomingMessage, ServerResponse } from "http";
import raw from "raw-body";
import { add } from "date-fns";

const stripe = new Stripe(process.env.STRIPE_SECRET_KEY as string, {
  apiVersion: "2022-11-15",
});

export const config = { api: { bodyParser: false } };

const handler = async (request: IncomingMessage, response: ServerResponse) => {
  // Retrieve the event by verifying the signature using the raw body and secret.
  let event;

  const body = await raw(request);

  try {
    event = stripe.webhooks.constructEvent(
      body,
      request.headers["stripe-signature"] as string,
      process.env.STRIPE_WEBHOOK_SECRET as string
    );
  } catch (error) {
    console.error(error);
    console.error(`⚠️  Webhook signature verification failed.`);
    response.statusCode = 400;
    return response.end();
  }

  // Extract the object from the event.
  const dataObject = event.data.object;

  // Handle the event
  // Review important events for Billing webhooks
  // https://stripe.com/docs/billing/webhooks
  // Remove comment to see the various objects sent for this sample
  switch (event.type) {
    case "invoice.paid":
      // Used to provision services after the trial has ended.
      // The status of the invoice will show up as paid. Store the status in your
      // database to reference when a user accesses your service to avoid hitting rate limits.
      const invoice = event.data.object as Stripe.Invoice;
      if (typeof invoice.customer !== "string") {
        console.error(
          `Expected invoice to contain a customer, but got ${invoice.customer}`
        );
        response.statusCode = 400;
        return response.end();
      }

      if (invoice.lines.data.length !== 1) {
        console.error(
          `Expected invoice to have exactly one line, but it had ${invoice.lines.data.length}`
        );
        console.error(JSON.stringify(invoice));
        response.statusCode = 400;
        return response.end();
      }
      if (!invoice.lines.data[0].price) {
        console.error("Expected invoice to have a price, but it had none");
        console.error(JSON.stringify(invoice));
        response.statusCode = 400;
        return response.end();
      }
      if (typeof invoice.lines.data[0].price.product !== "string") {
        console.error(
          `Expected invoice to have a product, but it had ${invoice.lines.data[0].price.product}`
        );
        console.error(JSON.stringify(invoice));
        response.statusCode = 400;
        return response.end();
      }

      const product = await stripe.products.retrieve(
        invoice.lines.data[0].price.product
      );

      await prisma.account.update({
        where: {
          stripeId: invoice.customer,
        },
        data: {
          expireDate: add(new Date(), { months: 1 }),
          mbPerMonth: Number(product.metadata.mbPerMonth),
          retentionDays: Number(product.metadata.retentionDays),
          plan: product.name,
        },
      });
      break;
    case "invoice.payment_failed":
      // If the payment fails or the customer does not have a valid payment method,
      //  an invoice.payment_failed event is sent, the subscription becomes past_due.
      // Use this webhook to notify your user that their payment has
      // failed and to retrieve new card details.
      break;
    case "customer.subscription.deleted":
      if (event.request != null) {
        // handle a subscription canceled by your request
        // from above.
      } else {
        // handle subscription canceled automatically based
        // upon your subscription settings.
      }
      break;
    default:
    // Unexpected event type
  }
  response.statusCode = 200;
  return response.end();
};

export default handler;
