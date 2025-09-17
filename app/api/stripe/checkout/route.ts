import { NextRequest, NextResponse } from "next/server";
import stripe from "@/lib/stripe";
import { prisma } from "@/prisma/prisma-client";

export async function POST(req: NextRequest) {
  try {
    const { slug = "pro", interval = "month", userId } = await req.json();
    const tariff = await prisma.tariff.findUnique({
      where: { slug },
      include: {
        prices: {
          where: {
            active: true,
            interval,
          },
        },
      },
    });
    if (!tariff || tariff.prices.length === 0) {
      return NextResponse.json(
        { error: "Tariff/price not found" },
        { status: 404 }
      );
    }

    const price = tariff.prices[0];
    
    // Chekout session
    const checkoutSession = await stripe.checkout.sessions.create({
      mode: "subscription",
      line_items: [{ price: price.stripePriceId, quantity: 1 }],
      client_reference_id: userId ? String(userId) : undefined,
      metadata: {
        tariffId: tariff.id,
        tariffSlug: tariff.slug,
      },
      success_url: `${process.env.NEXT_PUBLIC_BASE_URL}/success?session_id={CHECKOUT_SESSION_ID}`,
      cancel_url: `${process.env.NEXT_PUBLIC_BASE_URL}/payment-failed`,
    });

    return NextResponse.json({ url: checkoutSession.url });
  } catch (e: any) {
    console.error("checkout error", e);
    return NextResponse.json(
      { error: e.message ?? "Internal error" },
      { status: 500 }
    );
  }
}
