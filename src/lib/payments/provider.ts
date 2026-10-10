import "server-only";
import { createHmac, timingSafeEqual } from "node:crypto";

/**
 * Payment provider abstraction. Business logic never references a gateway
 * directly; it asks for a provider by capability (mobile money for XAF,
 * cards for international). Every provider verifies server-side and
 * reports a normalised status.
 */
export type PaymentMethod = "mtn_momo" | "orange_money" | "card";
export type NormalisedStatus = "pending" | "succeeded" | "failed" | "cancelled";

export type InitiateInput = {
  paymentId: string;
  idempotencyKey: string;
  amount: number;
  currency: "XAF" | "USD" | "EUR";
  method: PaymentMethod;
  customer: { email: string; name: string; phone?: string };
  description: string;
  returnUrl: string;
  metadata: Record<string, string>;
};

export type InitiateResult =
  | { kind: "redirect"; url: string; providerReference: string }
  | { kind: "push"; providerReference: string; instructions: string }
  | { kind: "none"; providerReference: string };

export interface PaymentProvider {
  name: "flutterwave" | "campay" | "stripe" | "manual";
  supports(method: PaymentMethod, currency: string): boolean;
  initiate(input: InitiateInput): Promise<InitiateResult>;
  verify(providerReference: string): Promise<{ status: NormalisedStatus; amount?: number; currency?: string; raw: unknown }>;
  verifyWebhook(rawBody: string, headers: Headers): Promise<{ ok: boolean; eventId: string; providerReference: string | null; status: NormalisedStatus | null; raw: unknown }>;
}

/* ------------------------------------------------------------ Flutterwave */
function flutterwave(): PaymentProvider {
  const secret = process.env.FLUTTERWAVE_SECRET_KEY!;
  const base = "https://api.flutterwave.com/v3";
  const headers = { Authorization: `Bearer ${secret}`, "content-type": "application/json" };
  return {
    name: "flutterwave",
    supports(method, currency) {
      if (currency === "XAF") return method === "mtn_momo" || method === "orange_money" || method === "card";
      return method === "card";
    },
    async initiate(input) {
      if (input.method === "card") {
        const res = await fetch(`${base}/payments`, {
          method: "POST",
          headers,
          body: JSON.stringify({
            tx_ref: input.idempotencyKey,
            amount: input.amount,
            currency: input.currency,
            redirect_url: input.returnUrl,
            customer: { email: input.customer.email, name: input.customer.name, phonenumber: input.customer.phone },
            customizations: { title: "Virtuous Vogue", description: input.description },
            meta: input.metadata,
          }),
        });
        const json = (await res.json()) as { status: string; data?: { link: string }; message?: string };
        if (json.status !== "success" || !json.data?.link) throw new Error(json.message ?? "flutterwave initiate failed");
        return { kind: "redirect", url: json.data.link, providerReference: input.idempotencyKey };
      }
      // Mobile money (Cameroon): charges/?type=mobile_money_franco
      const res = await fetch(`${base}/charges?type=mobile_money_franco`, {
        method: "POST",
        headers,
        body: JSON.stringify({
          tx_ref: input.idempotencyKey,
          amount: input.amount,
          currency: "XAF",
          country: "CM",
          email: input.customer.email,
          phone_number: input.customer.phone,
          fullname: input.customer.name,
          network: input.method === "mtn_momo" ? "MTN" : "ORANGE",
          redirect_url: input.returnUrl,
          meta: input.metadata,
        }),
      });
      const json = (await res.json()) as { status: string; data?: { id?: number; flw_ref?: string }; meta?: { authorization?: { redirect?: string; mode?: string } }; message?: string };
      if (json.status !== "success") throw new Error(json.message ?? "flutterwave momo failed");
      const redirect = json.meta?.authorization?.redirect;
      if (redirect) return { kind: "redirect", url: redirect, providerReference: input.idempotencyKey };
      return { kind: "push", providerReference: input.idempotencyKey, instructions: "Approve the payment prompt on your phone." };
    },
    async verify(ref) {
      const res = await fetch(`${base}/transactions/verify_by_reference?tx_ref=${encodeURIComponent(ref)}`, { headers });
      const json = (await res.json()) as { status: string; data?: { status: string; amount: number; currency: string } };
      const s = json.data?.status;
      const status: NormalisedStatus = s === "successful" ? "succeeded" : s === "failed" ? "failed" : s === "cancelled" ? "cancelled" : "pending";
      return { status, amount: json.data?.amount, currency: json.data?.currency, raw: json };
    },
    async verifyWebhook(rawBody, h) {
      const expected = process.env.FLUTTERWAVE_WEBHOOK_HASH ?? "";
      const given = h.get("verif-hash") ?? "";
      const ok = Boolean(expected) && given.length === expected.length && timingSafeEqual(Buffer.from(given), Buffer.from(expected));
      const json = JSON.parse(rawBody) as { event?: string; data?: { id?: number; tx_ref?: string; status?: string } };
      const s = json.data?.status;
      return { ok, eventId: `${json.event}:${json.data?.id ?? json.data?.tx_ref}`, providerReference: json.data?.tx_ref ?? null, status: s === "successful" ? "succeeded" : s === "failed" ? "failed" : null, raw: json };
    },
  };
}

/* ------------------------------------------------------------------ CamPay */
function campay(): PaymentProvider {
  const base = process.env.CAMPAY_BASE_URL ?? "https://www.campay.net/api";
  const token = process.env.CAMPAY_PERMANENT_TOKEN!;
  const headers = { Authorization: `Token ${token}`, "content-type": "application/json" };
  return {
    name: "campay",
    supports(method, currency) {
      return currency === "XAF" && (method === "mtn_momo" || method === "orange_money");
    },
    async initiate(input) {
      const res = await fetch(`${base}/collect/`, {
        method: "POST",
        headers,
        body: JSON.stringify({
          amount: String(input.amount),
          currency: "XAF",
          from: input.customer.phone?.replace(/\D/g, ""),
          description: input.description,
          external_reference: input.idempotencyKey,
        }),
      });
      const json = (await res.json()) as { reference?: string; message?: string };
      if (!json.reference) throw new Error(json.message ?? "campay initiate failed");
      return { kind: "push", providerReference: json.reference, instructions: "Approve the payment prompt on your phone." };
    },
    async verify(ref) {
      const res = await fetch(`${base}/transaction/${ref}/`, { headers });
      const json = (await res.json()) as { status?: string; amount?: string; currency?: string };
      const s = json.status;
      const status: NormalisedStatus = s === "SUCCESSFUL" ? "succeeded" : s === "FAILED" ? "failed" : "pending";
      return { status, amount: json.amount ? Number(json.amount) : undefined, currency: json.currency, raw: json };
    },
    async verifyWebhook(rawBody) {
      // CamPay signs with a JWT in the `signature` field using the app's webhook key.
      const json = JSON.parse(rawBody) as { status?: string; reference?: string; external_reference?: string; signature?: string };
      const key = process.env.CAMPAY_WEBHOOK_KEY ?? "";
      let ok = false;
      if (key && json.signature) {
        const [h, p, sig] = json.signature.split(".");
        const expected = createHmac("sha256", key).update(`${h}.${p}`).digest("base64url");
        ok = sig?.length === expected.length && timingSafeEqual(Buffer.from(sig), Buffer.from(expected));
      }
      return { ok, eventId: `campay:${json.reference}:${json.status}`, providerReference: json.reference ?? null, status: json.status === "SUCCESSFUL" ? "succeeded" : json.status === "FAILED" ? "failed" : null, raw: json };
    },
  };
}

/* ------------------------------------------------------------------ Stripe */
function stripe(): PaymentProvider {
  const secret = process.env.STRIPE_SECRET_KEY!;
  const headers = { Authorization: `Bearer ${secret}`, "content-type": "application/x-www-form-urlencoded" };
  return {
    name: "stripe",
    supports(method, currency) {
      return method === "card" && currency !== "XAF";
    },
    async initiate(input) {
      const body = new URLSearchParams({
        mode: "payment",
        success_url: `${input.returnUrl}&status=success`,
        cancel_url: `${input.returnUrl}&status=cancelled`,
        customer_email: input.customer.email,
        "line_items[0][quantity]": "1",
        "line_items[0][price_data][currency]": input.currency.toLowerCase(),
        "line_items[0][price_data][unit_amount]": String(Math.round(input.amount * 100)),
        "line_items[0][price_data][product_data][name]": input.description,
        client_reference_id: input.idempotencyKey,
        ...Object.fromEntries(Object.entries(input.metadata).map(([k, v]) => [`metadata[${k}]`, v])),
      });
      const res = await fetch("https://api.stripe.com/v1/checkout/sessions", { method: "POST", headers: { ...headers, "Idempotency-Key": input.idempotencyKey }, body });
      const json = (await res.json()) as { id?: string; url?: string; error?: { message: string } };
      if (!json.url || !json.id) throw new Error(json.error?.message ?? "stripe initiate failed");
      return { kind: "redirect", url: json.url, providerReference: json.id };
    },
    async verify(ref) {
      const res = await fetch(`https://api.stripe.com/v1/checkout/sessions/${ref}`, { headers });
      const json = (await res.json()) as { payment_status?: string; amount_total?: number; currency?: string; status?: string };
      const status: NormalisedStatus = json.payment_status === "paid" ? "succeeded" : json.status === "expired" ? "cancelled" : "pending";
      return { status, amount: json.amount_total ? json.amount_total / 100 : undefined, currency: json.currency?.toUpperCase(), raw: json };
    },
    async verifyWebhook(rawBody, h) {
      const secretWh = process.env.STRIPE_WEBHOOK_SECRET ?? "";
      const sigHeader = h.get("stripe-signature") ?? "";
      const parts = Object.fromEntries(sigHeader.split(",").map((kv) => kv.split("=") as [string, string]));
      const payload = `${parts.t}.${rawBody}`;
      const expected = createHmac("sha256", secretWh).update(payload).digest("hex");
      const ok = Boolean(secretWh) && parts.v1?.length === expected.length && timingSafeEqual(Buffer.from(parts.v1), Buffer.from(expected));
      const json = JSON.parse(rawBody) as { id: string; type: string; data?: { object?: { id?: string; payment_status?: string } } };
      const obj = json.data?.object;
      return { ok, eventId: json.id, providerReference: obj?.id ?? null, status: json.type === "checkout.session.completed" && obj?.payment_status === "paid" ? "succeeded" : json.type === "checkout.session.expired" ? "cancelled" : null, raw: json };
    },
  };
}

/* ------------------------------------------------------------------ manual */
const manual: PaymentProvider = {
  name: "manual",
  supports() {
    return true;
  },
  async initiate(input) {
    return { kind: "none", providerReference: `manual:${input.idempotencyKey}` };
  },
  async verify() {
    return { status: "pending", raw: null };
  },
  async verifyWebhook() {
    return { ok: false, eventId: "", providerReference: null, status: null, raw: null };
  },
};

export function listProviders(): PaymentProvider[] {
  const list: PaymentProvider[] = [];
  const local = process.env.PAYMENTS_LOCAL_PROVIDER ?? (process.env.CAMPAY_PERMANENT_TOKEN ? "campay" : process.env.FLUTTERWAVE_SECRET_KEY ? "flutterwave" : "");
  if (local === "campay" && process.env.CAMPAY_PERMANENT_TOKEN) list.push(campay());
  if (local === "flutterwave" && process.env.FLUTTERWAVE_SECRET_KEY) list.push(flutterwave());
  if (process.env.FLUTTERWAVE_SECRET_KEY && local !== "flutterwave") list.push(flutterwave());
  if (process.env.STRIPE_SECRET_KEY) list.push(stripe());
  return list;
}

export function getProviderFor(method: PaymentMethod, currency: string): PaymentProvider | null {
  return listProviders().find((p) => p.supports(method, currency)) ?? null;
}

export function getProviderByName(name: string): PaymentProvider | null {
  if (name === "manual") return manual;
  return listProviders().find((p) => p.name === name) ?? null;
}

export function availableMethods(currency: string): PaymentMethod[] {
  const methods: PaymentMethod[] = ["mtn_momo", "orange_money", "card"];
  return methods.filter((m) => listProviders().some((p) => p.supports(m, currency)));
}
