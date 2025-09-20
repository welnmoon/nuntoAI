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

    const baseUrl =
      process.env.NEXT_PUBLIC_BASE_URL ?? process.env.NEXT_PUBLIC_APP_URL;

    if (!baseUrl) {
      return NextResponse.json(
        { error: "Base URL is not configured" },
        { status: 500 }
      );
    }

    const normalizedBaseUrl = baseUrl.startsWith("https")
      ? baseUrl
      : baseUrl.includes("localhost")
      ? `http://${baseUrl}`
      : `https://${baseUrl}`;

    const checkoutSession = await stripe.checkout.sessions.create({
      mode: "subscription",
      line_items: [{ price: price.stripePriceId, quantity: 1 }],
      client_reference_id: userId ? String(userId) : undefined,
      metadata: {
        tariffId: tariff.id,
        tariffSlug: tariff.slug,
      },
      success_url: `${normalizedBaseUrl}/success?session_id={CHECKOUT_SESSION_ID}`,
      cancel_url: `${normalizedBaseUrl}/payment-failed`,
    });

    return NextResponse.json({ sessionId: checkoutSession.id });
  } catch (e: unknown) {
    const message =
      e instanceof Error ? e.message : "Unexpected checkout error";
    console.error("checkout error", e);
    return NextResponse.json(
      { error: message },
      { status: 500 }
    );
  }
}
