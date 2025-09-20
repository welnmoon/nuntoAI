import Stripe from "stripe";
import { NextRequest } from "next/server";
import { Prisma } from "@prisma/client";
import { prisma } from "@/prisma/prisma-client";

type InvoiceWithExtras = Stripe.Invoice & {
  payment_intent?: string | Stripe.PaymentIntent | null;
  subscription?: string | Stripe.Subscription | null;
};

export const runtime = "nodejs";

const stripe = new Stripe(process.env.STRIPE_SECRET_KEY!, {
  apiVersion: "2025-08-27.basil",
});

export async function POST(req: NextRequest) {
  const sig = req.headers.get("stripe-signature");
  if (!sig) return new Response("Missing signature", { status: 400 });

  const whSecret = process.env.STRIPE_WEBHOOK_SECRET!;
  const rawBody = await req.text();

  let event: Stripe.Event;
  try {
    event = stripe.webhooks.constructEvent(rawBody, sig, whSecret);
  } catch (err: unknown) {
    const message = err instanceof Error ? err.message : "Unknown";
    return new Response(`Invalid signature: ${message}`, { status: 400 });
  }

  try {
    switch (event.type) {
      case "checkout.session.completed": {
        const s = event.data.object as Stripe.Checkout.Session;
        const sessionId = s.id;
        const amount = s.amount_total ?? 0;
        const currency = s.currency ?? "kzt";
        const userId = s.client_reference_id
          ? Number(s.client_reference_id)
          : null;

        if (!userId) {
          console.error(
            `checkout.session.completed without client_reference_id: ${sessionId}`
          );
          break;
        }

        const decimalAmount = amount
          ? new Prisma.Decimal(amount).dividedBy(100)
          : new Prisma.Decimal(0);

        await prisma.payment.upsert({
          where: { stripeSessionId: sessionId },
          create: {
            userId,
            status: "SUCCEEDED",
            amount: decimalAmount,
            currency,
            stripeSessionId: sessionId,
          },
          update: {
            status: "SUCCEEDED",
            amount: decimalAmount,
            currency,
          },
        });

        break;
      }

      case "invoice.paid": {
        const inv = event.data.object as InvoiceWithExtras;
        const customerId = inv.customer as string;
        const amount = inv.amount_paid ?? 0;
        const currency = inv.currency ?? "kzt";
        const decimalAmount = amount
          ? new Prisma.Decimal(amount).dividedBy(100)
          : new Prisma.Decimal(0);
        const paymentIntentId =
          typeof inv.payment_intent === "string"
            ? inv.payment_intent
            : inv.payment_intent?.id ?? null;

        if (!paymentIntentId) {
          console.error(
            `invoice.paid missing payment_intent: ${inv.id}`
          );
          break;
        }

        const subscriptionId =
          typeof inv.subscription === "string"
            ? inv.subscription
            : inv.subscription?.id ?? null;

        const subscription = subscriptionId
          ? await prisma.subscription.findUnique({
              where: { stripeSubscriptionId: subscriptionId },
            })
          : await prisma.subscription.findFirst({
              where: { stripeCustomerId: customerId },
            });

        if (!subscription) {
          console.error(
            `invoice.paid subscription not found for customer ${customerId}`
          );
          break;
        }

        const period = inv.lines?.data?.[0]?.period;
        const periodStart = period?.start
          ? new Date(period.start * 1000)
          : undefined;
        const periodEnd = period?.end ? new Date(period.end * 1000) : undefined;

        await prisma.subscription.update({
          where: { id: subscription.id },
          data: {
            status: "active",
            currentPeriodStart: periodStart,
            currentPeriodEnd: periodEnd,
          },
        });

        await prisma.payment.upsert({
          where: { stripePaymentIntentId: paymentIntentId },
          create: {
            userId: subscription.userId,
            status: "SUCCEEDED",
            amount: decimalAmount,
            currency,
            stripePaymentIntentId: paymentIntentId,
          },
          update: {
            status: "SUCCEEDED",
            amount: decimalAmount,
            currency,
          },
        });

        break;
      }

      case "invoice.payment_failed": {
        const inv = event.data.object as InvoiceWithExtras;
        const customerId = inv.customer as string;
        const paymentIntentId =
          typeof inv.payment_intent === "string"
            ? inv.payment_intent
            : inv.payment_intent?.id ?? null;

        const subscriptionId =
          typeof inv.subscription === "string"
            ? inv.subscription
            : inv.subscription?.id ?? null;

        const subscription = subscriptionId
          ? await prisma.subscription.findUnique({
              where: { stripeSubscriptionId: subscriptionId },
            })
          : await prisma.subscription.findFirst({
              where: { stripeCustomerId: customerId },
            });

        if (subscription) {
          await prisma.subscription.update({
            where: { id: subscription.id },
            data: { status: "past_due" },
          });

          if (paymentIntentId) {
            const amountDue = inv.amount_due ?? 0;
            const decimalAmount = amountDue
              ? new Prisma.Decimal(amountDue).dividedBy(100)
              : new Prisma.Decimal(0);

            await prisma.payment.upsert({
              where: { stripePaymentIntentId: paymentIntentId },
              create: {
                userId: subscription.userId,
                status: "FAILED",
                amount: decimalAmount,
                currency: inv.currency ?? "kzt",
                stripePaymentIntentId: paymentIntentId,
              },
              update: {
                status: "FAILED",
                amount: decimalAmount,
                currency: inv.currency ?? "kzt",
              },
            });
          }
        }

        break;
      }

      default:
        break;
    }

    return new Response(null, { status: 200 });
  } catch (e) {
    console.error("Webhook error:", e);
    return new Response("Server error", { status: 500 });
  }
}
