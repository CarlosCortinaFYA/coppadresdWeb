import { useEffect, useRef, useState } from "react";
import type { FormEvent, ReactNode } from "react";
import { usePreferences } from "../i18n/usePreferences";
import { ROUTES, navigate } from "../router";
import { whatsappUrl } from "../config/contact";
import { Icon } from "../components/Icon";
import { BrandMark } from "../components/BrandMark";
import { CHECKOUT_URL, PLANS, selectionReference, totalsOf, usd } from "./data";
import type { PlanId } from "./data";
import { membershipContent } from "./content";
import {
  activateDemoMembership,
  currentDemoStatus,
  readDemoMembership,
  renewDemoMembership,
  saveDemoMembership,
} from "./demoMembership";
import type { DemoMembership } from "./demoMembership";
import {
  getPaidDemoReceipt,
  paidActivationDemoConfigured,
  postPaidDemo,
  postMembershipEvent,
  readPaidDemoAttempt,
  readPaidDemoReceipt,
  savePaidDemoAttempt,
} from "./paidActivationDemo";
import type { MembershipEvent, MembershipEventKind, PaidDemoReceipt } from "./paidActivationDemo";
import "../styles/membership.css";

/* ------------------------------------------------------------------ */
/* Utilidades                                                          */
/* ------------------------------------------------------------------ */

const prefersReducedMotion = () =>
  window.matchMedia("(prefers-reduced-motion: reduce)").matches;

const digitsOf = (value: string, max = 19) =>
  value.replace(/\D/g, "").slice(0, max);

/** Formato de tarjeta en grupos de 4 (1234 5678 9012 3456). */
const formatCardNumber = (value: string) =>
  digitsOf(value)
    .replace(/(\d{4})(?=\d)/g, "$1 ")
    .trim();

/** Vencimiento autoformateado como MM/AA. */
const formatExpiry = (value: string) => {
  const d = digitsOf(value, 4);
  return d.length > 2 ? `${d.slice(0, 2)}/${d.slice(2)}` : d;
};

/** Anima el monto del resumen con interpolación suave (respeta reduce). */
function useCountUp(target: number): number {
  const [value, setValue] = useState(target);
  const current = useRef(target);
  useEffect(() => {
    current.current = value;
  }, [value]);
  useEffect(() => {
    if (current.current === target || prefersReducedMotion()) {
      setValue(target);
      return;
    }
    const from = current.current;
    let raf = 0;
    const t0 = performance.now();
    const tick = (now: number) => {
      const p = Math.min(1, (now - t0) / 480);
      setValue(from + (target - from) * (1 - (1 - p) ** 3));
      if (p < 1) raf = requestAnimationFrame(tick);
    };
    raf = requestAnimationFrame(tick);
    return () => cancelAnimationFrame(raf);
  }, [target]);
  return value;
}

/* ------------------------------------------------------------------ */
/* Piezas de UI                                                        */
/* ------------------------------------------------------------------ */

type CardForm = {
  name: string;
  email: string;
  card: string;
  exp: string;
  csc: string;
};

const EMPTY_FORM: CardForm = {
  name: "",
  email: "",
  card: "",
  exp: "",
  csc: "",
};

type Step = "plan" | "checkout" | "processing" | "done";
type PaidDemoConfirmation = {
  paymentId: string;
  email: string;
  plan: PlanId;
  language: "es" | "en";
  checkoutKey: string;
  trial: boolean;
};
type PaidDemoError = "paymentError" | "resendError" | "rate" | "eventError" | "eventConflict";
type PaidDemoFeedback =
  | { kind: "idle" | "busy" | "recovering" | "resent" }
  | { kind: "error"; message: PaidDemoError };

const STEP_ORDER: Step[] = ["plan", "checkout", "processing", "done"];
const PROCESS_STAGE_MS = 900;
const showPaidActivationDemo = import.meta.env.DEV && paidActivationDemoConfigured;

function SectionHead({
  index,
  title,
  hint,
  id,
}: {
  index: string;
  title: string;
  hint?: string;
  id?: string;
}) {
  return (
    <div className="m-section-head">
      <span className="m-section-index" aria-hidden="true">
        {index}
      </span>
      <div>
        <h3 id={id} tabIndex={id ? -1 : undefined}>
          {title}
        </h3>
        {hint && <p>{hint}</p>}
      </div>
    </div>
  );
}

/* ------------------------------------------------------------------ */
/* Página                                                              */
/* ------------------------------------------------------------------ */

export function MembershipPage() {
  const { language, theme, toggleLanguage, toggleTheme } = usePreferences();
  const c = membershipContent[language];

  const [demoMembership, setDemoMembership] = useState(() =>
    CHECKOUT_URL || showPaidActivationDemo ? null : readDemoMembership(),
  );
  const [savedAttempt] = useState(() =>
    showPaidActivationDemo ? readPaidDemoAttempt() : null,
  );
  const [paidReceipt, setPaidReceipt] = useState<PaidDemoReceipt | null>(null);
  const [plan, setPlan] = useState<PlanId>(demoMembership?.plan ?? savedAttempt?.plan ?? "annual");
  const [step, setStep] = useState<Step>(demoMembership ? "done" : savedAttempt ? "checkout" : "plan");
  const [stage, setStage] = useState(0);
  const [form, setForm] = useState<CardForm>(EMPTY_FORM);
  const [paidFeedback, setPaidFeedback] = useState<PaidDemoFeedback>({
    kind: savedAttempt ? "recovering" : "idle",
  });
  const paidBusy = paidFeedback.kind === "busy" || paidFeedback.kind === "recovering";
  const paidError = paidFeedback.kind === "error" ? c.paidDemo[paidFeedback.message] : null;
  const demoStatus = demoMembership ? currentDemoStatus(demoMembership) : null;

  const paidAttempt = useRef(savedAttempt);
  const paidRequestPending = useRef(false);
  const pendingEvent = useRef<MembershipEvent | null>(null);
  const timers = useRef<number[]>([]);
  const firstRun = useRef(true);

  const totals = totalsOf({ plan });
  const dueToday = useCountUp(totals.dueToday);

  useEffect(() => {
    document.title = c.metaTitle;
  }, [c.metaTitle]);

  useEffect(() => {
    if (!savedAttempt) return;
    let active = true;

    async function recoverReceipt(paymentId: string) {
      try {
        const response = await getPaidDemoReceipt(paymentId);
        if (!active) return;
        if (response.status === 404) {
          setPaidFeedback({ kind: "idle" });
          return;
        }
        if (!response.ok) throw new Error("No se pudo recuperar el comprobante");
        const receipt = await readPaidDemoReceipt(response, paymentId);
        if (active) openPaidReceipt(receipt);
      } catch {
        if (active) setPaidFeedback({ kind: "error", message: "paymentError" });
      }
    }

    void recoverReceipt(savedAttempt.paymentId);
    return () => { active = false; };
  }, [savedAttempt]);

  // Al cambiar de paso se vuelve al inicio y se anuncia el título del paso.
  useEffect(() => {
    if (firstRun.current) {
      firstRun.current = false;
      return;
    }
    if (step === "processing") return;
    window.scrollTo({
      top: 0,
      behavior: prefersReducedMotion() ? "auto" : "smooth",
    });
    document.getElementById("m-step-heading")?.focus({ preventScroll: true });
  }, [step]);

  // Limpieza de los temporizadores de procesamiento al desmontar.
  useEffect(
    () => () => {
      timers.current.forEach(clearTimeout);
    },
    [],
  );

  const summaryRows =
    plan === "annual"
      ? [
          {
            label: c.summary.planAnnual,
            value: `${usd(totals.planYear)} ${c.sections.recurring}`,
          },
          {
            label: c.summary.equivalentRow,
            value: `${usd(totals.monthly)} ${c.sections.recurringMonth}`,
            faint: true,
          },
          {
            label: c.summary.monthlyYearRow,
            value: `${usd(totals.monthlyTotal)} ${c.sections.recurring}`,
            faint: true,
          },
          {
            label: c.summary.taxesRow,
            value: c.summary.taxesHint,
            faint: true,
          },
        ]
      : [
          {
            label: c.summary.planMonthly,
            value: `${usd(totals.monthly)} ${c.sections.recurringMonth}`,
          },
          {
            label: c.summary.monthlyYearRow,
            value: `${usd(totals.monthlyTotal)} ${c.sections.recurring}`,
            faint: true,
          },
          {
            label: c.summary.annualRow,
            value: `${usd(totals.annualTotal)} (${usd(totals.annualTotal / 12)} ${c.sections.recurringMonth})`,
            faint: true,
          },
          {
            label: c.summary.taxesRow,
            value: c.summary.taxesHint,
            faint: true,
          },
        ];

  const goCheckout = () => setStep("checkout");
  const goBack = () => {
    if (paidRequestPending.current || paidBusy) return;
    if (showPaidActivationDemo && paidReceipt) {
      savePaidDemoAttempt(null);
      setPaidReceipt(null);
      setForm(EMPTY_FORM);
      paidAttempt.current = null;
    }
    setPaidFeedback({ kind: "idle" });
    timers.current.forEach(clearTimeout);
    timers.current = [];
    setStage(0);
    setStep("plan");
  };

  const selectionText =
    plan === "annual"
      ? `${c.summary.planAnnual} (${usd(totals.planYear)} ${c.sections.recurring})`
      : `${c.summary.planMonthly} (${usd(totals.monthly)} ${c.sections.recurringMonth})`;

  const updateDemoMembership = (next: DemoMembership) => {
    setDemoMembership(next);
    saveDemoMembership(next);
  };

  const startProcessing = () => {
    if (timers.current.length > 0) return;
    setStage(0);
    setStep("processing");
    for (let i = 1; i <= 3; i++) {
      timers.current.push(
        window.setTimeout(() => setStage(i), i * PROCESS_STAGE_MS),
      );
    }
    timers.current.push(window.setTimeout(() => {
      timers.current = [];
      updateDemoMembership(activateDemoMembership(plan));
      setStep("done");
    }, 3 * PROCESS_STAGE_MS + 400));
  };

  function openPaidReceipt(receipt: PaidDemoReceipt) {
    const { paymentId, plan: settledPlan } = receipt;
    const checkoutKey = paidAttempt.current?.paymentId === paymentId ? paidAttempt.current.checkoutKey : undefined;
    paidAttempt.current = { paymentId, plan: settledPlan, checkoutKey };
    savePaidDemoAttempt(paidAttempt.current);
    setPaidReceipt(receipt);
    setPlan(settledPlan);
    setForm(EMPTY_FORM);
    setPaidFeedback({ kind: "idle" });
    setStep("done");
  }

  async function sendPaidRequest(request:
    | { action: "confirm"; body: PaidDemoConfirmation }
    | { action: "resend"; body: { paymentId: string } },
  ) {
    if (paidRequestPending.current) return;
    paidRequestPending.current = true;
    setPaidFeedback({ kind: "busy" });
    const { action, body } = request;
    const failure = action === "confirm" ? "paymentError" : "resendError";
    try {
      const response = await postPaidDemo(action, body);
      if (response.status !== 202) {
        setPaidFeedback({ kind: "error", message: response.status === 429 ? "rate" : failure });
        return;
      }
      if (action === "resend") {
        setPaidFeedback({ kind: "resent" });
        return;
      }
      openPaidReceipt(await readPaidDemoReceipt(response, body.paymentId));
    } catch {
      setPaidFeedback({ kind: "error", message: failure });
    } finally {
      paidRequestPending.current = false;
    }
  }

  async function applyMembershipEvent(kind: MembershipEventKind) {
    const checkoutKey = paidAttempt.current?.checkoutKey;
    if (!paidReceipt || !checkoutKey || paidRequestPending.current) return;
    paidRequestPending.current = true;
    setPaidFeedback({ kind: "busy" });
    const { paymentId, membershipRevision: expectedRevision } = paidReceipt;
    let event = pendingEvent.current;
    if (!event || event.kind !== kind || event.paymentId !== paymentId || event.expectedRevision !== expectedRevision) {
      event = { paymentId, checkoutKey, kind, expectedRevision, eventId: crypto.randomUUID() };
      pendingEvent.current = event;
    }
    try {
      const response = await postMembershipEvent(event);
      if (response.status === 409) {
        pendingEvent.current = null;
        const refreshed = await getPaidDemoReceipt(paymentId);
        if (refreshed.ok) openPaidReceipt(await readPaidDemoReceipt(refreshed, paymentId));
        setPaidFeedback({ kind: "error", message: "eventConflict" });
      } else if (response.ok) {
        openPaidReceipt(await readPaidDemoReceipt(response, paymentId));
        pendingEvent.current = null;
      } else {
        setPaidFeedback({ kind: "error", message: response.status === 429 ? "rate" : "eventError" });
      }
    } catch {
      setPaidFeedback({ kind: "error", message: "eventError" });
    } finally {
      paidRequestPending.current = false;
    }
  }

  const onPay = (event: FormEvent<HTMLFormElement>) => {
    event.preventDefault();
    if (showPaidActivationDemo) {
      if (paidRequestPending.current || paidBusy) return;
      const email = form.email.trim();
      try {
        const paymentId = paidAttempt.current?.paymentId ?? crypto.randomUUID();
        const checkoutKey = paidAttempt.current?.checkoutKey ?? crypto.randomUUID();
        const trial = ((event.nativeEvent as SubmitEvent).submitter as HTMLButtonElement | null)?.value === "trial";
        // La referencia y su autorización sobreviven a una respuesta perdida.
        paidAttempt.current = { paymentId, plan, checkoutKey };
        savePaidDemoAttempt(paidAttempt.current);
        void sendPaidRequest({ action: "confirm", body: { paymentId, email, plan, language, trial, checkoutKey } });
      } catch {
        setPaidFeedback({ kind: "error", message: "paymentError" });
      }
      return;
    }
    if (CHECKOUT_URL) {
      // Pasarela real: mismo contrato client_reference_id que el mock original.
      const url = `${CHECKOUT_URL}${CHECKOUT_URL.includes("?") ? "&" : "?"}client_reference_id=${encodeURIComponent(selectionReference({ plan }))}`;
      window.location.assign(url);
      return;
    }
    startProcessing();
  };

  const whatsappMessage = c.whatsappMessage(
    selectionText,
    usd(totals.dueToday),
  );

  /* ---------------- Cabezal de pasos ---------------- */

  const stepper = (
    <ol className="m-stepper" aria-label={c.stepper[0]}>
      {c.stepper.map((label, i) => {
        const current = STEP_ORDER.indexOf(step);
        const state =
          i < current ? "is-done" : i === current ? "is-active" : "is-todo";
        const clickable = i === 0 && step === "checkout";
        return (
          <li key={label} className={`m-step-item ${state}`}>
            {clickable ? (
              <button type="button" className="m-step-btn" onClick={goBack}>
                <span className="m-step-dot">
                  <Icon name="check" size={13} />
                </span>
                <span>{label}</span>
              </button>
            ) : (
              <span
                className="m-step-label"
                aria-current={i === current ? "step" : undefined}
              >
                <span className="m-step-dot">
                  {i < current ? <Icon name="check" size={13} /> : i + 1}
                </span>
                <span>{label}</span>
              </span>
            )}
          </li>
        );
      })}
    </ol>
  );

  const summaryCard = (
    <aside className="m-summary" aria-label={c.summary.title}>
      <div className="m-summary-head">
        <Icon name="sparkles" size={16} />
        <h2>{c.summary.title}</h2>
        <span className="m-demo-chip">DEMO</span>
      </div>
      <p className="m-total" aria-live="polite">
        <strong>{usd(dueToday)}</strong>
        <small>
          {plan === "annual" ? c.summary.dueAnnual : c.summary.dueMonthly}
        </small>
      </p>
      {plan === "annual" ? (
        <p className="m-save-chip">
          {c.summary.savingsRow}: <strong>{usd(totals.savings)}</strong>{" "}
          {c.sections.recurring}
        </p>
      ) : (
        <p className="m-save-chip ghost">
          {c.summary.planAnnual}: <strong>{usd(totals.annualTotal)}</strong>{" "}
          {c.sections.recurring}
        </p>
      )}
      <div className="m-rows">
        {summaryRows.map((row) => (
          <div className="m-row" key={row.label}>
            <span>{row.label}</span>
            <b className={row.faint ? "m-faint" : ""}>{row.value}</b>
          </div>
        ))}
      </div>
      {step === "plan" ? (
        <button className="button m-cta" type="button" onClick={goCheckout}>
          {CHECKOUT_URL ? c.summary.continue : c.simulation.continue}
          <Icon name="arrow" size={18} />
        </button>
      ) : null}
      <p className="m-secure">
        <Icon name={step === "plan" ? "lock" : "info"} size={14} />
        {step === "plan" ? c.summary.secure : c.summary.demo}
      </p>
    </aside>
  );

  const planStep = (
    <div className="m-step" key="plan">
      <section className="m-card">
        <SectionHead id="m-step-heading" index="1" title={c.sections.plan} />
        <div
          className="m-plan-grid"
          role="radiogroup"
          aria-label={c.sections.plan}
        >
          {(["annual", "monthly"] as const).map((id) => {
            const info = PLANS[id];
            const selected = plan === id;
            return (
              <label key={id} className={`m-plan${selected ? " is-on" : ""}`}>
                <input
                  type="radio"
                  name="m-plan"
                  value={id}
                  className="m-sr"
                  checked={selected}
                  onChange={() => setPlan(id)}
                />
                <span className="m-plan-badge">
                  {id === "annual" ? (
                    <Icon name="sparkles" size={13} />
                  ) : (
                    <Icon name="sunrise" size={13} />
                  )}
                  {c.plans[id].badge}
                </span>
                <strong>{c.plans[id].name}</strong>
                <span className="m-plan-price">
                  {usd(info.fullYear / 12)}
                  <small>{c.plans.perMonth}</small>
                </span>
                <span className="m-plan-sub">
                  {usd(info.fullYear)} {c.sections.recurring}
                </span>
                <span className="m-plan-note">{c.plans[id].note}</span>
                <span className="m-check-mark" aria-hidden="true">
                  <Icon name="check" size={12} />
                </span>
              </label>
            );
          })}
        </div>
      </section>

      <section className="m-card">
        <SectionHead
          index="2"
          title={c.sections.included}
          hint={c.sections.includedHint}
        />
        <div className="m-core-grid">
          {c.core.map((m) => (
            <article className="m-core-item" key={m.id}>
              <span className="m-core-tag">{c.sections.includedTag}</span>
              <span className="m-icon-tile">
                <Icon name={m.icon} size={20} />
              </span>
              <h4>{m.name}</h4>
              <p>{m.description}</p>
            </article>
          ))}
        </div>
      </section>
    </div>
  );

  const checkoutStep = (
    <div className="m-step" key="checkout">
      <form
        className="m-card m-checkout"
        onSubmit={onPay}
        noValidate={!showPaidActivationDemo}
        aria-busy={paidBusy}
      >
        <button type="button" className="m-back" onClick={goBack} disabled={paidBusy}>
          {c.checkout.back}
          <Icon name="chevron" size={16} />
        </button>
        <p className="m-step-eyebrow">
          <span className="m-progress-dot" aria-hidden="true" />
          {c.checkout.eyebrow}
        </p>
        <h2 id="m-step-heading" tabIndex={-1}>
          {CHECKOUT_URL ? c.checkout.title : c.simulation.checkoutTitle}
        </h2>
        <p className="m-step-desc" id="m-checkout-description">
          {CHECKOUT_URL ? c.checkout.description : showPaidActivationDemo ? c.paidDemo.description : c.simulation.checkoutDescription}
        </p>

        {showPaidActivationDemo && (
          <div className="m-field">
            <label htmlFor="m-paid-demo-email">{c.paidDemo.email}</label>
            <input
              id="m-paid-demo-email"
              name="email"
              type="email"
              autoComplete="email"
              placeholder={c.checkout.emailPlaceholder}
              maxLength={254}
              aria-describedby="m-checkout-description"
              required
              disabled={paidBusy}
              value={form.email}
              onChange={(event) => setForm({ ...form, email: event.target.value })}
            />
          </div>
        )}
        {CHECKOUT_URL && (
          <>
            <fieldset className="m-fieldset">
              <legend>{c.checkout.contactTitle}</legend>
              <div className="m-field">
                <label htmlFor="m-name">{c.checkout.name}</label>
                <input
                  id="m-name"
                  name="name"
                  autoComplete="name"
                  enterKeyHint="next"
                  value={form.name}
                  onChange={(e) => {
                    setForm({ ...form, name: e.target.value });
                  }}
                />
              </div>
              <div className="m-field">
                <label htmlFor="m-email">{c.checkout.email}</label>
                <input
                  id="m-email"
                  name="email"
                  type="email"
                  autoComplete="email"
                  placeholder={c.checkout.emailPlaceholder}
                  enterKeyHint="next"
                  value={form.email}
                  onChange={(e) => {
                    setForm({ ...form, email: e.target.value });
                  }}
                />
              </div>
            </fieldset>

            <fieldset className="m-fieldset is-card">
              <legend>
                <Icon name="card" size={17} />
                {c.checkout.cardTitle}
              </legend>
              <div className="m-field">
                <label htmlFor="m-card">{c.checkout.cardNumber}</label>
                <span className="m-hint" id="m-card-hint">
                  {c.checkout.numberHint}
                </span>
                <input
                  id="m-card"
                  name="cc-number"
                  type="text"
                  inputMode="numeric"
                  autoComplete="cc-number"
                  maxLength={19}
                  aria-describedby="m-card-hint"
                  placeholder="1234 5678 9012 3456"
                  enterKeyHint="next"
                  value={form.card}
                  onChange={(e) => {
                    setForm({ ...form, card: formatCardNumber(e.target.value) });
                  }}
                />
              </div>
              <div className="m-field">
                <label htmlFor="m-ccname">{c.checkout.cardName}</label>
                <input
                  id="m-ccname"
                  name="cc-name"
                  type="text"
                  autoComplete="cc-name"
                  maxLength={50}
                  enterKeyHint="next"
                  value={form.name}
                  onChange={(e) => setForm({ ...form, name: e.target.value })}
                />
              </div>
              <div className="m-field-row">
                <div className="m-field">
                  <label htmlFor="m-exp">{c.checkout.expiry}</label>
                  <span className="m-hint" id="m-exp-hint">
                    {c.checkout.expiryHint}
                  </span>
                  <input
                    id="m-exp"
                    name="cc-exp"
                    type="text"
                    inputMode="numeric"
                    autoComplete="cc-exp"
                    maxLength={5}
                    aria-describedby="m-exp-hint"
                    placeholder={c.checkout.expiryPlaceholder}
                    enterKeyHint="next"
                    value={form.exp}
                    onChange={(e) => {
                      setForm({ ...form, exp: formatExpiry(e.target.value) });
                    }}
                  />
                </div>
                <div className="m-field">
                  <label htmlFor="m-csc">{c.checkout.csc}</label>
                  <span className="m-hint" id="m-csc-hint">
                    {c.checkout.cscHint}
                  </span>
                  <input
                    id="m-csc"
                    name="cc-csc"
                    type="text"
                    inputMode="numeric"
                    autoComplete="cc-csc"
                    maxLength={4}
                    aria-describedby="m-csc-hint"
                    enterKeyHint="done"
                    value={form.csc}
                    onChange={(e) => {
                      setForm({ ...form, csc: digitsOf(e.target.value, 4) });
                    }}
                  />
                </div>
              </div>
            </fieldset>
          </>
        )}

        {paidFeedback.kind === "recovering" && <p className="m-step-desc" role="status">{c.paidDemo.recovering}</p>}
        {paidError && <p className="m-step-desc" role="alert">{paidError}</p>}
        <button className="button m-cta" type="submit" disabled={paidBusy}>
          <Icon name="lock" size={16} />
          {showPaidActivationDemo
            ? c.paidDemo.confirm
            : `${CHECKOUT_URL ? c.checkout.pay : c.simulation.pay} ${usd(totals.dueToday)}`}
        </button>
        {showPaidActivationDemo && (
          <button className="m-ghost" type="submit" value="trial" disabled={paidBusy}>
            {c.paidDemo.startTrial}
          </button>
        )}
        {!showPaidActivationDemo && (
          <p className="m-secure">
            <Icon name="lock" size={14} />
            {CHECKOUT_URL ? c.checkout.secureNote : c.processing.note}
          </p>
        )}
        <a
          className="m-whatsapp-link"
          href={whatsappUrl(whatsappMessage)}
          target="_blank"
          rel="noopener noreferrer"
        >
          {c.checkout.whatsapp} <Icon name="diagonal" size={15} />
        </a>
      </form>
    </div>
  );

  const processingStep = (
    <div className="m-step" key="processing">
      <div className="m-card m-processing" aria-live="polite">
        <span className="m-spinner" aria-hidden="true" />
        <p className="m-step-eyebrow">{c.checkout.eyebrow}</p>
        <h2>{c.processing.title}</h2>
        <div
          className="m-progress"
          role="progressbar"
          aria-label={c.processing.title}
          aria-valuenow={stage}
          aria-valuemin={0}
          aria-valuemax={3}
        >
          <span style={{ inlineSize: `${Math.round((stage / 3) * 100)}%` }} />
        </div>
        <ol>
          {(CHECKOUT_URL ? c.processing.steps : c.simulation.steps).map((label, i) => (
            <li key={label} className={stage > i ? "is-on" : ""}>
              <span className="m-dot">
                <Icon name="check" size={12} />
              </span>
              {label}
            </li>
          ))}
        </ol>
        <p className="m-demo-note">{c.processing.note}</p>
      </div>
    </div>
  );

  const doneStep = (
    <div className="m-step" key="done">
      <div className="m-card m-done">
        {demoStatus === "active" && (
          <span className="m-done-check" aria-hidden="true">
            <svg viewBox="0 0 64 64" fill="none" stroke="currentColor">
              <circle cx="32" cy="32" r="30" strokeWidth="3" />
              <path d="M20 33.5 28.5 42 45 24" strokeWidth="4" />
            </svg>
          </span>
        )}
        <p className="m-step-eyebrow">{c.done.eyebrow}</p>
        <h2 id="m-step-heading" tabIndex={-1}>
          {CHECKOUT_URL ? c.done.title
            : paidReceipt?.membershipStatus === "active" ? c.paidDemo.receiptTitle : c.simulation.receiptTitle}
        </h2>
        {showPaidActivationDemo && paidReceipt && (
          <>
            <p className="m-step-desc">
              {paidReceipt.membershipStatus === "active" ? c.paidDemo.receiptHint : c.paidDemo.inactiveHint}
            </p>
            <section aria-label={c.simulation.statusLabel}>
              <dl className="m-paid-receipt">
                <div>
                  <dt>{c.sections.plan}</dt>
                  <dd>{paidReceipt.plan === "annual" ? c.summary.planAnnual : c.summary.planMonthly}</dd>
                </div>
                {paidReceipt.membershipPaid && (
                  <div>
                    <dt>{c.paidDemo.receiptAmount}</dt>
                    <dd>{usd(paidReceipt.amountCents / 100)}</dd>
                  </div>
                )}
                <div>
                  <dt>{c.simulation.statusCaption}</dt>
                  <dd role="status">{paidReceipt.membershipStatus === "trial"
                    ? c.paidDemo.trialStatus : c.simulation.status[paidReceipt.membershipStatus]}</dd>
                </div>
                <div>
                  <dt>{c.simulation.expires}</dt>
                  <dd>
                    <time dateTime={paidReceipt.expiresAt.slice(0, 10)}>
                      {new Intl.DateTimeFormat(language, { dateStyle: "medium", timeZone: "UTC" })
                        .format(new Date(paidReceipt.expiresAt))}
                    </time>
                  </dd>
                </div>
              </dl>
            </section>
            {paidReceipt.membershipStatus === "active" && (
              <button className="button" type="button" disabled={paidBusy}
                onClick={() => void sendPaidRequest({ action: "resend", body: { paymentId: paidReceipt.paymentId } })}>
                {c.paidDemo.resend}
              </button>
            )}
            {paidAttempt.current?.checkoutKey && paidReceipt.membershipStatus !== "canceled" && (
              <div className="m-done-actions">
                {paidReceipt.membershipPaid ? (
                  <button className="m-ghost" type="button" disabled={paidBusy}
                    onClick={() => void applyMembershipEvent("renew")}>{c.simulation.renew}</button>
                ) : (
                  <button className="button" type="button" disabled={paidBusy}
                    onClick={() => void applyMembershipEvent("activate")}>{c.paidDemo.confirm}</button>
                )}
                {(paidReceipt.membershipStatus === "active" || paidReceipt.membershipStatus === "trial") && (
                  <button className="m-ghost" type="button" disabled={paidBusy}
                    onClick={() => void applyMembershipEvent("expire")}>{c.simulation.expire}</button>
                )}
                <button className="m-ghost" type="button" disabled={paidBusy}
                  onClick={() => void applyMembershipEvent("cancel")}>{c.simulation.cancel}</button>
              </div>
            )}
            {paidFeedback.kind === "resent" && <p className="m-step-desc" role="status">{c.paidDemo.resent}</p>}
            {paidError && <p className="m-step-desc" role="alert">{paidError}</p>}
          </>
        )}
        {demoMembership && demoStatus && (
          <>
            <section aria-label={c.simulation.statusLabel}>
              <div className="m-ref">
                <span>{c.done.reference}</span>
                <strong>{demoMembership.reference}</strong>
              </div>
              <div className="m-rows">
                <div className="m-row">
                  <span>{c.simulation.statusCaption}</span>
                  <b role="status">{c.simulation.status[demoStatus]}</b>
                </div>
                <div className="m-row">
                  <span>{c.simulation.expires}</span>
                  <b>
                    <time dateTime={new Date(demoMembership.expiresAt).toISOString().slice(0, 10)}>
                      {new Intl.DateTimeFormat(language, { dateStyle: "medium", timeZone: "UTC" })
                        .format(demoMembership.expiresAt)}
                    </time>
                  </b>
                </div>
              </div>
            </section>
            {demoStatus !== "canceled" && (
              <div className="m-done-actions">
                <button
                  className="button"
                  type="button"
                  onClick={() => updateDemoMembership(renewDemoMembership(demoMembership))}
                >
                  {c.simulation.renew}
                </button>
                {demoStatus === "active" && (
                  <button
                    className="m-ghost"
                    type="button"
                    onClick={() => updateDemoMembership({
                      ...demoMembership,
                      expiresAt: Date.now(),
                      status: "expired",
                    })}
                  >
                    {c.simulation.expire}
                  </button>
                )}
                <button
                  className="m-ghost"
                  type="button"
                  onClick={() => updateDemoMembership({ ...demoMembership, status: "canceled" })}
                >
                  {c.simulation.cancel}
                </button>
              </div>
            )}
          </>
        )}
        {CHECKOUT_URL && (
          <>
            <p className="m-step-desc">{c.done.description}</p>
            <h3>{c.done.nextTitle}</h3>
            <ul className="m-next-list">
              {c.done.next.map((line, i) => (
                <li key={line}>
                  <span className="m-dot">
                    {i === 0 ? (
                      <Icon name="check" size={12} />
                    ) : i === 1 ? (
                      <Icon name="person" size={12} />
                    ) : (
                      <Icon name="sparkles" size={12} />
                    )}
                  </span>
                  {line}
                </li>
              ))}
            </ul>
          </>
        )}
        <div className="m-done-actions">
          <button
            className="button"
            type="button"
            onClick={() => navigate(ROUTES.home)}
          >
            {c.done.home}
            <Icon name="arrow" size={17} />
          </button>
          <button className="m-ghost" type="button" onClick={goBack} disabled={paidBusy}>
            {c.done.again}
          </button>
          <a
            className="m-ghost"
            href={whatsappUrl(whatsappMessage)}
            target="_blank"
            rel="noopener noreferrer"
          >
            {c.done.whatsapp}
            <Icon name="diagonal" size={15} />
          </a>
        </div>
        {!paidReceipt && (
          <p className="m-demo-note">
            {CHECKOUT_URL ? c.done.disclaimer : c.simulation.disclaimer}
          </p>
        )}
      </div>
    </div>
  );

  const bodyWidth =
    step === "processing" || step === "done"
      ? "m-layout is-centered"
      : "m-layout";
  const compact = showPaidActivationDemo && step !== "plan";
  const body: ReactNode =
    step === "plan"
      ? planStep
      : step === "checkout"
        ? checkoutStep
        : step === "processing"
          ? processingStep
          : doneStep;

  return (
    <div className="m-page">
      <a className="skip-link" href="#main">
        {language === "en" ? "Skip to content" : "Saltar al contenido"}
      </a>
      <header className="m-top">
        <div className="container m-top-inner">
          <a
            className="m-brand"
            href={ROUTES.home}
            onClick={(e) => {
              e.preventDefault();
              navigate(ROUTES.home);
            }}
            aria-label={c.home}
          >
            <span className="brand-symbol">
              <BrandMark />
            </span>
            <span>
              COPP-ADRESD<span className="brand-tm">®</span>
            </span>
          </a>
          <div className="m-top-controls">
            <button
              className="m-back-site"
              type="button"
              onClick={() => navigate(ROUTES.home)}
              aria-label={c.backSite}
            >
              <Icon name="arrow" size={16} />
              <span>{c.backSite}</span>
            </button>
            <button
              className="language-control"
              onClick={toggleLanguage}
              type="button"
              aria-label={c.language}
            >
              <Icon name="globe" size={17} />
              <span>{language.toUpperCase()}</span>
            </button>
            <span className="control-divider" />
            <button
              className="icon-button theme-control"
              onClick={toggleTheme}
              type="button"
              aria-label={theme === "light" ? c.dark : c.light}
            >
              <Icon name={theme === "light" ? "moon" : "sun"} size={19} />
            </button>
          </div>
        </div>
      </header>

      <main id="main" className={compact ? "container m-main is-compact" : "container m-main"}>
        {!compact && <div className="m-hero">
          <p className="eyebrow">
            <span />
            {c.eyebrow}
          </p>
          <h1>
            {c.hero.title[0]}
            {"\n"}
            {c.hero.title[1]}
          </h1>
          <p className="m-hero-desc">{c.hero.description}</p>
          <ul className="m-facts">
            {c.hero.facts.map((fact) => (
              <li key={fact}>
                <Icon name="check" size={14} />
                {fact}
              </li>
            ))}
          </ul>
        </div>}
        {stepper}
        <div className={bodyWidth}>
          {body}
          {step !== "processing" && !paidReceipt && summaryCard}
        </div>

        <section className="m-legal">
          <h3>{c.legalTitle}</h3>
          <p>{c.legal}</p>
        </section>
      </main>

      <footer className="m-foot">
        <div className="container m-foot-inner">
          <span>
            © {new Date().getFullYear()} COPP–ADRESD.{" "}
            {language === "en"
              ? "All rights reserved."
              : "Todos los derechos reservados."}
          </span>
          <a href={whatsappUrl()} target="_blank" rel="noopener noreferrer">
            WhatsApp · +1 (954) 682-2141
          </a>
        </div>
      </footer>
    </div>
  );
}
