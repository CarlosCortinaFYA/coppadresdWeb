import { CHECKOUT_URL } from "./data";
import type { PlanId } from "./data";

export const paidActivationDemoConfigured =
  import.meta.env.VITE_PAID_ACTIVATION_DEMO === "true" && !CHECKOUT_URL;

const receiptKey = "copp-paid-activation-demo-receipt";
const paymentIdFormat = /^[\da-f]{8}(?:-[\da-f]{4}){3}-[\da-f]{12}$/i;

export type PaidDemoAttempt = { paymentId: string; plan?: PlanId };
export type PaidDemoReceipt = { paymentId: string; plan: PlanId; amountCents: number; currency: "USD" };

export function readPaidDemoAttempt(): PaidDemoAttempt | null {
  try {
    const stored = sessionStorage.getItem(receiptKey);
    if (!stored) return null;
    if (paymentIdFormat.test(stored)) return { paymentId: stored };
    const { paymentId, plan } = JSON.parse(stored) as PaidDemoAttempt;
    return typeof paymentId === "string" && paymentIdFormat.test(paymentId)
      ? { paymentId, plan: plan === "monthly" || plan === "annual" ? plan : undefined }
      : null;
  } catch {
    return null;
  }
}

export function savePaidDemoAttempt(attempt: PaidDemoAttempt | null): void {
  try {
    if (attempt === null) sessionStorage.removeItem(receiptKey);
    else sessionStorage.setItem(receiptKey, JSON.stringify(attempt));
  } catch {
    // El comprobante sigue disponible en memoria.
  }
}

function requestPaidDemo(
  path: string,
  body?: object,
  accessToken?: string,
): Promise<Response> {
  const headers = new Headers();
  if (body) headers.set("Content-Type", "application/json");
  if (accessToken) headers.set("Authorization", `Bearer ${accessToken}`);
  return fetch(path, {
    method: body ? "POST" : "GET",
    headers,
    body: body ? JSON.stringify(body) : undefined,
    credentials: "same-origin",
    cache: "no-store",
    redirect: "error",
    referrerPolicy: "no-referrer",
    signal: AbortSignal.timeout(15000),
  });
}

export function postPaidDemo(
  action: "confirm" | "resend" | "prepare" | "redeem" | "complete" | "login",
  body: object,
  accessToken?: string,
): Promise<Response> {
  const path = action === "login" ? "/api/auth/login" : `/api/auth/paid-activation/demo/${action}`;
  return requestPaidDemo(path, body, accessToken);
}

export function getPaidDemoSetup(): Promise<Response> {
  return requestPaidDemo("/api/auth/paid-activation/demo/setup");
}

export function getPaidDemoReceipt(paymentId: string): Promise<Response> {
  return requestPaidDemo(`/api/auth/paid-activation/demo/receipt/${encodeURIComponent(paymentId)}`);
}

export async function readPaidDemoReceipt(response: Response, paymentId: string): Promise<PaidDemoReceipt> {
  const receipt = await response.json() as Partial<PaidDemoReceipt>;
  if (receipt.paymentId !== paymentId
    || (receipt.plan !== "annual" && receipt.plan !== "monthly")
    || typeof receipt.amountCents !== "number"
    || !Number.isSafeInteger(receipt.amountCents)
    || receipt.amountCents < 0
    || receipt.currency !== "USD") {
    throw new Error("Comprobante inválido");
  }
  return receipt as PaidDemoReceipt;
}
