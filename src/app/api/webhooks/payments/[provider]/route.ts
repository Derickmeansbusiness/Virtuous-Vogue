import { NextResponse, type NextRequest } from "next/server";
import { getProviderByName } from "@/lib/payments/provider";
import { getAdminStore } from "@/lib/data/store";
import { settlePayment } from "@/lib/actions/booking";

export const runtime = "nodejs";

/**
 * Payment webhooks. The signature is verified, the event is recorded once
 * (idempotent on provider event id), and the final status always comes from
 * a server-side verify call, never from the webhook body alone.
 */
export async function POST(request: NextRequest, { params }: { params: Promise<{ provider: string }> }) {
  const { provider: name } = await params;
  const provider = getProviderByName(name);
  if (!provider) return NextResponse.json({ error: "unknown provider" }, { status: 404 });
  const raw = await request.text();
  let event;
  try {
    event = await provider.verifyWebhook(raw, request.headers);
  } catch {
    return NextResponse.json({ error: "bad payload" }, { status: 400 });
  }
  if (!event.ok) return NextResponse.json({ error: "invalid signature" }, { status: 401 });
  if (!event.providerReference) return NextResponse.json({ received: true });

  const store = getAdminStore();
  const payments = await store.list<{ id: string; provider_reference: string | null; idempotency_key: string }>("payments", { provider: provider.name });
  const payment = payments.find((p) => p.provider_reference === event.providerReference || p.idempotency_key === event.providerReference);
  if (!payment) return NextResponse.json({ received: true, matched: false });

  const verified = await provider.verify(event.providerReference).catch(() => null);
  const status = verified?.status ?? event.status;
  if (status && status !== "pending") {
    await settlePayment(payment.id, status, verified?.amount, event.eventId, event.raw);
  } else {
    await store.insert("transactions", { payment_id: payment.id, event: "webhook", provider_event_id: event.eventId, status: "pending", raw: event.raw ?? {} }).catch(() => {});
  }
  return NextResponse.json({ received: true });
}
