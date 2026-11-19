import { useEffect } from "react";
import { BrandMark } from "../components/BrandMark";
import { Icon } from "../components/Icon";
import { usePreferences } from "../i18n/usePreferences";
import { ROUTES } from "../router";
import { patientChannelContent } from "./content";
import "../styles/account.css";
import "../styles/patient-channel.css";

/**
 * Página pública del canal de WhatsApp para pacientes.
 *
 * Es la URL que se declara en el perfil de WhatsApp Business: explica el uso
 * asistencial, el opt-in/opt-out y la privacidad. No vende ni promociona
 * suplementos y deja explícito que no sustituye una urgencia.
 */
export function PatientChannelPage() {
  const { language, theme, toggleLanguage, toggleTheme } = usePreferences();
  const c = patientChannelContent[language];

  useEffect(() => {
    // El proveedor de preferencias reescribe el título global al cambiar de
    // idioma; este efecto lo restaura después para que la pestaña conserve el
    // título de esta página.
    const id = window.setTimeout(() => {
      document.title = c.metaTitle;
      document
        .querySelector('meta[name="description"]')
        ?.setAttribute("content", c.metaDescription);
    }, 0);
    return () => window.clearTimeout(id);
  }, [c.metaTitle, c.metaDescription]);

  return (
    <div className="account-page">
      <header className="account-header">
        <div className="container account-header-inner">
          <a className="account-brand" href={ROUTES.home} aria-label={c.home}>
            <span className="brand-symbol">
              <BrandMark />
            </span>
            <span>
              COPP-ADRESD<span className="brand-tm">®</span>
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

      <main className="container patient-main">
        <p className="eyebrow">
          <span />
          {c.eyebrow}
        </p>
        <h1>{c.title}</h1>
        <p className="patient-intro">{c.intro}</p>

        <div className="patient-grid">
          {c.sections.map((section) => (
            <section className="patient-card" key={section.title}>
              <h2>{section.title}</h2>
              <p>{section.body}</p>
              {section.items && (
                <ul>
                  {section.items.map((item) => (
                    <li key={item}>{item}</li>
                  ))}
                </ul>
              )}
              {section.link && (
                <a className="patient-link" href={section.link.href}>
                  {section.link.label} <Icon name="arrow" size={16} />
                </a>
              )}
            </section>
          ))}
        </div>

        <aside className="patient-note" role="note">
          <Icon name="heart" size={22} />
          <div>
            <strong>{c.noteTitle}</strong>
            <p>{c.note}</p>
          </div>
        </aside>

        <p className="patient-legal">{c.legal}</p>

        <a className="button patient-back" href={ROUTES.home}>
          {c.back}
        </a>
      </main>
    </div>
  );
}
