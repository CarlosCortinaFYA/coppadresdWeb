/**
 * Modelo de precios y cálculo de la membresía COPP-ADRESD.
 * Un solo plan con módulos obligatorios (incluidos) y dos opcionales que el
 * usuario puede quitar del cálculo, más un dispositivo opcional de pago único.
 * Precios en USD; los impuestos de venta se calculan al pagar.
 */

export type PlanId = "annual" | "monthly";
export type ModuleId = "sos" | "community";
export type DeviceId = "none" | "band" | "ring";

/** Selección del usuario dentro del configurador. */
export interface Selection {
  plan: PlanId;
  /** Módulos opcionales quitados del cálculo. */
  removed: ReadonlySet<ModuleId>;
  device: DeviceId;
}

export interface PlanInfo {
  id: PlanId;
  /** Precio base del plan completo con todos los módulos. */
  fullYear: number;
  badgeKey?: "save" | null;
}

export interface ModuleInfo {
  id: ModuleId;
  icon: string;
  /** Descuento si se quita, según el plan: anual o dentro del total mensual. */
  offYear: number;
  offMonthlyYear: number;
}

export interface DeviceInfo {
  id: DeviceId;
  icon: string;
  price: number;
}

/** En el futuro apuntará a la pasarela real (p. ej. Stripe Checkout); vacío = demo interna. */
export const CHECKOUT_URL: string = "";

/** WhatsApp de soporte comercial (config/contact.ts ya lo expone, se reutiliza). */
export const PLANS: Record<PlanId, PlanInfo> = {
  annual: { id: "annual", fullYear: 300, badgeKey: "save" },
  monthly: { id: "monthly", fullYear: 400, badgeKey: null },
};

export const MODULES: ModuleInfo[] = [
  {
    id: "sos",
    icon: "shield",
    offYear: 60,
    offMonthlyYear: 80,
  },
  {
    id: "community",
    icon: "users",
    offYear: 15,
    offMonthlyYear: 20,
  },
];

export const DEVICES: DeviceInfo[] = [
  { id: "none", icon: "chip", price: 0 },
  { id: "band", icon: "watch", price: 39 },
  { id: "ring", icon: "ring", price: 44 },
];

export interface Totals {
  /** Precio del plan con la remoción ya descontada (según el plan elegido). */
  planYear: number;
  /** Precio del plan anual quitando los módulos removidos. */
  annualTotal: number;
  /** Precio del mismo programa pagando mensual, sin los módulos removidos. */
  monthlyTotal: number;
  /** Precio mensual equivalente. */
  monthly: number;
  /** Precio del dispositivo (pago único). */
  device: number;
  /** Cargo de hoy antes de impuestos. */
  dueToday: number;
  /** Ahorro del plan anual frente al mensual, con la misma selección. */
  savings: number;
  /** Cómo se describiría el cargo de hoy: anual, primer mes… */
  dueLabelKey: "annual" | "monthly" | "withDevice";
}

export function totalsOf(sel: Selection): Totals {
  const removedYear = MODULES.reduce(
    (acc, m) => acc + (sel.removed.has(m.id) ? m.offYear : 0),
    0,
  );
  const removedMonthly = MODULES.reduce(
    (acc, m) => acc + (sel.removed.has(m.id) ? m.offMonthlyYear : 0),
    0,
  );
  const device = DEVICES.find((d) => d.id === sel.device)!.price;
  const annualTotal = PLANS.annual.fullYear - removedYear;
  const monthlyTotal = PLANS.monthly.fullYear - removedMonthly;
  const planYear = sel.plan === "annual" ? annualTotal : monthlyTotal;
  const monthly = planYear / 12;
  return {
    planYear,
    annualTotal,
    monthlyTotal,
    monthly,
    device,
    dueToday: monthly + device,
    savings: monthlyTotal - annualTotal,
    dueLabelKey:
      sel.plan === "annual"
        ? device > 0
          ? "withDevice"
          : "annual"
        : "monthly",
  };
}

/** Formato de dinero en USD consistente en ambos idiomas ($1,234.00). */
export const usd = (n: number): string =>
  new Intl.NumberFormat("en-US", {
    style: "currency",
    currency: "USD",
  }).format(n);

/**
 * Referencia legible de la compra, el mismo contrato que usa la futura
 * pasarela (client_reference_id) y el mensaje que llega por WhatsApp.
 */
export function selectionReference(sel: Selection): string {
  const parts = [sel.plan, "off" + [...sel.removed].join(""), "d" + sel.device];
  return parts.join("-");
}
