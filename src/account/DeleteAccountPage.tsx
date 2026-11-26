import { useEffect, useRef, useState } from "react";
import type { FormEvent } from "react";
import { contact, whatsappUrl } from "../config/contact";
import { usePreferences } from "../i18n/usePreferences";
import { Icon } from "../components/Icon";
import { BrandMark } from "../components/BrandMark";
import { ROUTES } from "../router";
import { accountContent } from "./content";
import {
  ApiError,
  cancelSession,
  confirmDeletion,
  getSession,
  lookupId,
  sendOtp,
  startFromCode,
  startWithOtp,
  startWithPassword,
} from "./api";
import type { ContactMethod, DeleteResult, SessionSummary } from "./api";
import "../styles/account.css";

type Step =
  | "info"
  | "loading"
  | "password"
  | "otp-document"
  | "otp-contact"
  | "otp-code"
  | "review"
  | "confirm"
  | "done";

type ErrorKey = keyof (typeof accountContent)["es"]["errors"];

interface Handoff {
  code: string;
  lang: "es" | "en" | null;
}

/**
 * La app del paciente abre esta página con un CÓDIGO opaco de un solo uso en el
 * fragmento (`#code=…&lang=…`), nunca con un token. Se lee UNA vez al cargar el
 * módulo, se retira de la barra y del historial, y el backend lo canjea por una
 * cookie de sesión HttpOnly que este JavaScript no puede leer.
 */
function consumeHandoff(): Handoff | null {
  const raw = window.location.hash.replace(/^#/, "");
  if (!raw) return null;
  const params = new URLSearchParams(raw);
  const code = params.get("code");
  const lang = params.get("lang");
  window.history.replaceState(
    null,
    "",
    window.location.pathname + window.location.search,
  );
  if (!code) return null;
  return { code, lang: lang === "es" || lang === "en" ? lang : null };
}

const handoff = consumeHandoff();

export function DeleteAccountPage() {
  const { language, theme, toggleLanguage, toggleTheme } = usePreferences();
  const c = accountContent[language];

  const [step, setStep] = useState<Step>("loading");
  const [documentNumber, setDocumentNumber] = useState("");
  const [password, setPassword] = useState("");
  const [showPassword, setShowPassword] = useState(false);
  const [contacts, setContacts] = useState<ContactMethod[]>([]);
  const [contactId, setContactId] = useState("");
  const [code, setCode] = useState("");
  const [typed, setTyped] = useState("");
  // Solo datos para mostrar: la sesión es una cookie HttpOnly, no un token.
  const [user, setUser] = useState<SessionSummary | null>(null);
  const [result, setResult] = useState<DeleteResult | null>(null);
  const [busy, setBusy] = useState(false);
  // Se guarda la CLAVE del error (no el texto) para que siga el idioma activo.
  const [errorKey, setErrorKey] = useState<ErrorKey | "">("");
  // Status HTTP del último fallo: se muestra como detalle (ayuda al soporte).
  const [errStatus, setErrStatus] = useState<number | null>(null);
  const started = useRef(false);

  useEffect(() => {
    document.title = c.metaTitle;
  }, [c.metaTitle]);

  // Respeta el idioma de la app que abrió la página.
  const langApplied = useRef(false);
  useEffect(() => {
    if (langApplied.current) return;
    langApplied.current = true;
    if (handoff?.lang && handoff.lang !== language) toggleLanguage();
    // Solo al montar (el ref evita el doble efecto de StrictMode).
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  const describe = (e: unknown, fallback: ErrorKey): ErrorKey => {
    if (e instanceof ApiError) {
      setErrStatus(e.status || null);
      if (e.status === 0) return "network";
      if (e.status === 429) return "tooMany";
    } else {
      setErrStatus(null);
    }
    return fallback;
  };

  const run = async (action: () => Promise<void>, fallback: ErrorKey) => {
    setBusy(true);
    setErrorKey("");
    setErrStatus(null);
    try {
      await action();
    } catch (e) {
      setErrorKey(describe(e, fallback));
    } finally {
      setBusy(false);
    }
  };

  const enterReview = (summary: SessionSummary) => {
    setUser(summary);
    setErrorKey("");
    setErrStatus(null);
    setStep("review");
  };

  /** Sin sesión válida (vencida o usada): se pide verificar la identidad. */
  const sessionLost = (key: ErrorKey) => {
    setUser(null);
    setTyped("");
    setErrorKey(key);
    setErrStatus(null);
    setStep("password");
  };

  // Al montar: canjea el código de la app o, si no hay, retoma una sesión
  // vigente (p. ej. tras recargar la página).
  useEffect(() => {
    if (started.current) return;
    started.current = true;
    const boot = handoff ? startFromCode(handoff.code) : getSession();
    boot.then(enterReview).catch((e) => {
      if (!handoff) {
        setStep("info");
      } else if (e instanceof ApiError && e.status === 401) {
        sessionLost("link");
      } else {
        sessionLost(describe(e, "generic"));
      }
    });
    // Solo al montar.
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  const doPasswordLogin = (e: FormEvent) => {
    e.preventDefault();
    void run(async () => {
      const summary = await startWithPassword(documentNumber.trim(), password);
      setPassword("");
      setShowPassword(false);
      enterReview(summary);
    }, "credentials");
  };

  const doLookup = (e: FormEvent) => {
    e.preventDefault();
    void run(async () => {
      const r = await lookupId(documentNumber.trim());
      if (r.contacts.length === 0) throw new ApiError("", 404);
      setContacts(r.contacts);
      setContactId(r.contacts[0].id);
      setStep("otp-contact");
    }, "generic");
  };

  const doSendCode = (e: FormEvent) => {
    e.preventDefault();
    void run(async () => {
      await sendOtp(documentNumber.trim(), contactId);
      setStep("otp-code");
    }, "generic");
  };

  const doVerifyCode = (e: FormEvent) => {
    e.preventDefault();
    void run(async () => {
      const summary = await startWithOtp(documentNumber.trim(), code.trim());
      setCode("");
      enterReview(summary);
    }, "code");
  };

  const confirmed = typed.trim().toLocaleUpperCase(language) === c.confirmWord;

  const doDelete = (e: FormEvent) => {
    e.preventDefault();
    if (!confirmed) {
      setErrorKey("confirm");
      setErrStatus(null);
      return;
    }
    setBusy(true);
    setErrorKey("");
    confirmDeletion()
      .then((r) => {
        setUser(null);
        setResult(r);
        setStep("done");
      })
      .catch((err) => {
        if (err instanceof ApiError && err.status === 401) {
          // La sesión venció justo al ejecutar la acción: se vuelve a verificar.
          sessionLost("session");
        } else {
          setErrorKey(describe(err, "generic"));
        }
      })
      .finally(() => setBusy(false));
  };

  /** Cancela en el servidor (la cookie deja de servir) y vuelve al inicio. */
  const doCancel = () => {
    void cancelSession()
      .catch(() => undefined)
      .finally(() => window.location.assign(ROUTES.home));
  };

  const goto = (next: Step) => {
    setErrorKey("");
    setErrStatus(null);
    setStep(next);
  };

  const fullName = user ? `${user.firstName} ${user.lastName}`.trim() : "";
  const initials = fullName
    .split(/\s+/)
    .filter(Boolean)
    .slice(0, 2)
    .map((part) => part[0])
    .join("")
    .toLocaleUpperCase(language);

  const deletionDate = result?.purgeAfter
    ? new Date(result.purgeAfter).toLocaleDateString(
        language === "es" ? "es-ES" : "en-US",
        { year: "numeric", month: "long", day: "numeric" },
      )
    : null;

  const accountCard = user && (
    <div className="account-user">
      <span className="account-avatar" aria-hidden="true">
        {initials}
      </span>
      <div>
        <small>{c.accountLabel}</small>
        <strong>{fullName}</strong>
        <span>{user.email}</span>
        <span>{c.accountApp}</span>
      </div>
    </div>
  );

  return (
    <div className="account-page">
      <header className="account-header">
        <div className="container account-header-inner">
          <a className="account-brand" href={ROUTES.home} aria-label={c.home}>
            <span className="brand-symbol">
              <BrandMark />
            </span>
            <span>
              Agentic Wellness <b className="brand-ai">AI</b>
            </span>
          </a>
          <div className="account-controls">
            <button
              className="language-control"
              onClick={toggleLanguage}
              type="button"
            >
              <Icon name="globe" size={17} />
              <span>{language.toUpperCase()}</span>
            </button>
            <button
              className="icon-button theme-control"
              onClick={toggleTheme}
              type="button"
              aria-label={theme === "light" ? "Dark" : "Light"}
            >
              <Icon name={theme === "light" ? "moon" : "sun"} size={19} />
            </button>
          </div>
        </div>
      </header>

      <main className="container account-main">
        <p className="eyebrow">
          <span />
          {c.eyebrow}
        </p>
        <h1>{step === "done" ? c.doneTitle : c.title}</h1>

        <section className="account-card" aria-live="polite">
          {step === "loading" && <p>{c.loading}</p>}

          {step === "info" && (
            <>
              <p>{c.intro}</p>
              <ul className="account-effects">
                {c.effects.map((line) => (
                  <li key={line}>{line}</li>
                ))}
              </ul>
              <button
                className="button"
                type="button"
                onClick={() => goto("password")}
              >
                {c.start}
              </button>
            </>
          )}

          {step === "password" && (
            <form onSubmit={doPasswordLogin}>
              <h2>{c.loginTitle}</h2>
              <p className="account-hint">{c.loginHint}</p>
              <label>
                {c.document}
                <input
                  inputMode="text"
                  autoComplete="username"
                  required
                  value={documentNumber}
                  onChange={(e) => setDocumentNumber(e.target.value)}
                />
              </label>
              <label>
                {c.password}
                <span className="account-password">
                  <input
                    type={showPassword ? "text" : "password"}
                    autoComplete="current-password"
                    required
                    value={password}
                    onChange={(e) => setPassword(e.target.value)}
                  />
                  <button
                    type="button"
                    className="account-eye"
                    aria-label={showPassword ? c.hidePassword : c.showPassword}
                    aria-pressed={showPassword}
                    onClick={() => setShowPassword((v) => !v)}
                  >
                    <Icon name={showPassword ? "eyeOff" : "eye"} size={20} />
                  </button>
                </span>
              </label>
              <div className="account-actions">
                <button className="button" type="submit" disabled={busy}>
                  {busy ? c.working : c.login}
                </button>
                <button
                  className="account-link"
                  type="button"
                  onClick={() => goto("otp-document")}
                >
                  {c.noPassword}
                </button>
              </div>
            </form>
          )}

          {step === "otp-document" && (
            <form onSubmit={doLookup}>
              <h2>{c.loginTitle}</h2>
              <label>
                {c.document}
                <input
                  autoComplete="username"
                  required
                  value={documentNumber}
                  onChange={(e) => setDocumentNumber(e.target.value)}
                />
              </label>
              <div className="account-actions">
                <button className="button" type="submit" disabled={busy}>
                  {busy ? c.working : c.start}
                </button>
                <button
                  className="account-link"
                  type="button"
                  onClick={() => goto("password")}
                >
                  {c.usePassword}
                </button>
              </div>
            </form>
          )}

          {step === "otp-contact" && (
            <form onSubmit={doSendCode}>
              <h2>{c.chooseContact}</h2>
              <fieldset className="account-contacts">
                {contacts.map((m) => (
                  <label key={m.id} className="account-radio">
                    <input
                      type="radio"
                      name="contact"
                      value={m.id}
                      checked={contactId === m.id}
                      onChange={() => setContactId(m.id)}
                    />
                    {m.label}
                  </label>
                ))}
              </fieldset>
              <div className="account-actions">
                <button className="button" type="submit" disabled={busy}>
                  {busy ? c.working : c.sendCode}
                </button>
              </div>
            </form>
          )}

          {step === "otp-code" && (
            <form onSubmit={doVerifyCode}>
              <h2>{c.codeLabel}</h2>
              <label>
                {c.codeLabel}
                <input
                  inputMode="numeric"
                  autoComplete="one-time-code"
                  required
                  value={code}
                  onChange={(e) => setCode(e.target.value)}
                />
              </label>
              <div className="account-actions">
                <button className="button" type="submit" disabled={busy}>
                  {busy ? c.working : c.verify}
                </button>
              </div>
            </form>
          )}

          {step === "review" && (
            <>
              {accountCard}
              <h2>{c.reviewTitle}</h2>
              <h3>{c.happenTitle}</h3>
              <ul className="account-effects">
                {c.happen.map((line) => (
                  <li key={line}>{line}</li>
                ))}
              </ul>
              <h3>{c.knowTitle}</h3>
              <ul className="account-effects">
                {c.know.map((line) => (
                  <li key={line}>{line}</li>
                ))}
              </ul>
              <div className="account-actions">
                <button
                  className="button"
                  type="button"
                  onClick={() => goto("confirm")}
                >
                  {c.review}
                </button>
                <button
                  className="account-link"
                  type="button"
                  onClick={doCancel}
                >
                  {c.cancel}
                </button>
              </div>
            </>
          )}

          {step === "confirm" && (
            <form onSubmit={doDelete}>
              {accountCard}
              <h2>{c.confirmTitle}</h2>
              <p>{c.confirmText.replace("{word}", c.confirmWord)}</p>
              <label>
                <input
                  autoComplete="off"
                  autoCapitalize="characters"
                  placeholder={c.confirmWord}
                  value={typed}
                  onChange={(e) => setTyped(e.target.value)}
                />
              </label>
              <div className="account-actions">
                <button
                  className="button account-danger"
                  type="submit"
                  disabled={busy || !confirmed}
                >
                  {busy ? c.working : c.delete}
                </button>
                <button
                  className="account-link"
                  type="button"
                  onClick={doCancel}
                >
                  {c.cancel}
                </button>
              </div>
            </form>
          )}

          {step === "done" && (
            <>
              <p>{c.doneText}</p>
              {deletionDate && (
                <p>{c.doneDate.replace("{date}", deletionDate)}</p>
              )}
              <a className="button" href={ROUTES.home}>
                {c.home}
              </a>
            </>
          )}

          {errorKey && (
            <p className="account-error" role="alert">
              {c.errors[errorKey]}
              {errStatus !== null && errStatus > 0 && (
                <span className="account-error-code">
                  {" "}
                  (código {errStatus})
                </span>
              )}
            </p>
          )}
        </section>

        <p className="account-hint">
          {c.support}{" "}
          <a href={whatsappUrl()} target="_blank" rel="noreferrer">
            WhatsApp {contact.displayNumber}
          </a>
        </p>
      </main>
    </div>
  );
}
