import { useState } from "react";
import { areas, localizedArea } from "../i18n/areas";
import { usePreferences } from "../i18n/usePreferences";
import { Icon } from "../components/Icon";
import { accentStyle, Modal, SectionHeading } from "../components/Layout";
import { BrandMark } from "../components/BrandMark";
import ecosystemMap from "../assets/ecosystem.webp";

export function Hero({
  active,
  onSelect,
}: {
  active: number;
  onSelect: (index: number) => void;
}) {
  const { t, language } = usePreferences();
  const area = localizedArea(active, language);
  return (
    <>
      <section className="hero container" aria-labelledby="hero-title">
        <div className="hero-copy">
          <p className="eyebrow">
            <span className="status-dot" />
            {t.hero.eyebrow}
          </p>
          <h1 id="hero-title">
            {t.hero.title[0]}
            <br />
            <em>{t.hero.title[1]}</em>
          </h1>
          <p className="hero-description">{t.hero.description}</p>
          <div className="hero-actions">
            <a className="button" href="#ecosystem">
              {t.hero.primary}
              <Icon name="arrow" size={19} />
            </a>
            <a className="text-link" href="#model">
              {t.hero.secondary}
              <Icon name="diagonal" size={17} />
            </a>
          </div>
          <p className="hero-footnote">
            <Icon name="link" size={17} />
            {t.hero.footnote}
          </p>
        </div>
        <div className="hero-visual">
          <div className="orbit-top">
            <span>
              <span className="status-dot" />
              {t.hero.orbitLabel}
            </span>
            <small>01 — 12</small>
          </div>
          <div className="orbit" aria-label={t.hero.orbitLabel}>
            <svg
              className="orbit-lines"
              viewBox="0 0 500 500"
              aria-hidden="true"
            >
              <circle cx="250" cy="250" r="197" className="outer-orbit" />
              <circle cx="250" cy="250" r="157" />
              <circle cx="250" cy="250" r="112" />
              {areas.map((a, i) => {
                const angle = ((i * 30 - 90) * Math.PI) / 180;
                return (
                  <line
                    key={a.brand}
                    x1={250 + Math.cos(angle) * 100}
                    y1={250 + Math.sin(angle) * 100}
                    x2={250 + Math.cos(angle) * 197}
                    y2={250 + Math.sin(angle) * 197}
                    style={{
                      stroke: a.color,
                      opacity: i === active ? 0.7 : 0.15,
                    }}
                  />
                );
              })}
            </svg>
            <div className="orbit-core">
              <BrandMark />
              <span>{t.hero.orbitCenter}</span>
              <small>{t.hero.orbitSub}</small>
              <div className="core-dots">● ● ●</div>
            </div>
            {areas.map((a, i) => {
              const angle = ((i * 30 - 90) * Math.PI) / 180;
              return (
                <button
                  key={a.brand}
                  aria-label={`${a[language].name} · ${a.brand}`}
                  aria-pressed={i === active}
                  className={`orbit-node ${i === active ? "active" : ""}`}
                  onClick={() => onSelect(i)}
                  style={{
                    ...accentStyle(a.color),
                    left: `${50 + Math.cos(angle) * 39.4}%`,
                    top: `${50 + Math.sin(angle) * 39.4}%`,
                  }}
                >
                  <Icon name={a.icon} size={25} />
                  <span className="orbit-number">
                    {String(i + 1).padStart(2, "0")}
                  </span>
                </button>
              );
            })}
            <span className="orbit-speck speck-one" />
            <span className="orbit-speck speck-two" />
          </div>
          <div
            className="orbit-selection"
            style={accentStyle(area.color)}
            aria-live="polite"
          >
            <span className="selection-icon">
              <Icon name={area.icon} size={20} />
            </span>
            <div>
              <strong>{area.name}</strong>
              <small>{area.brand}</small>
            </div>
            <a href="#ecosystem" aria-label={`${t.hero.primary}: ${area.name}`}>
              <Icon name="arrow" size={20} />
            </a>
          </div>
          <p className="orbit-caption">{t.hero.orbitCaption}</p>
        </div>
        <div className="hero-facts">
          {["12", "03", "01"].map((number, i) => (
            <div key={number}>
              <strong>
                {number}
                <span>{"·"}</span>
              </strong>
              <p>{t.hero.facts[i]}</p>
            </div>
          ))}
        </div>
      </section>
      <div className="audience-band">
        <div className="container">
          <span className="audience-label">{t.audience.label}</span>
          {t.audience.items.map((item, i) => (
            <span className="audience-item" key={item}>
              <Icon
                name={["shield", "building", "academy", "users"][i]}
                size={22}
              />
              {item}
            </span>
          ))}
        </div>
      </div>
    </>
  );
}

export function Purpose() {
  const { t } = usePreferences();
  return (
    <section className="section container" id="purpose">
      <SectionHeading
        eyebrow={t.purpose.eyebrow}
        title={t.purpose.title}
        description={t.purpose.description}
        centered
      />
      <div className="pillar-grid">
        {t.purpose.pillars.map((p, i) => (
          <article key={p.tag} className={`pillar-card pillar-${i}`}>
            <div className="pillar-illustration">
              <Icon name={["heart", "brain", "users"][i]} size={48} />
              <span className="illustration-circle" />
              <span className="illustration-dot" />
            </div>
            <p className="eyebrow">{p.tag}</p>
            <h3>{p.title}</h3>
            <p>{p.text}</p>
            <ul>
              {p.items.map((item) => (
                <li key={item}>
                  <Icon name="check" size={15} />
                  {item}
                </li>
              ))}
            </ul>
          </article>
        ))}
      </div>
    </section>
  );
}

export function Ecosystem({
  active,
  onSelect,
  onContact,
}: {
  active: number;
  onSelect: (index: number) => void;
  onContact: (index: number, audience: number) => void;
}) {
  const { t, language } = usePreferences();
  const [audience, setAudience] = useState(0);
  const [reference, setReference] = useState(false);
  const area = localizedArea(active, language);
  return (
    <section className="ecosystem-section section" id="ecosystem">
      <div className="container">
        <div className="ecosystem-intro">
          <SectionHeading
            eyebrow={t.ecosystem.eyebrow}
            title={t.ecosystem.title}
            description={t.ecosystem.description}
          />
          <div className="audience-picker">
            <div
              className="segmented-control"
              role="group"
              aria-label={t.ecosystem.audienceLabel}
            >
              {t.ecosystem.audiences.map((a, i) => (
                <button
                  key={a}
                  aria-pressed={audience === i}
                  onClick={() => setAudience(i)}
                >
                  <Icon name={i === 0 ? "building" : "users"} size={17} />
                  {a}
                </button>
              ))}
            </div>
            <p aria-live="polite">
              {t.ecosystem.audienceDescriptions[audience]}
            </p>
          </div>
        </div>
        <p className="area-hint">
          {t.ecosystem.explore}
          <Icon name="arrow" size={16} />
        </p>
        <div className="ecosystem-layout">
          <div className="area-grid">
            {areas.map((a, i) => (
              <button
                className={`area-card ${i === active ? "selected" : ""}`}
                style={accentStyle(a.color)}
                key={a.brand}
                aria-pressed={i === active}
                aria-controls="area-detail"
                onClick={() => onSelect(i)}
              >
                <span className="area-top">
                  <span className="area-icon">
                    <Icon name={a.icon} size={24} />
                  </span>
                  <small>{String(i + 1).padStart(2, "0")}</small>
                </span>
                <strong>{a[language].name}</strong>
                <span className="area-brand">{a.brand}</span>
                <Icon className="area-arrow" name="diagonal" size={15} />
              </button>
            ))}
          </div>
          <article
            className="area-detail"
            id="area-detail"
            style={accentStyle(area.color)}
            aria-live="polite"
          >
            <div className="detail-art" aria-hidden="true">
              <div />
              <div />
              <span>
                <Icon name={area.icon} size={64} />
              </span>
            </div>
            <p className="eyebrow">
              {t.ecosystem.area} {String(active + 1).padStart(2, "0")}
            </p>
            <h3>{area.brand}</h3>
            <p>{area.text}</p>
            <div className="detail-scope">
              <small>{t.ecosystem.scope}</small>
              <span>
                <Icon name={audience === 0 ? "building" : "person"} size={18} />
                {t.ecosystem.audiences[audience]}
              </span>
            </div>
            <button
              className="text-link"
              onClick={() => onContact(active, audience)}
            >
              {t.ecosystem.action}
              <Icon name="arrow" size={18} />
            </button>
          </article>
        </div>
        <div className="ecosystem-source">
          <span>{t.ecosystem.referenceNote}</span>
          {language === "es" && (
            <button className="text-link" onClick={() => setReference(true)}>
              {t.ecosystem.reference}
              <Icon name="diagonal" size={16} />
            </button>
          )}
        </div>
      </div>
      <Modal
        open={reference && language === "es"}
        onClose={() => setReference(false)}
        titleId="reference-title"
        wide
      >
        <h2 id="reference-title">{t.ecosystem.original}</h2>
        <img
          className="reference-image"
          src={ecosystemMap}
          width="1525"
          height="1004"
          alt="Mapa institucional COPP–ADRESD: propósito, enfoque bio-psico-social y 12 áreas del ecosistema, de salud a academia."
          loading="lazy"
        />
      </Modal>
    </section>
  );
}
