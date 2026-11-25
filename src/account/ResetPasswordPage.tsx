import { useLayoutEffect, useRef, useState } from "react";
import type { FormEvent } from "react";
import { BrandMark } from "../components/BrandMark";
import { Icon } from "../components/Icon";
import { usePreferences } from "../i18n/usePreferences";
import { ROUTES } from "../router";
import "../styles/account.css";

const copy = {
  es: {
    title: "Restablecer contraseña",
    done: "Contraseña actualizada",
    doneHint: "Abre la app e inicia sesión con tu nueva contraseña.",
    password: "Nueva contraseña",
    confirmation: "Confirmar contraseña",
    passwordPlaceholder: "8 caracteres o más",
    confirmationPlaceholder: "Repite la nueva contraseña",
    hint: "Usa al menos 8 caracteres, con una mayúscula, una minúscula, un número y un símbolo.",
    submit: "Guardar contraseña",
    submitting: "Guardando…",
    language: "Cambiar idioma a inglés",
    errors: {
      invalid: "El enlace no es válido o ya venció.",
      mismatch: "Las contraseñas no coinciden.",
      policy: "La contraseña no cumple los requisitos.",
      rate: "Demasiados intentos. Espera unos minutos y vuelve a intentarlo.",
      network: "No pudimos guardar la contraseña. Intenta de nuevo.",
    },
    expiredHint: "Abre la app y solicita un nuevo enlace de recuperación.",
  },
  en: {
    title: "Reset your password",
    done: "Password updated",
    doneHint: "Open the app and sign in with your new password.",
    password: "New password",
    confirmation: "Confirm password",
    passwordPlaceholder: "8 characters or more",
    confirmationPlaceholder: "Re-enter the new password",
    hint: "Use at least 8 characters, including an uppercase letter, a lowercase letter, a number, and a symbol.",
    submit: "Save password",
    submitting: "Saving…",
    language: "Switch language to Spanish",
    errors: {
      invalid: "This link is invalid or has expired.",
      mismatch: "The passwords do not match.",
      policy: "The password does not meet the requirements.",
      rate: "Too many attempts. Wait a few minutes and try again.",
      network: "We couldn’t save your password. Try again.",
    },
    expiredHint: "Open the app and request a new recovery link.",
  },
};

const CONFIRM_PATH = "/api/auth/account/password-reset/confirm";
const gateway = (import.meta.env.VITE_GATEWAY_BASE_URL ?? "").replace(/\/+$/, "");

type ResetLink = { userId: string; token: string };
type FormError = keyof (typeof copy)["es"]["errors"];

export function ResetPasswordPage() {
  const { language, toggleLanguage } = usePreferences();
  const c = copy[language];
  const linkRead = useRef(false);
  const [link, setLink] = useState<ResetLink | null>(null);
  const [password, setPassword] = useState("");
  const [confirmation, setConfirmation] = useState("");
  const [busy, setBusy] = useState(false);
  const [done, setDone] = useState(false);
  const [error, setError] = useState<FormError | null>(null);

  useLayoutEffect(() => {
    if (linkRead.current) return;
    linkRead.current = true;
    const fragment = new URLSearchParams(window.location.hash.slice(1));
    if (window.location.hash || window.location.search) {
      window.history.replaceState(window.history.state, "", window.location.pathname);
    }
    const userId = fragment.get("userId");
    const token = fragment.get("token");
    if (userId && token) setLink({ userId, token });
    const requestedLanguage = fragment.get("lang") ??
      (window.location.pathname.replace(/\/+$/, "") === ROUTES.resetPasswordEnglish ? "en" : null);
    if ((requestedLanguage === "es" || requestedLanguage === "en") && requestedLanguage !== language) {
      toggleLanguage();
    }
  }, [language, toggleLanguage]);

  async function submit(event: FormEvent<HTMLFormElement>) {
    event.preventDefault();
    if (!link || busy) return;
    if (password !== confirmation) {
      setError("mismatch");
      return;
    }
    setBusy(true);
    setError(null);
    try {
      const response = await fetch(`${gateway}${CONFIRM_PATH}`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        credentials: "omit",
        cache: "no-store",
        redirect: "error",
        referrerPolicy: "no-referrer",
        signal: AbortSignal.timeout(15000),
        body: JSON.stringify({ ...link, newPassword: password }),
      });
      if (response.status === 204) {
        setDone(true);
        setLink(null);
        setPassword("");
        setConfirmation("");
        return;
      }
      if (response.status === 400) {
        const data = await response.json() as { code?: string };
        if (data?.code === "invalid_reset_link") {
          setLink(null);
          setPassword("");
          setConfirmation("");
          return;
        }
        if (data?.code === "password_policy") {
          setError("policy");
          return;
        }
      }
      setError(response.status === 429 ? "rate" : "network");
    } catch {
      setError("network");
    } finally {
      setBusy(false);
    }
  }

  return (
    <div className="account-page">
      <header className="account-header">
        <div className="container account-header-inner">
          <a className="account-brand" href={ROUTES.home}>
            <span className="brand-symbol"><BrandMark /></span>
            <span>Agentic Wellness IA</span>
          </a>
          <button className="language-control" type="button" onClick={toggleLanguage} aria-label={c.language}>
            <Icon name="globe" size={17} />
            <span>{language.toUpperCase()}</span>
          </button>
        </div>
      </header>
      <main className="container account-main">
        <h1>{done ? c.done : c.title}</h1>
        <section className="account-card">
          {done ? (
            <p role="status">{c.doneHint}</p>
          ) : link ? (
            <form onSubmit={submit} aria-busy={busy}>
              <p id="reset-password-hint">{c.hint}</p>
              <label>
                {c.password}
                <input
                  type="password"
                  autoComplete="new-password"
                  placeholder={c.passwordPlaceholder}
                  minLength={8}
                  maxLength={128}
                  required
                  aria-describedby="reset-password-hint"
                  value={password}
                  onChange={(event) => setPassword(event.target.value)}
                />
              </label>
              <label>
                {c.confirmation}
                <input
                  type="password"
                  autoComplete="new-password"
                  placeholder={c.confirmationPlaceholder}
                  minLength={8}
                  maxLength={128}
                  required
                  value={confirmation}
                  onChange={(event) => setConfirmation(event.target.value)}
                />
              </label>
              {error && <p className="account-error" role="alert">{c.errors[error]}</p>}
              <div className="account-actions">
                <button className="button" type="submit" disabled={busy}>
                  {busy ? c.submitting : c.submit}
                </button>
              </div>
            </form>
          ) : (
            <>
              <p className="account-error" role="alert">{c.errors.invalid}</p>
              <p>{c.expiredHint}</p>
            </>
          )}
        </section>
      </main>
    </div>
  );
}
