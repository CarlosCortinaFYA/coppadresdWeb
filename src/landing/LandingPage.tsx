import { useEffect, useRef, useState } from "react";
import type { CSSProperties, MouseEvent, ReactNode } from "react";
import {
  ArrowRight,
  ArrowUpRight,
  Barbell,
  BowlFood,
  ChatCircleDots,
  Heartbeat,
  List,
  MoonStars,
  Moon,
  PaperPlaneRight,
  Pill,
  Plus,
  Microphone,
  Sneaker,
  Sun,
  Target,
  Translate,
  UsersThree,
  WhatsappLogo,
  X,
  ArrowCounterClockwise,
  Check,
  Lightning,
} from "@phosphor-icons/react";
import { usePreferences } from "../i18n/usePreferences";
import { ROUTES, navigate } from "../router";
import { whatsappUrl } from "../config/contact";
import { BrandMark } from "../components/BrandMark";
import { BRAND, landingContent } from "./content";
import heroRunner from "../assets/aw/hero-runner.webp";
import appHome from "../assets/aw/app-home.webp";
import appPlan from "../assets/aw/app-plan.webp";
import appProtocol from "../assets/aw/app-protocol.webp";
import nutritionImg from "../assets/aw/nutrition-bowl.webp";
import workoutImg from "../assets/aw/workout-home.webp";
import sleepImg from "../assets/aw/sleep.webp";
import communityImg from "../assets/aw/community.webp";
import watchImg from "../assets/aw/watch-rings.webp";
import hydrationImg from "../assets/aw/hydration.webp";
import "../styles/landing.css";

type Content = (typeof landingContent)["es"];

/** Detecta la preferencia de movimiento reducido y reacciona a sus cambios. */
function useReducedMotion() {
  const [reduced, setReduced] = useState(
    () => window.matchMedia("(prefers-reduced-motion: reduce)").matches,
  );
  useEffect(() => {
    const query = window.matchMedia("(prefers-reduced-motion: reduce)");
    const sync = () => setReduced(query.matches);
    query.addEventListener("change", sync);
    return () => query.removeEventListener("change", sync);
  }, []);
  return reduced;
}

/** Navegación interna sin recarga para rutas de la SPA. */
function spaLink(path: string) {
  return (event: MouseEvent<HTMLAnchorElement>) => {
    if (event.metaKey || event.ctrlKey || event.shiftKey || event.button !== 0) return;
    event.preventDefault();
    navigate(path);
  };
}

export function LandingPage() {
  const { language, theme, toggleLanguage, toggleTheme } = usePreferences();
  const c = landingContent[language];

  // La landing gestiona sus propios metadatos (el proveedor global usa los institucionales).
  useEffect(() => {
    document.title = c.metaTitle;
    document.querySelector('meta[name="description"]')?.setAttribute("content", c.metaDescription);
    document.querySelector('meta[property="og:title"]')?.setAttribute("content", c.metaTitle);
    document
      .querySelector('meta[property="og:description"]')
      ?.setAttribute("content", c.metaDescription);
  }, [c]);

  return (
    <div className="aw">
      <a className="aw-skip" href="#contenido">
        {c.skip}
      </a>
      <Header
        c={c}
        theme={theme}
        onToggleTheme={toggleTheme}
        onToggleLanguage={toggleLanguage}
      />
      <main id="contenido">
        <Hero c={c} />
        <AgentSection c={c} />
        <Platform c={c} />
        <AppShowcase c={c} />
        <Wearables c={c} />
        <HowItWorks c={c} />
        <Faq c={c} />
        <FinalCta c={c} />
      </main>
      <Footer c={c} />
    </div>
  );
}

/* ------------------------------------------------------------------ */
/* Cabecera                                                            */
/* ------------------------------------------------------------------ */

function Header({
  c,
  theme,
  onToggleTheme,
  onToggleLanguage,
}: {
  c: Content;
  theme: "light" | "dark";
  onToggleTheme: () => void;
  onToggleLanguage: () => void;
}) {
  const [open, setOpen] = useState(false);

  useEffect(() => {
    if (!open) return;
    const onKey = (event: KeyboardEvent) => event.key === "Escape" && setOpen(false);
    document.addEventListener("keydown", onKey);
    return () => document.removeEventListener("keydown", onKey);
  }, [open]);

  return (
    <header className="aw-header" data-open={open || undefined}>
      <nav className="aw-nav" aria-label={BRAND}>
        <a className="aw-logo" href="#top" aria-label={`${BRAND}, inicio`}>
          <BrandMark className="aw-logo-mark" />
          <span>
            Agentic Wellness <b>AI</b>
          </span>
        </a>
        <ul className="aw-nav-links" id="aw-menu">
          {c.nav.map((item) => (
            <li key={item.id}>
              <a href={`#${item.id}`} onClick={() => setOpen(false)}>
                {item.label}
              </a>
            </li>
          ))}
          <li>
            <a href={ROUTES.membership} onClick={spaLink(ROUTES.membership)}>
              {c.membership}
            </a>
          </li>
        </ul>
        <div className="aw-nav-actions">
          <button
            type="button"
            className="aw-icon-btn"
            onClick={onToggleLanguage}
            aria-label={c.toggleLanguage}
            title={c.toggleLanguage}
          >
            <Translate size={18} weight="bold" aria-hidden />
          </button>
          <button
            type="button"
            className="aw-icon-btn"
            onClick={onToggleTheme}
            aria-label={c.toggleTheme[theme]}
            title={c.toggleTheme[theme]}
          >
            {theme === "dark" ? (
              <Sun size={18} weight="bold" aria-hidden />
            ) : (
              <Moon size={18} weight="bold" aria-hidden />
            )}
          </button>
          <a
            className="aw-btn aw-btn-primary aw-btn-sm aw-nav-cta"
            href={ROUTES.membership}
            onClick={spaLink(ROUTES.membership)}
          >
            {c.join}
          </a>
          <button
            type="button"
            className="aw-icon-btn aw-menu-btn"
            aria-expanded={open}
            aria-controls="aw-menu"
            aria-label={open ? c.menu.close : c.menu.open}
            onClick={() => setOpen(!open)}
          >
            {open ? <X size={20} weight="bold" aria-hidden /> : <List size={20} weight="bold" aria-hidden />}
          </button>
        </div>
      </nav>
    </header>
  );
}

/* ------------------------------------------------------------------ */
/* Orbe del agente (avatar animado)                                    */
/* ------------------------------------------------------------------ */

function AgentOrb({ size = "md" }: { size?: "sm" | "md" | "lg" }) {
  return (
    <span className={`aw-orb aw-orb-${size}`} aria-hidden="true">
      <span className="aw-orb-glow" />
      <span className="aw-orb-ring" />
      <span className="aw-orb-core">
        <span className="aw-orb-eye" />
        <span className="aw-orb-eye" />
      </span>
    </span>
  );
}

/* ------------------------------------------------------------------ */
/* Hero                                                                */
/* ------------------------------------------------------------------ */

function Hero({ c }: { c: Content }) {
  return (
    <section className="aw-hero" id="top">
      <div className="aw-hero-copy">
        <p className="aw-eyebrow">
          <Lightning size={14} weight="fill" aria-hidden />
          {c.hero.eyebrow}
        </p>
        <h1 className="aw-hero-title">
          {c.hero.title[0]} <span className="aw-ink">{c.hero.title[1]}</span>
        </h1>
        <p className="aw-hero-lead">{c.hero.lead}</p>
        <div className="aw-hero-ctas">
          <a className="aw-btn aw-btn-primary" href={ROUTES.membership} onClick={spaLink(ROUTES.membership)}>
            {c.join}
            <ArrowRight size={18} weight="bold" aria-hidden />
          </a>
          <a className="aw-btn aw-btn-ghost" href="#app">
            {c.seeApp}
          </a>
        </div>
      </div>

      <div className="aw-hero-visual">
        <figure className="aw-hero-photo">
          <img
            src={heroRunner}
            alt={c.hero.imageAlt}
            width={1500}
            height={895}
            fetchPriority="high"
            decoding="async"
          />
        </figure>

        {/* Datos ilustrativos de una sesión de carrera (no son métricas reales). */}
        <div className="aw-float aw-float-pulse" role="group" aria-label={c.hero.pulse.label}>
          <span className="aw-float-icon">
            <Heartbeat size={20} weight="fill" aria-hidden />
          </span>
          <span className="aw-float-text">
            <small>{c.hero.pulse.label}</small>
            <strong>
              {c.hero.pulse.value} <em>{c.hero.pulse.unit}</em>
            </strong>
          </span>
          <span className="aw-zone">{c.hero.pulse.zone}</span>
          <svg className="aw-ecg" viewBox="0 0 120 32" aria-hidden="true">
            <path d="M0 18h26l6-10 7 20 6-14 5 4h22l5-12 7 22 5-10h31" />
          </svg>
        </div>

        <div className="aw-float aw-float-bubble">
          <AgentOrb size="sm" />
          <p>{c.hero.bubble}</p>
        </div>

        <div className="aw-hero-phone">
          <Phone src={appHome} alt={c.hero.phoneAlt} priority />
        </div>
      </div>
    </section>
  );
}

function Phone({
  src,
  alt,
  priority = false,
  island = true,
}: {
  src: string;
  alt: string;
  priority?: boolean;
  /** Las capturas del diseño ya traen su propia isla: no duplicarla. */
  island?: boolean;
}) {
  return (
    <div className="aw-phone">
      {island && <span className="aw-phone-island" aria-hidden="true" />}
      <img
        src={src}
        alt={alt}
        width={800}
        height={1737}
        loading={priority ? "eager" : "lazy"}
        decoding="async"
      />
    </div>
  );
}

/* ------------------------------------------------------------------ */
/* Agente: conversación de ejemplo                                     */
/* ------------------------------------------------------------------ */

function AgentSection({ c }: { c: Content }) {
  const reduced = useReducedMotion();
  const ref = useRef<HTMLDivElement>(null);
  // 0: vacío, 1: mensaje del usuario, 2: escribiendo, 3: respuesta, 4: sugerencias.
  const [stage, setStage] = useState(0);
  const [run, setRun] = useState(0);

  // Arranca la secuencia la primera vez que la tarjeta entra en pantalla.
  useEffect(() => {
    const el = ref.current;
    if (!el) return;
    const observer = new IntersectionObserver(
      ([entry]) => {
        if (entry.isIntersecting) {
          setRun((r) => (r === 0 ? 1 : r));
          observer.disconnect();
        }
      },
      { threshold: 0.45 },
    );
    observer.observe(el);
    return () => observer.disconnect();
  }, []);

  useEffect(() => {
    if (run === 0) return;
    if (reduced) {
      setStage(4);
      return;
    }
    setStage(0);
    const timers = [
      window.setTimeout(() => setStage(1), 250),
      window.setTimeout(() => setStage(2), 1100),
      window.setTimeout(() => setStage(3), 2600),
      window.setTimeout(() => setStage(4), 3300),
    ];
    return () => timers.forEach(window.clearTimeout);
  }, [run, reduced]);

  return (
    <section className="aw-section aw-agent" id="agente" aria-labelledby="agent-title">
      <div className="aw-agent-head">
        <AgentOrb size="lg" />
        <h2 id="agent-title" className="aw-h2">
          {c.agent.title}
        </h2>
        <p className="aw-lead">{c.agent.lead}</p>
      </div>

      <div className="aw-chat" ref={ref}>
        <div className="aw-chat-log" aria-live="polite">
          {stage >= 1 && <p className="aw-msg aw-msg-user">{c.agent.user}</p>}
          {stage === 2 && (
            <p className="aw-msg aw-msg-agent aw-typing" aria-label={c.agent.typing}>
              <span />
              <span />
              <span />
            </p>
          )}
          {stage >= 3 && (
            <div className="aw-msg-row">
              <AgentOrb size="sm" />
              <p className="aw-msg aw-msg-agent">{c.agent.reply}</p>
            </div>
          )}
          {stage >= 4 && (
            <ul className="aw-chips" aria-label="Sugerencias">
              {c.agent.chips.map((chip, i) => (
                <li key={chip} style={{ "--i": i } as CSSProperties}>
                  {chip}
                </li>
              ))}
            </ul>
          )}
        </div>
        <div className="aw-chat-input" aria-hidden="true">
          <span className="aw-chat-plus">
            <Plus size={18} weight="bold" />
          </span>
          <span className="aw-chat-field">{c.agent.input}</span>
          <Microphone size={20} weight="fill" className="aw-chat-mic" />
          <span className="aw-chat-send">
            <PaperPlaneRight size={16} weight="fill" />
          </span>
        </div>
        <button
          type="button"
          className="aw-replay"
          onClick={() => setRun((r) => r + 1)}
          disabled={stage < 4}
        >
          <ArrowCounterClockwise size={16} weight="bold" aria-hidden />
          {c.agent.replay}
        </button>
      </div>
    </section>
  );
}

/* ------------------------------------------------------------------ */
/* Plataforma: bento de módulos                                        */
/* ------------------------------------------------------------------ */

function Tile({
  area,
  icon,
  title,
  text,
  children,
  tone,
}: {
  area: string;
  icon: ReactNode;
  title: string;
  text: string;
  children?: ReactNode;
  tone?: string;
}) {
  return (
    <article className={`aw-tile aw-tile-${area}`} data-tone={tone}>
      {children}
      <div className="aw-tile-body">
        <span className="aw-tile-icon">{icon}</span>
        <h3>{title}</h3>
        <p>{text}</p>
      </div>
    </article>
  );
}

function Platform({ c }: { c: Content }) {
  const it = c.platform.items;
  // 7 de 12 actividades: coincide con la pantalla de ejemplo de la app.
  const done = 7;
  const total = 12;
  const circumference = 2 * Math.PI * 52;
  return (
    <section className="aw-section aw-platform" id="plataforma" aria-labelledby="platform-title">
      <div className="aw-section-head">
        <h2 id="platform-title" className="aw-h2">
          {c.platform.title}
        </h2>
        <p className="aw-lead">{c.platform.lead}</p>
      </div>

      <div className="aw-bento">
        <Tile area="nutrition" icon={<BowlFood size={20} weight="duotone" />} title={it.nutrition.title} text={it.nutrition.text} tone="photo">
          <img className="aw-tile-img" src={nutritionImg} alt={it.nutrition.alt} width={1000} height={1000} loading="lazy" decoding="async" />
        </Tile>

        <Tile area="adherence" icon={<Target size={20} weight="duotone" />} title={it.adherence.title} text={it.adherence.text} tone="soft">
          <div className="aw-ring" role="img" aria-label={`${done} / ${total} ${it.adherence.ring}`}>
            <svg viewBox="0 0 120 120" aria-hidden="true">
              <circle className="aw-ring-track" cx="60" cy="60" r="52" />
              <circle
                className="aw-ring-value"
                cx="60"
                cy="60"
                r="52"
                style={{
                  strokeDasharray: circumference,
                  "--ring-offset": circumference * (1 - done / total),
                } as CSSProperties}
              />
            </svg>
            <span className="aw-ring-label">
              <strong>
                {done}/{total}
              </strong>
              <small>{it.adherence.ring}</small>
            </span>
          </div>
          <p className="aw-streak">
            <Lightning size={16} weight="fill" aria-hidden /> 12 {it.adherence.streak}
          </p>
        </Tile>

        <Tile area="exercise" icon={<Barbell size={20} weight="duotone" />} title={it.exercise.title} text={it.exercise.text} tone="photo">
          <img className="aw-tile-img" src={workoutImg} alt={it.exercise.alt} width={1200} height={800} loading="lazy" decoding="async" />
        </Tile>

        <Tile area="meds" icon={<Pill size={20} weight="duotone" />} title={it.meds.title} text={it.meds.text} tone="gradient">
          <div className="aw-reminder" aria-hidden="true">
            <span className="aw-reminder-icon">
              <Pill size={18} weight="fill" />
            </span>
            <span>
              <strong>{it.meds.reminder}</strong>
              <small>{it.meds.time}</small>
            </span>
            <span className="aw-reminder-done">
              <Check size={14} weight="bold" /> {it.meds.done}
            </span>
          </div>
        </Tile>

        <Tile area="sleep" icon={<MoonStars size={20} weight="duotone" />} title={it.sleep.title} text={it.sleep.text} tone="photo">
          <img className="aw-tile-img" src={sleepImg} alt={it.sleep.alt} width={1000} height={563} loading="lazy" decoding="async" />
        </Tile>

        <Tile area="community" icon={<UsersThree size={20} weight="duotone" />} title={it.community.title} text={it.community.text} tone="photo">
          <img className="aw-tile-img" src={communityImg} alt={it.community.alt} width={1000} height={563} loading="lazy" decoding="async" />
        </Tile>
      </div>
    </section>
  );
}

/* ------------------------------------------------------------------ */
/* App: recorrido con teléfono fijo                                    */
/* ------------------------------------------------------------------ */

const SCREENS = [appProtocol, appPlan, appHome];
// Solo la pantalla de inicio carece de isla dinámica propia.
const SCREEN_HAS_ISLAND = [true, true, false];

function AppShowcase({ c }: { c: Content }) {
  const [active, setActive] = useState(0);
  const stepRefs = useRef<(HTMLLIElement | null)[]>([]);

  // El paso más centrado en el viewport decide qué pantalla muestra el teléfono.
  useEffect(() => {
    const observer = new IntersectionObserver(
      (entries) => {
        for (const entry of entries) {
          if (entry.isIntersecting) {
            setActive(Number((entry.target as HTMLElement).dataset.index));
          }
        }
      },
      { rootMargin: "-45% 0px -45% 0px" },
    );
    stepRefs.current.forEach((el) => el && observer.observe(el));
    return () => observer.disconnect();
  }, []);

  return (
    <section className="aw-section aw-app" id="app" aria-labelledby="app-title">
      <div className="aw-app-grid">
        <div className="aw-app-copy">
          <p className="aw-eyebrow">{c.app.eyebrow}</p>
          <h2 id="app-title" className="aw-h2">
            {c.app.title}
          </h2>
          <ol className="aw-steps">
            {c.app.steps.map((step, i) => (
              <li
                key={step.title}
                ref={(el) => {
                  stepRefs.current[i] = el;
                }}
                data-index={i}
                data-active={active === i || undefined}
                className="aw-step"
              >
                <span className="aw-step-dot" aria-hidden="true" />
                <h3>{step.title}</h3>
                <p>{step.text}</p>
                {/* En móvil cada paso muestra su pantalla (no hay teléfono fijo). */}
                <div className="aw-step-phone">
                  <Phone src={SCREENS[i]} alt={step.alt} island={!SCREEN_HAS_ISLAND[i]} />
                </div>
              </li>
            ))}
          </ol>
        </div>
        <div className="aw-app-stage" aria-hidden="true">
          <div className="aw-app-sticky">
            <span className="aw-app-halo" />
            <div className="aw-phone aw-phone-stack">
              {!SCREEN_HAS_ISLAND[active] && <span className="aw-phone-island" />}
              {SCREENS.map((src, i) => (
                <img
                  key={src}
                  src={src}
                  alt=""
                  width={800}
                  height={1737}
                  loading="lazy"
                  decoding="async"
                  data-active={active === i || undefined}
                />
              ))}
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}

/* ------------------------------------------------------------------ */
/* Wearables                                                           */
/* ------------------------------------------------------------------ */

function Wearables({ c }: { c: Content }) {
  const icons = [
    <Sneaker key="a" size={22} weight="duotone" aria-hidden />,
    <Heartbeat key="h" size={22} weight="duotone" aria-hidden />,
    <MoonStars key="s" size={22} weight="duotone" aria-hidden />,
  ];
  return (
    <section className="aw-wear" id="wearables" aria-labelledby="wear-title">
      <figure className="aw-wear-photo">
        <img src={watchImg} alt={c.wearables.imageAlt} width={1200} height={800} loading="lazy" decoding="async" />
      </figure>
      <div className="aw-wear-panel">
        <h2 id="wear-title" className="aw-h2">
          {c.wearables.title}
        </h2>
        <p className="aw-lead">{c.wearables.lead}</p>
        <ul className="aw-facts">
          {c.wearables.facts.map((fact, i) => (
            <li key={fact.title}>
              <span className="aw-fact-icon">{icons[i]}</span>
              <span>
                <strong>{fact.title}</strong>
                <small>{fact.text}</small>
              </span>
            </li>
          ))}
        </ul>
        <p className="aw-note">{c.wearables.note}</p>
      </div>
    </section>
  );
}

/* ------------------------------------------------------------------ */
/* Cómo funciona                                                       */
/* ------------------------------------------------------------------ */

function HowItWorks({ c }: { c: Content }) {
  const icons = [
    <ChatCircleDots key="c" size={24} weight="duotone" aria-hidden />,
    <Target key="t" size={24} weight="duotone" aria-hidden />,
    <Lightning key="l" size={24} weight="duotone" aria-hidden />,
  ];
  return (
    <section className="aw-section aw-how" aria-labelledby="how-title">
      <h2 id="how-title" className="aw-h2">
        {c.how.title}
      </h2>
      <ol className="aw-track">
        {c.how.steps.map((step, i) => (
          <li key={step.title} style={{ "--i": i } as CSSProperties}>
            <span className="aw-track-node">{icons[i]}</span>
            <h3>{step.title}</h3>
            <p>{step.text}</p>
          </li>
        ))}
      </ol>
    </section>
  );
}

/* ------------------------------------------------------------------ */
/* Preguntas frecuentes                                                */
/* ------------------------------------------------------------------ */

function Faq({ c }: { c: Content }) {
  return (
    <section className="aw-section aw-faq" aria-labelledby="faq-title">
      <h2 id="faq-title" className="aw-h2">
        {c.faq.title}
      </h2>
      <div className="aw-faq-list">
        {c.faq.items.map((item) => (
          <details key={item.q} name="aw-faq">
            <summary>
              {item.q}
              <Plus size={18} weight="bold" aria-hidden className="aw-faq-icon" />
            </summary>
            <p>{item.a}</p>
          </details>
        ))}
      </div>
    </section>
  );
}

/* ------------------------------------------------------------------ */
/* Llamada final y pie                                                 */
/* ------------------------------------------------------------------ */

function FinalCta({ c }: { c: Content }) {
  return (
    <section className="aw-cta" aria-labelledby="cta-title">
      <img className="aw-cta-img" src={hydrationImg} alt={c.cta.imageAlt} width={1000} height={1500} loading="lazy" decoding="async" />
      <div className="aw-cta-inner">
        <AgentOrb size="md" />
        <h2 id="cta-title" className="aw-cta-title">
          {c.cta.title}
        </h2>
        <p>{c.cta.lead}</p>
        <div className="aw-hero-ctas">
          <a className="aw-btn aw-btn-light" href={ROUTES.membership} onClick={spaLink(ROUTES.membership)}>
            {c.join}
            <ArrowRight size={18} weight="bold" aria-hidden />
          </a>
          <a
            className="aw-btn aw-btn-glass"
            href={whatsappUrl(c.cta.whatsappMessage)}
            target="_blank"
            rel="noopener noreferrer"
          >
            <WhatsappLogo size={18} weight="fill" aria-hidden />
            {c.cta.whatsapp}
          </a>
        </div>
      </div>
    </section>
  );
}

function Footer({ c }: { c: Content }) {
  return (
    <footer className="aw-footer">
      <div className="aw-footer-grid">
        <div>
          <a className="aw-logo" href="#top">
            <BrandMark className="aw-logo-mark" />
            <span>
              Agentic Wellness <b>AI</b>
            </span>
          </a>
          <p className="aw-footer-tag">{c.footer.tagline}</p>
        </div>
        <nav aria-label={c.footer.product}>
          <h3>{c.footer.product}</h3>
          <ul>
            {c.nav.map((item) => (
              <li key={item.id}>
                <a href={`#${item.id}`}>{item.label}</a>
              </li>
            ))}
            <li>
              <a href={ROUTES.membership} onClick={spaLink(ROUTES.membership)}>
                {c.membership}
              </a>
            </li>
          </ul>
        </nav>
        <nav aria-label={c.footer.support}>
          <h3>{c.footer.support}</h3>
          <ul>
            <li>
              <a href={ROUTES.patientChannel} onClick={spaLink(ROUTES.patientChannel)}>
                {c.footer.patient}
              </a>
            </li>
            <li>
              <a href={ROUTES.deleteAccount} onClick={spaLink(ROUTES.deleteAccount)}>
                {c.footer.deleteAccount}
              </a>
            </li>
            <li>
              <a href={whatsappUrl(c.cta.whatsappMessage)} target="_blank" rel="noopener noreferrer">
                WhatsApp <ArrowUpRight size={14} weight="bold" aria-hidden />
              </a>
            </li>
          </ul>
        </nav>
      </div>
      <p className="aw-disclaimer">{c.footer.disclaimer}</p>
      <p className="aw-copy">
        © {new Date().getFullYear()} {BRAND}. {c.footer.rights} {c.footer.photos}
      </p>
    </footer>
  );
}
