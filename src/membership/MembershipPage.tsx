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

/** Verificación de Luhn: realismo del formulario demo (mínimo 13 dígitos). */
function luhnValid(value: string): boolean {
  const n = digitsOf(value);
  if (n.length < 13) return false;
  let sum = 0;
  let double = false;
  for (let i = n.length - 1; i >= 0; i--) {
    let digit = Number(n[i]);
    if (double) {
      digit *= 2;
      if (digit > 9) digit -= 9;
    }
    sum += digit;
    double = !double;
  }
  return sum % 10 === 0;
}

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

const STEP_ORDER: Step[] = ["plan", "checkout", "processing", "done"];
const PROCESS_STAGE_MS = 900;

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

  const [plan, setPlan] = useState<PlanId>("annual");
  const [step, setStep] = useState<Step>("plan");
  const [stage, setStage] = useState(0);
  const [orderRef, setOrderRef] = useState("");
  const [form, setForm] = useState<CardForm>(EMPTY_FORM);
  const [showErrors, setShowErrors] = useState(false);

  const timers = useRef<number[]>([]);
  const firstRun = useRef(true);

  const totals = totalsOf({ plan });
  const dueToday = useCountUp(totals.dueToday);

  useEffect(() => {
    document.title = c.metaTitle;
  }, [c.metaTitle]);

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
    timers.current.forEach(clearTimeout);
    setStage(0);
    setStep("plan");
  };

  const selectionText =
    plan === "annual"
      ? `${c.summary.planAnnual} (${usd(totals.planYear)} ${c.sections.recurring})`
      : `${c.summary.planMonthly} (${usd(totals.monthly)} ${c.sections.recurringMonth})`;

  const startProcessing = () => {
    timers.current.forEach(clearTimeout);
    setStage(0);
    setOrderRef(
      `CO-${Date.now().toString(36).toUpperCase().slice(-6).padStart(6, "0")}`,
    );
    setStep("processing");
    for (let i = 1; i <= 3; i++) {
      timers.current.push(
        window.setTimeout(() => setStage(i), i * PROCESS_STAGE_MS),
      );
    }
    timers.current.push(
      window.setTimeout(() => setStep("done"), 3 * PROCESS_STAGE_MS + 400),
    );
  };

  /* ---------------- Validación del formulario demo ---------------- */
  const nameOk = form.name.trim().length >= 2;
  const emailOk = /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(form.email.trim());
  const cardOk = luhnValid(form.card);
  const expOk = /^(0[1-9]|1[0-2])\/\d{2}$/.test(form.exp);
  const cscOk = /^\d{3,4}$/.test(form.csc);
  const formOk = nameOk && emailOk && cardOk && expOk && cscOk;

  const onPay = (event: FormEvent<HTMLFormElement>) => {
    event.preventDefault();
    if (CHECKOUT_URL) {
      // Pasarela real: mismo contrato client_reference_id que el mock original.
      const url = `${CHECKOUT_URL}${CHECKOUT_URL.includes("?") ? "&" : "?"}client_reference_id=${encodeURIComponent(selectionReference({ plan }))}`;
      window.location.assign(url);
      return;
    }
    if (!formOk) {
      setShowErrors(true);
      window.setTimeout(() => {
        document
          .querySelector<HTMLDivElement>(".m-checkout .m-field.has-error input")
          ?.focus();
      }, 30);
      return;
    }
    startProcessing();
  };

  const whatsappMessage = c.whatsappMessage(
    selectionText,
    usd(totals.dueToday),
  );
  const fieldClass = (ok: boolean) =>
    `m-field${showErrors && !ok ? " has-error" : ""}`;

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
          {c.summary.continue}
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
      <form className="m-card m-checkout" onSubmit={onPay} noValidate>
        <button type="button" className="m-back" onClick={goBack}>
          {c.checkout.back}
          <Icon name="chevron" size={16} />
        </button>
        <p className="m-step-eyebrow">
          <span className="m-progress-dot" aria-hidden="true" />
          {c.checkout.eyebrow}
        </p>
        <h2 id="m-step-heading" tabIndex={-1}>
          {c.checkout.title}
        </h2>
        <p className="m-step-desc">{c.checkout.description}</p>

        <fieldset className="m-fieldset">
          <legend>{c.checkout.contactTitle}</legend>
          <div className={fieldClass(nameOk)}>
            <label htmlFor="m-name">{c.checkout.name}</label>
            <input
              id="m-name"
              name="name"
              autoComplete="name"
              enterKeyHint="next"
              value={form.name}
              onChange={(e) => {
                setForm({ ...form, name: e.target.value });
                setShowErrors(false);
              }}
            />
            <span className="m-error" role="alert">
              {showErrors && !nameOk ? c.checkout.errorForm : ""}
            </span>
          </div>
          <div className={fieldClass(emailOk)}>
            <label htmlFor="m-email">{c.checkout.email}</label>
            <input
              id="m-email"
              name="email"
              type="email"
              autoComplete="email"
              enterKeyHint="next"
              value={form.email}
              onChange={(e) => {
                setForm({ ...form, email: e.target.value });
                setShowErrors(false);
              }}
            />
            <span className="m-error" role="alert">
              {showErrors && !emailOk ? c.checkout.errorForm : ""}
            </span>
          </div>
        </fieldset>

        <fieldset className="m-fieldset is-card">
          <legend>
            <Icon name="card" size={17} />
            {c.checkout.cardTitle}
          </legend>
          <div className={fieldClass(cardOk)}>
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
                setShowErrors(false);
              }}
            />
            <span className="m-error" role="alert">
              {showErrors && !cardOk ? c.checkout.errorCard : ""}
            </span>
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
            <div className={fieldClass(expOk)}>
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
                placeholder="MM/AA"
                enterKeyHint="next"
                value={form.exp}
                onChange={(e) => {
                  setForm({ ...form, exp: formatExpiry(e.target.value) });
                  setShowErrors(false);
                }}
              />
              <span className="m-error" role="alert">
                {showErrors && !expOk ? c.checkout.errorForm : ""}
              </span>
            </div>
            <div className={fieldClass(cscOk)}>
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
                  setShowErrors(false);
                }}
              />
              <span className="m-error" role="alert">
                {showErrors && !cscOk ? c.checkout.errorForm : ""}
              </span>
            </div>
          </div>
        </fieldset>

        <button className="button m-cta" type="submit">
          <Icon name="lock" size={16} />
          {c.checkout.pay} {usd(totals.dueToday)}
        </button>
        <p className="m-secure">
          <Icon name="lock" size={14} />
          {c.checkout.secureNote}
        </p>
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
          {c.processing.steps.map((label, i) => (
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
        <span className="m-done-check" aria-hidden="true">
          <svg viewBox="0 0 64 64" fill="none" stroke="currentColor">
            <circle cx="32" cy="32" r="30" strokeWidth="3" />
            <path d="M20 33.5 28.5 42 45 24" strokeWidth="4" />
          </svg>
        </span>
        <p className="m-step-eyebrow">{c.done.eyebrow}</p>
        <h2 id="m-step-heading" tabIndex={-1}>
          {c.done.title}
        </h2>
        <p className="m-step-desc">{c.done.description}</p>
        <div className="m-ref">
          <span>{c.done.reference}</span>
          <strong>{orderRef}</strong>
        </div>
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
        <div className="m-done-actions">
          <button
            className="button"
            type="button"
            onClick={() => navigate(ROUTES.home)}
          >
            {c.done.home}
            <Icon name="arrow" size={17} />
          </button>
          <button className="m-ghost" type="button" onClick={goBack}>
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
        <p className="m-demo-note">{c.done.disclaimer}</p>
      </div>
    </div>
  );

  const bodyWidth =
    step === "processing" || step === "done"
      ? "m-layout is-centered"
      : "m-layout";
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

      <main id="main" className="container m-main">
        <div className="m-hero">
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
        </div>
        {stepper}
        <div className={bodyWidth}>
          {body}
          {step !== "processing" && summaryCard}
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
