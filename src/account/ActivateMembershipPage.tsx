import { useEffect, useLayoutEffect, useRef, useState } from "react";
import type { FormEvent } from "react";
import { BrandMark } from "../components/BrandMark";
import { Icon } from "../components/Icon";
import { usePreferences } from "../i18n/usePreferences";
import { getPaidDemoSetup, postPaidDemo } from "../membership/paidActivationDemo";
import { ROUTES } from "../router";
import "../styles/account.css";

const copy = {
  es: {
    title: "Activa tu membresía",
    loading: "Verificando tu enlace…",
    hint: "Continúa para verificar el enlace de tu pago simulado.",
    continue: "Continuar activación",
    email: "Correo electrónico",
    password: "Contraseña",
    passwordPlaceholder: "Tu contraseña actual",
    signIn: "Iniciar sesión y vincular membresía",
    signInLinked: "Iniciar sesión para continuar",
    signInHint: "Inicia sesión con la cuenta que usa este correo para vincular el pago simulado.",
    setup: "Continúa la configuración de tu cuenta",
    firstName: "Nombre",
    lastName: "Apellido",
    emergencyName: "Nombre del contacto de emergencia",
    emergencyPhone: "Teléfono del contacto de emergencia",
    emergencyPhonePrefix: "Prefijo internacional",
    emergencyPhoneCountries: { colombia: "+57 Colombia", northAmerica: "+1 EE. UU. y Canadá", other: "Otro país" },
    emergencyPhoneInternationalPlaceholder: "+ código y número",
    terms: "Términos y privacidad",
    accept: "Acepto",
    newPassword: "Nueva contraseña",
    confirmPassword: "Confirmar contraseña",
    passwordHint: "Usa al menos 8 caracteres, con mayúscula, minúscula, número y símbolo.",
    newPasswordPlaceholder: "8 caracteres o más",
    confirmPasswordPlaceholder: "Repite la nueva contraseña",
    create: "Crear cuenta",
    creating: "Creando tu cuenta…",
    linked: "Membresía vinculada",
    linkedHint: "Tu cuenta está lista para elegir tu objetivo.",
    continueToGoal: "Continúa a tu objetivo",
    invalid: "Este enlace de bienvenida no es válido o venció.",
    invalidHint: "Puedes solicitar otro enlace desde la confirmación del pago simulado.",
    retry: "Intentar de nuevo",
    language: "Cambiar idioma a inglés",
    errors: {
      failed: "No pudimos continuar la activación. Intenta de nuevo.",
      signIn: "No pudimos iniciar sesión. Verifica tus credenciales e intenta de nuevo.",
      rate: "Espera un momento e intenta de nuevo.",
      password: "La contraseña no cumple los requisitos.",
      mismatch: "Las contraseñas no coinciden.",
      contact: "Completa los nombres y verifica el teléfono de emergencia.",
      phone: "Ingresa 10 dígitos para Colombia o EE. UU. y Canadá. Para Otro país, incluye el prefijo con +.",
      documents: "Los documentos cambiaron. Lee y acepta las versiones vigentes.",
      unavailable: "Los documentos de esta activación no están disponibles. Intenta de nuevo.",
    },
  },
  en: {
    title: "Activate your membership",
    loading: "Checking your link…",
    hint: "Continue to verify your simulated payment link.",
    continue: "Continue activation",
    email: "Email",
    password: "Password",
    passwordPlaceholder: "Your current password",
    signIn: "Sign in and link membership",
    signInLinked: "Sign in to continue",
    signInHint: "Sign in to the account that uses this email to link the simulated payment.",
    setup: "Continue account setup",
    firstName: "First name",
    lastName: "Last name",
    emergencyName: "Emergency contact name",
    emergencyPhone: "Emergency contact phone",
    emergencyPhonePrefix: "International dialing code",
    emergencyPhoneCountries: { colombia: "+57 Colombia", northAmerica: "+1 United States and Canada", other: "Other country" },
    emergencyPhoneInternationalPlaceholder: "+ code and number",
    terms: "Terms and privacy",
    accept: "I accept",
    newPassword: "New password",
    confirmPassword: "Confirm password",
    passwordHint: "Use at least 8 characters with uppercase, lowercase, a number, and a symbol.",
    newPasswordPlaceholder: "8 characters or more",
    confirmPasswordPlaceholder: "Re-enter the new password",
    create: "Create account",
    creating: "Creating your account…",
    linked: "Membership linked",
    linkedHint: "Your account is ready. You can choose your goal now.",
    continueToGoal: "Continue to your goal",
    invalid: "This welcome link is invalid or expired.",
    invalidHint: "You can request a new link from the simulated payment confirmation.",
    retry: "Try again",
    language: "Switch language to Spanish",
    errors: {
      failed: "We couldn’t continue activation. Try again.",
      signIn: "We couldn’t sign you in. Check your credentials and try again.",
      rate: "Wait a moment and try again.",
      password: "Your password doesn’t meet the requirements.",
      mismatch: "The passwords don’t match.",
      contact: "Complete the names and check the emergency contact phone number.",
      phone: "Enter 10 digits for Colombia or the United States and Canada. For Other country, include the dialing code with +.",
      documents: "The documents have changed. Read and accept the current versions.",
      unavailable: "The activation documents are unavailable. Try again.",
    },
  },
};

type WelcomeLink = { paymentId: string; token: string };
type LegalDocument = { code: string; title: string; content: string; versionId: string };
type SetupSession = {
  paymentId: string;
  status: "welcome" | "sign_in_required" | "setup_required" | "linked";
  email?: string;
  documents?: LegalDocument[];
  appUrl?: string;
};
type ErrorKind = keyof (typeof copy)["es"]["errors"];

const emergencyPhonePrefixes = ["+57", "+1"];
const internationalPhone = /^\+[1-9][0-9]{7,14}$/;

function removePhoneSeparators(value: string): string {
  return value.replace(/[\s().-]/g, "");
}

class ActivationError extends Error {
  constructor(readonly key: ErrorKind) { super(key); }
}

function readWelcomeLink(): WelcomeLink | null {
  const fragment = new URLSearchParams(window.location.hash.slice(1));
  const paymentId = fragment.get("paymentId");
  const token = fragment.get("token");
  return paymentId && token ? { paymentId, token } : null;
}

async function readSetup(): Promise<SetupSession | null> {
  const response = await getPaidDemoSetup();
  if (response.status === 404 || response.status === 400) return null;
  if (!response.ok) {
    const result = await response.json().catch(() => null) as { code?: string } | null;
    if (result?.code === "consent_unavailable") throw new ActivationError("unavailable");
    throw new ActivationError(response.status === 429 ? "rate" : "failed");
  }
  return await response.json() as SetupSession;
}

async function openSetup(): Promise<SetupSession | null> {
  const link = readWelcomeLink();
  if (link) {
    const response = await postPaidDemo("prepare", link);
    const invalid = response.status === 400 || response.status === 404;
    if (!response.ok && !invalid) throw new ActivationError(response.status === 429 ? "rate" : "failed");
    // Conserva el enlace mientras la red falle, y lo limpia al emitir la cookie de continuación.
    window.history.replaceState(null, "", window.location.pathname);
    if (invalid) return null;
  }
  return readSetup();
}

async function signInAccount(email: string, password: string): Promise<string> {
  const response = await postPaidDemo("login", {
    email,
    password,
    application: "app",
    rememberMe: false,
  });
  if (!response.ok) {
    throw new ActivationError(response.status === 429 ? "rate" : response.status >= 500 ? "failed" : "signIn");
  }
  const { accessToken } = await response.json() as { accessToken?: unknown };
  if (typeof accessToken !== "string" || !accessToken) throw new ActivationError("failed");
  return accessToken;
}

function trustedAppUrl(value?: string): string | null {
  if (!value || !URL.canParse(value)) return null;
  const url = new URL(value);
  if (!["http:", "https:"].includes(url.protocol)
    || url.hostname !== window.location.hostname
    || !["127.0.0.1", "localhost", "[::1]"].includes(url.hostname)
    || url.pathname !== "/"
    || url.search !== "?wellnessJourney=1"
    || url.username || url.password || url.hash) {
    return null;
  }
  return url.href;
}

export function ActivateMembershipPage() {
  const { language, theme, toggleLanguage, toggleTheme } = usePreferences();
  const c = copy[language];
  const [session, setSession] = useState<SetupSession | null | undefined>();
  const [startupError, setStartupError] = useState<ErrorKind | null>(null);
  const [loadRevision, setLoadRevision] = useState(0);
  const setupRequest = useRef<{ revision: number; result: Promise<SetupSession | null> } | null>(null);
  const [appLink, setAppLink] = useState<string | null>(null);
  const [password, setPassword] = useState("");
  const [busy, setBusy] = useState(false);
  const [error, setError] = useState<ErrorKind | null>(null);
  const [phonePrefix, setPhonePrefix] = useState<string>();
  const [phoneNumber, setPhoneNumber] = useState("");
  const initialized = useRef(false);
  const sending = useRef(false);
  const heading = useRef<HTMLHeadingElement>(null);
  const passwordInput = useRef<HTMLInputElement>(null);
  const status = session?.status;
  const selectedPhonePrefix = phonePrefix ?? (language === "es" ? "+57" : "+1");
  const needsPassword = status === "sign_in_required" || (status === "linked" && !appLink);
  const title = status === "linked" ? c.linked : status === "setup_required" ? c.setup
    : session === undefined && !startupError ? c.loading : c.title;

  useLayoutEffect(() => {
    if (initialized.current) return;
    initialized.current = true;
    const fragment = new URLSearchParams(window.location.hash.slice(1));
    const englishPath = window.location.pathname.replace(/\/+$/, "") === ROUTES.activateMembershipEnglish;
    const requestedLanguage = fragment.get("lang") ?? (englishPath ? "en" : "es");
    if ((requestedLanguage === "en" || requestedLanguage === "es") && requestedLanguage !== language) {
      toggleLanguage();
    }
  }, [language, toggleLanguage]);

  useEffect(() => {
    let active = true;
    // React y una recarga voluntaria solo preparan una continuación por intento.
    if (setupRequest.current?.revision !== loadRevision) {
      setupRequest.current = { revision: loadRevision, result: openSetup() };
    }
    void setupRequest.current.result.then(
      (nextSession) => { if (active) setSession(nextSession); },
      (failure: unknown) => {
        if (!active) return;
        setStartupError(failure instanceof ActivationError ? failure.key : "failed");
      },
    );
    return () => { active = false; };
  }, [loadRevision]);

  useEffect(() => { document.title = title; }, [title]);

  useEffect(() => {
    if (needsPassword) passwordInput.current?.focus();
    if (status === "setup_required" || (status === "linked" && appLink)) heading.current?.focus();
  }, [status, needsPassword, appLink]);

  function retrySetup() {
    setStartupError(null);
    setError(null);
    setSession(undefined);
    setPassword("");
    setAppLink(null);
    setLoadRevision(loadRevision + 1);
  }

  function markReady(next: SetupSession) {
    const url = trustedAppUrl(next.appUrl);
    if (!url) throw new ActivationError("failed");
    setSession(next);
    setAppLink(url);
  }

  async function redeem(event: FormEvent<HTMLFormElement>) {
    event.preventDefault();
    if (!session || sending.current) return;
    sending.current = true;
    setBusy(true);
    setError(null);
    const enteredPassword = password;
    setPassword("");
    let signedIn = false;
    try {
      const email = session.email;
      if (needsPassword && !email) throw new ActivationError("failed");
      const accessToken = needsPassword && email ? await signInAccount(email, enteredPassword) : undefined;
      signedIn = Boolean(accessToken);
      if (status === "linked") {
        markReady(session);
        return;
      }
      const response = await postPaidDemo("redeem", { paymentId: session.paymentId }, accessToken);
      if (response.status === 429) throw new ActivationError("rate");
      const result = await response.json() as Partial<SetupSession> & { code?: string };
      if (response.status === 400 && result.code === "invalid_activation_link") {
        setSession(null);
        return;
      }
      if (response.status === 409 && result.code === "sign_in_required" && result.email) {
        setSession({ ...session, status: "sign_in_required", email: result.email });
        return;
      }
      if (!response.ok) throw new ActivationError("failed");
      if (result.status === "linked" && accessToken) {
        markReady({ ...session, ...result, status: "linked" });
        return;
      }
      const next = await readSetup();
      setSession(next);
    } catch (failure) {
      // Si la respuesta se pierde después de consumir el enlace, el servidor conserva el avance.
      try {
        const next = await readSetup();
        if (next && (next.status === "linked"
          || (session.status === "welcome" && next.status === "setup_required"))) {
          if (next.status === "linked" && signedIn) markReady(next);
          else setSession(next);
          return;
        }
      } catch {
        // La sesión del formulario sigue disponible para reintentar.
      }
      setError(failure instanceof ActivationError ? failure.key : "failed");
    } finally {
      sending.current = false;
      setBusy(false);
    }
  }

  function updateEmergencyPhone(value: string) {
    const entered = removePhoneSeparators(value);
    if (internationalPhone.test(entered)) {
      const prefix = emergencyPhonePrefixes.find((code) => entered.startsWith(code)) ?? "";
      setPhonePrefix(prefix);
      setPhoneNumber(entered.slice(prefix.length));
    } else {
      setPhoneNumber(value);
    }
    if (error === "phone") setError(null);
  }

  async function complete(event: FormEvent<HTMLFormElement>) {
    event.preventDefault();
    if (!session || sending.current) return;
    const form = event.currentTarget;
    const data = new FormData(form);
    const newPassword = String(data.get("password") ?? "");
    if (newPassword !== data.get("passwordConfirmation")) {
      setError("mismatch");
      return;
    }
    const versionIds = data.getAll("versionId").map(String);
    if (versionIds.length !== 2) {
      setError("unavailable");
      return;
    }
    const phone = removePhoneSeparators(String(data.get("emergencyPhone") ?? ""));
    const emergencyPhone = phone.startsWith("+") ? phone : selectedPhonePrefix + phone;
    const matchesPrefix = !selectedPhonePrefix || (emergencyPhone.startsWith(selectedPhonePrefix)
      && emergencyPhone.length === selectedPhonePrefix.length + 10);
    if (!internationalPhone.test(emergencyPhone) || !matchesPrefix) {
      setError("phone");
      form.querySelector<HTMLInputElement>('[name="emergencyPhone"]')?.focus();
      return;
    }
    const body = {
      firstName: String(data.get("firstName") ?? "").trim(),
      lastName: String(data.get("lastName") ?? "").trim(),
      emergencyName: String(data.get("emergencyName") ?? "").trim(),
      emergencyPhone,
      password: newPassword,
      versionIds,
    };
    sending.current = true;
    setBusy(true);
    setError(null);
    const fields = form.querySelectorAll<HTMLInputElement>('input[type="password"]');
    fields.forEach((field) => { field.value = ""; });
    try {
      let response: Response | undefined;
      try {
        response = await postPaidDemo("complete", body);
      } catch {
        // La consulta siguiente distingue un alta ya guardada de un fallo previo a escribir.
      }
      if (response?.status === 429) throw new ActivationError("rate");
      const result = await response?.json().catch(() => null) as (Partial<SetupSession> & { code?: string }) | null | undefined;
      if (response?.status === 400 && result?.code === "password_policy") throw new ActivationError("password");
      if (response?.status === 400 && result?.code === "invalid_contact_details") throw new ActivationError("contact");
      if (response?.status === 409 && result?.code === "sign_in_required") {
        setSession({ ...session, status: "sign_in_required" });
        return;
      }
      const next = response?.ok && result?.status === "linked"
        ? { ...session, ...result, status: "linked" as const }
        : await readSetup();
      if (!next) {
        setSession(null);
        return;
      }
      setSession(next);
      if (next.status === "sign_in_required") return;
      if (next.status !== "linked" || !next.email) {
        const staleDocuments = (next.documents ?? []).some(({ versionId }) => !versionIds.includes(versionId));
        throw new ActivationError(staleDocuments ? "documents" : "failed");
      }
      await signInAccount(next.email, newPassword);
      markReady(next);
    } catch (failure) {
      setError(failure instanceof ActivationError ? failure.key : "failed");
    } finally {
      sending.current = false;
      setBusy(false);
    }
  }

  const documents = session?.documents ?? [];
  const hasDocuments = documents.length === 2 && documents[0].versionId !== documents[1].versionId;

  return (
    <div className="account-page">
      <header className="account-header">
        <div className="container account-header-inner">
          <a className="account-brand" href={ROUTES.home}>
            <span className="brand-symbol"><BrandMark /></span>
            <span>Agentic Wellness IA</span>
          </a>
          <div className="account-controls">
            <button className="language-control" type="button" onClick={toggleLanguage} aria-label={c.language}>
              <Icon name="globe" size={17} />
              <span>{language.toUpperCase()}</span>
            </button>
            <button className="icon-button theme-control" type="button" onClick={toggleTheme} aria-label={
              language === "es" ? theme === "light" ? "Tema oscuro" : "Tema claro"
                : theme === "light" ? "Dark theme" : "Light theme"
            }>
              <Icon name={theme === "light" ? "moon" : "sun"} size={18} />
            </button>
          </div>
        </div>
      </header>
      <main className="container account-main">
        <h1 ref={heading} tabIndex={-1}>{title}</h1>
        <section className="account-card" aria-busy={busy || (session === undefined && !startupError)}>
          {startupError ? (
            <>
              <p className="account-error" role="alert">{c.errors[startupError]}</p>
              <button className="button" type="button" onClick={retrySetup}>{c.retry}</button>
            </>
          ) : session === undefined ? (
            <span role="status" className="account-loading" aria-label={c.loading} />
          ) : session === null ? (
            <>
              <p className="account-error" role="alert">{c.invalid}</p>
              <p>{c.invalidHint}</p>
            </>
          ) : appLink ? (
            <>
              <p role="status">{c.linkedHint}</p>
              <div className="account-actions">
                <a className="button" href={appLink}>{c.continueToGoal}</a>
              </div>
            </>
          ) : status === "setup_required" ? (
            hasDocuments ? (
              <form onSubmit={complete} aria-busy={busy}>
                <fieldset className="account-activation-terms" disabled={busy}>
                  <legend>{c.terms}</legend>
                  {documents.map((document) => (
                    <div className="account-activation-document" key={document.versionId}>
                      <details>
                        <summary>{document.title}</summary>
                        <div className="account-document-text">{document.content}</div>
                      </details>
                      <label className="account-activation-checkbox">
                        <input type="checkbox" name="versionId" value={document.versionId} required />
                        <span>{c.accept} {document.title}</span>
                      </label>
                    </div>
                  ))}
                </fieldset>
                <fieldset className="account-activation-fields" disabled={busy}>
                  <div className="account-activation-names">
                    <label>
                      {c.firstName}
                      <input name="firstName" autoComplete="given-name" required maxLength={100} />
                    </label>
                    <label>
                      {c.lastName}
                      <input name="lastName" autoComplete="family-name" required maxLength={100} />
                    </label>
                  </div>
                  <label>
                    {c.emergencyName}
                    <input name="emergencyName" required maxLength={100} />
                  </label>
                  <div className="account-activation-phone">
                    <label htmlFor="activation-emergency-phone">{c.emergencyPhone}</label>
                    <div className="account-activation-phone-fields">
                      <select
                        className="account-activation-prefix"
                        aria-label={c.emergencyPhonePrefix}
                        value={selectedPhonePrefix}
                        onChange={(event) => {
                          setPhonePrefix(event.target.value);
                          if (error === "phone") setError(null);
                        }}
                      >
                        <option value="+57">{c.emergencyPhoneCountries.colombia}</option>
                        <option value="+1">{c.emergencyPhoneCountries.northAmerica}</option>
                        <option value="">{c.emergencyPhoneCountries.other}</option>
                      </select>
                      <input
                        id="activation-emergency-phone"
                        name="emergencyPhone"
                        type="tel"
                        inputMode={selectedPhonePrefix ? "numeric" : "tel"}
                        autoComplete="off"
                        value={phoneNumber}
                        onChange={(event) => updateEmergencyPhone(event.target.value)}
                        placeholder={
                          selectedPhonePrefix === "+57" ? "300 123 4567"
                            : selectedPhonePrefix === "+1" ? "202 555 0142"
                              : c.emergencyPhoneInternationalPlaceholder
                        }
                        aria-invalid={error === "phone" ? true : undefined}
                        aria-describedby={error === "phone" ? "activation-emergency-phone-error" : undefined}
                        required
                        maxLength={24}
                      />
                    </div>
                    {error === "phone" && <p className="account-error" id="activation-emergency-phone-error" role="alert">{c.errors.phone}</p>}
                  </div>
                  {session.email && (
                    <label>
                      {c.email}
                      <input type="email" name="username" autoComplete="username" value={session.email} readOnly />
                    </label>
                  )}
                  <label>
                    {c.newPassword}
                    <input name="password" type="password" autoComplete="new-password" placeholder={c.newPasswordPlaceholder} minLength={8} maxLength={128} aria-describedby="activation-password-hint" required />
                  </label>
                  <p className="account-hint" id="activation-password-hint">{c.passwordHint}</p>
                  <label>
                    {c.confirmPassword}
                    <input name="passwordConfirmation" type="password" autoComplete="new-password" placeholder={c.confirmPasswordPlaceholder} minLength={8} maxLength={128} required />
                  </label>
                </fieldset>
                {error && error !== "phone" && <p className="account-error" role="alert">{c.errors[error]}</p>}
                <div className="account-actions">
                  <button className="button" type="submit" disabled={busy}>{busy ? c.creating : c.create}</button>
                </div>
              </form>
            ) : (
              <>
                <p className="account-error" role="alert">{c.errors.unavailable}</p>
                <button className="button" type="button" onClick={retrySetup}>{c.retry}</button>
              </>
            )
          ) : (
            <form onSubmit={redeem} aria-busy={busy}>
              {status === "welcome" && <p>{c.hint}</p>}
              {status === "sign_in_required" && <p>{c.signInHint}</p>}
              {needsPassword && (
                <>
                  <label>
                    {c.email}
                    <input type="email" autoComplete="username" value={session.email ?? ""} readOnly />
                  </label>
                  <label>
                    {c.password}
                    <input
                      ref={passwordInput}
                      type="password"
                      autoComplete="current-password"
                      placeholder={c.passwordPlaceholder}
                      maxLength={128}
                      value={password}
                      onChange={(event) => setPassword(event.target.value)}
                      disabled={busy}
                      required
                    />
                  </label>
                </>
              )}
              {error && <p className="account-error" role="alert">{c.errors[error]}</p>}
              <div className="account-actions">
                <button className="button" type="submit" disabled={busy}>
                  {status === "linked" ? c.signInLinked : needsPassword ? c.signIn : c.continue}
                </button>
              </div>
            </form>
          )}
        </section>
      </main>
    </div>
  );
}
