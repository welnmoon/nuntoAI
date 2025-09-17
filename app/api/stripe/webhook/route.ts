import stripe from "@/lib/stripe";
import { markProcessed, markReceived } from "@/lib/webhooks";
import { NextRequest, NextResponse } from "next/server";
import Stripe from "stripe";

export async function POST(req: NextRequest) {
  const sig = req.headers.get("stripe-signature")!;
  if (!sig) return new NextResponse("No signature", { status: 400 });

  const whSecret = process.env.STRIPE_WEBHOOK_SECRET; // TODO - Получи секрет
  const rawBody = await req.text();

  let event: Stripe.Event;

  try {
    event = stripe.webhooks.constructEvent(rawBody, sig, whSecret!);
    // ts-ignore
  } catch (e: any) {
    return new NextResponse(`Webhook Error: ${e.message}`, { status: 400 });
  }

  const receipt = await markReceived(event.id, event.type);
  if (!receipt) {
    return new NextResponse(null, { status: 200 });
  }

  try {
    switch (event.type) {
      case "checkout.session.completed": {
        const session = event.data.object as Stripe.Checkout.Session;
        // TODO - Обработай успешную оплату
        break;
      }
      case "invoice.paid": {
        const invoice = event.data.object as Stripe.Invoice;
        // TODO - Обработай успешную оплату по подписке
        break;
      }
      case "invoice.payment_failed": {
        const invoice = event.data.object as Stripe.Invoice;
        // TODO - Обработай неуспешную оплату по подписке
        break;
      }
      case "customer.subscription.deleted": {
        const subscription = event.data.object as Stripe.Subscription;
        // TODO - Обработай отмену подписки
        break;
      }
      default:
        console.log(`Unhandled event type ${event.type}`);
        break;
    }
    await markProcessed(event.id);
    return new Response(null, { status: 200 });
  } catch (e) {
    return new Response(`Webhook handler failed: ${e}`, { status: 500 });
  }
}
