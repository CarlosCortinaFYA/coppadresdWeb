/**
 * Modelo de precios y cálculo de la membresía Agentic Wellness AI.
 * Un solo plan con todo incluido: solo se elige el periodo de pago (anual o
 * mensual); no hay módulos quitables ni dispositivos. Precios en USD; los
 * impuestos de venta se calculan al pagar según el estado.
 */

export type PlanId = "annual" | "monthly";

/** Selección del usuario dentro del configurador. */
export interface Selection {
  plan: PlanId;
}

export interface PlanInfo {
  id: PlanId;
  /** Precio de doce meses con este periodo de pago. */
  fullYear: number;
}

/** En el futuro apuntará a la pasarela real (p. ej. Stripe Checkout); vacío = demo interna. */
export const CHECKOUT_URL: string = "";

export const PLANS: Record<PlanId, PlanInfo> = {
  /** $9.98/mes equivalente: 50 % menos que pagar mes a mes. */
  annual: { id: "annual", fullYear: 119.76 },
  /** $19.96 × 12: el mismo programa pagado mes a mes. */
  monthly: { id: "monthly", fullYear: 239.52 },
};

export interface Totals {
  /** Precio del plan anual completo. */
  annualTotal: number;
  /** Precio de doce meses pagando mes a mes. */
  monthlyTotal: number;
  /** Precio del plan según el periodo elegido. */
  planYear: number;
  /** Precio mensual equivalente del plan elegido. */
  monthly: number;
  /** Cargo del primer pago: el año completo o un mes. */
  dueToday: number;
  /** Ahorro del plan anual frente a pagar mes a mes. */
  savings: number;
}

export function totalsOf(sel: Selection): Totals {
  const plan = PLANS[sel.plan];
  return {
    annualTotal: PLANS.annual.fullYear,
    monthlyTotal: PLANS.monthly.fullYear,
    planYear: plan.fullYear,
    monthly: plan.fullYear / 12,
    dueToday: sel.plan === "annual" ? plan.fullYear : plan.fullYear / 12,
    savings: PLANS.monthly.fullYear - PLANS.annual.fullYear,
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
  return sel.plan;
}
