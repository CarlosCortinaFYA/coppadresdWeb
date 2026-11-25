import type { PlanId } from "./data";

const STORAGE_KEY = "copp-membership-demo-v1";

export type DemoStatus = "active" | "expired" | "canceled";

export interface DemoMembership {
  plan: PlanId;
  reference: string;
  expiresAt: number;
  status: DemoStatus;
}

function addBillingPeriod(timestamp: number, plan: PlanId): number {
  const date = new Date(timestamp);
  const startDay = date.getUTCDate();
  date.setUTCDate(1);
  date.setUTCMonth(date.getUTCMonth() + (plan === "annual" ? 12 : 1));
  const monthEnd = new Date(Date.UTC(date.getUTCFullYear(), date.getUTCMonth() + 1, 0));
  date.setUTCDate(Math.min(startDay, monthEnd.getUTCDate()));
  return date.valueOf();
}

export function readDemoMembership(): DemoMembership | null {
  try {
    const saved: Partial<DemoMembership> | null = JSON.parse(localStorage.getItem(STORAGE_KEY) ?? "null");
    if (
      !saved ||
      (saved.plan !== "monthly" && saved.plan !== "annual") ||
      typeof saved.reference !== "string" ||
      !/^DEMO-[0-9a-f]{8}$/.test(saved.reference) ||
      typeof saved.expiresAt !== "number" ||
      !Number.isSafeInteger(saved.expiresAt) ||
      saved.expiresAt < 0 ||
      saved.expiresAt > 253_402_300_799_999 ||
      (saved.status !== "active" && saved.status !== "expired" && saved.status !== "canceled")
    ) {
      return null;
    }
    return {
      plan: saved.plan,
      reference: saved.reference,
      expiresAt: saved.expiresAt,
      status: saved.status,
    };
  } catch {
    return null;
  }
}

export function saveDemoMembership(membership: DemoMembership): void {
  try {
    localStorage.setItem(STORAGE_KEY, JSON.stringify(membership));
  } catch {
    // La simulación sigue disponible en la sesión si el almacenamiento está deshabilitado.
  }
}

export function currentDemoStatus(membership: DemoMembership): DemoStatus {
  return membership.status === "active" && Date.now() >= membership.expiresAt
    ? "expired"
    : membership.status;
}

export function activateDemoMembership(plan: PlanId): DemoMembership {
  const id = crypto.getRandomValues(new Uint32Array(1))[0].toString(16).padStart(8, "0");
  return {
    plan,
    reference: `DEMO-${id}`,
    expiresAt: addBillingPeriod(Date.now(), plan),
    status: "active",
  };
}

export function renewDemoMembership(membership: DemoMembership): DemoMembership {
  return {
    ...membership,
    expiresAt: addBillingPeriod(Math.max(Date.now(), membership.expiresAt), membership.plan),
    status: "active",
  };
}
