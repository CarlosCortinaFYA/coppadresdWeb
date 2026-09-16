import { useId, useRef, useState } from "react";
import type { KeyboardEvent, ReactNode } from "react";
import { usePreferences } from "../i18n/usePreferences";
import { BrandMark } from "../components/BrandMark";
import { Icon } from "../components/Icon";
import { Modal, SectionHeading } from "../components/Layout";
import { programList, programUI as ui } from "./data";
import type { ProgramDefinition, ProgramId, ProgramSection } from "./data";

export function ProgramNavigation({
  active,
  onChange,
}: {
  active: ProgramId;
  onChange: (id: ProgramId) => void;
}) {
  const { language } = usePreferences();
  const refs = useRef<(HTMLButtonElement | null)[]>([]);
  function navigate(e: KeyboardEvent, index: number) {
    const next =
      e.key === "ArrowRight"
        ? (index + 1) % programList.length
        : e.key === "ArrowLeft"
          ? (index + programList.length - 1) % programList.length
          : e.key === "Home"
            ? 0
            : e.key === "End"
              ? programList.length - 1
              : null;
    if (next === null) return;
    e.preventDefault();
    onChange(programList[next].id);
    refs.current[next]?.focus();
    refs.current[next]?.scrollIntoView({
      block: "nearest",
      inline: "nearest",
      behavior: "smooth",
    });
  }
  return (
    <div className="program-bar">
      <div className="container">
        <span className="program-label">{ui.programs[language]}</span>
        <div
          className="program-tabs"
          role="tablist"
          aria-label={ui.programs[language]}
        >
          {programList.map((p, i) => (
            <button
              key={p.id}
              ref={(el) => {
                refs.current[i] = el;
              }}
              id={`tab-${p.id}`}
              role="tab"
              aria-selected={active === p.id}
              aria-controls={`panel-${p.id}`}
              tabIndex={active === p.id ? 0 : -1}
              onClick={() => onChange(p.id)}
              onKeyDown={(e) => navigate(e, i)}
            >
              <span className="tab-index" aria-hidden="true">
                0{i + 1}
              </span>
              {p.name}
              <span className="tab-dot" />
            </button>
          ))}
        </div>
      </div>
    </div>
  );
}
export function ProgramMedia({
  media,
}: {
  media: NonNullable<NonNullable<ProgramDefinition["hero"]>["image"]>;
}) {
  const { language } = usePreferences();
  const [open, setOpen] = useState(false);
  const id = useId();
  return (
    <figure className="program-media">
      <img
        className="program-hero-image"
        src={media.src}
        alt={media.alt[language]}
        width={media.width}
        height={media.height}
      />
      {media.caption && <figcaption>{media.caption[language]}</figcaption>}
      {media.expandable && (
        <>
          <button className="program-media-open" onClick={() => setOpen(true)}>
            <Icon name="diagonal" size={17} />
            {language === "es" ? "Ampliar infografía" : "Enlarge infographic"}
          </button>
          <Modal open={open} onClose={() => setOpen(false)} titleId={id} wide>
            <h2 id={id}>
              {language === "es"
                ? "Infografía LONGEVITY BIO"
                : "LONGEVITY BIO infographic"}
            </h2>
            <p>{media.caption?.[language]}</p>
            <img
              className="program-media-original"
              src={media.src}
              alt={media.alt[language]}
              width={media.width}
              height={media.height}
            />
          </Modal>
        </>
      )}
    </figure>
  );
}
export function ProgramHero({
  program,
  onContact,
}: {
  program: ProgramDefinition;
  onContact: () => void;
}) {
  const { language } = usePreferences();
  const h = program.hero;
  if (!h) return null;
  return (
    <section
      className={`program-hero container ${!h.artwork && !h.image ? "program-hero-text" : ""}`}
    >
      <div className="program-hero-copy">
        <p className="eyebrow">
          <span />
          {h.eyebrow[language]}
        </p>
        <h1>{h.title[language]}</h1>
        <p className="program-lead">{h.description[language]}</p>
        <div className="hero-actions">
          <button className="button" onClick={onContact}>
            {ui.contact[language]}
            <Icon name="diagonal" size={19} />
          </button>
          {program.sections.length > 0 && (
            <a
              className="program-text-link"
              href={`#${program.sections[0].id}`}
            >
              {ui.explore[language]}
              <Icon name="arrow" size={18} />
            </a>
          )}
        </div>
        <p className="program-hero-note">
          <Icon name="leaf" size={18} />
          {h.note[language]}
        </p>
      </div>
      {h.image && <ProgramMedia media={h.image} />}
      {h.artwork && (
        <div className="formula-art">
          <div className="art-topline">
            <span>COPP–ADRESD</span>
            <span>{h.artwork.code}</span>
          </div>
          <div className="art-orbit orbit-one" />
          <div className="art-orbit orbit-two" />
          <div
            className={`art-symbol ${h.artwork.center ? "art-symbol-network" : ""}`}
          >
            {h.artwork.center ? (
              <>
                <span>{h.artwork.center}</span>
                <small>{h.artwork.centerCaption}</small>
              </>
            ) : (
              <BrandMark />
            )}
          </div>
          {h.artwork.tags.map((tag, i) => (
            <span
              key={tag.label}
              className={`art-tag ${i === 0 ? "tag-berberine" : "tag-resveratrol"}`}
            >
              {tag.title[language]}
              <span>{tag.label}</span>
            </span>
          ))}
          <div className="art-caption">
            <span className="art-kicker">{h.artwork.eyebrow[language]}</span>
            <p>{h.artwork.title[language]}</p>
            <span className="art-research">
              {h.artwork.caption[language]}
              <Icon name="link" size={15} />
            </span>
          </div>
        </div>
      )}
      {h.facts && (
        <div className="program-facts">
          {h.facts.map((fact, i) => (
            <div key={i}>
              {fact.value ? (
                <strong>{fact.value}</strong>
              ) : (
                <Icon name={fact.icon ?? "leaf"} size={28} />
              )}
              <span>{fact.label[language]}</span>
            </div>
          ))}
        </div>
      )}
    </section>
  );
}
function Ingredients({ section }: { section: ProgramSection }) {
  const { language } = usePreferences();
  const [selected, setSelected] = useState(section.initialSelected ?? 0);
  const item = section.items[selected];
  if (!item) return null;
  return (
    <>
      <div className="ingredient-explorer">
        <div className="ingredient-list">
          {section.items.map((entry, i) => (
            <button
              key={i}
              aria-pressed={i === selected}
              onClick={() => setSelected(i)}
            >
              <span>{String(i + 1).padStart(2, "0")}</span>
              {entry.title[language]}
              <Icon name="diagonal" size={16} />
            </button>
          ))}
        </div>
        <div className="ingredient-detail" aria-live="polite">
          <Icon name="leaf" size={38} />
          <span className="ingredient-count">
            {String(selected + 1).padStart(2, "0")} /{" "}
            {String(section.items.length).padStart(2, "0")}
          </span>
          {item.image && (
            <img
              className="program-content-image"
              src={item.image.src}
              alt={item.image.alt[language]}
              loading="lazy"
            />
          )}
          <h3>{item.title[language]}</h3>
          <p>{item.text[language]}</p>
          <div className="ingredient-amount">
            <strong>{item.label}</strong>
            <span>{ui.proposed[language]}</span>
          </div>
        </div>
      </div>
      <details className="formula-table">
        <summary>
          {ui.formula[language]}
          <Icon name="chevron" size={18} />
        </summary>
        <table>
          <thead>
            <tr>
              <th>{ui.ingredient[language]}</th>
              <th>{ui.proposed[language]}</th>
            </tr>
          </thead>
          <tbody>
            {section.items.map((entry, i) => (
              <tr key={i}>
                <td>{entry.title[language]}</td>
                <td>{entry.label}</td>
              </tr>
            ))}
          </tbody>
        </table>
      </details>
      {section.note && <p className="source-note">{section.note[language]}</p>}
    </>
  );
}
export function ProgramContent({ section }: { section: ProgramSection }) {
  const { language } = usePreferences();
  return (
    <section
      id={section.id}
      className={`program-section program-section-${section.kind}`}
    >
      <div className="container">
        <SectionHeading
          eyebrow={section.eyebrow[language]}
          title={section.title[language]}
          description={section.description?.[language]}
        />
        {section.kind === "ingredients" ? (
          <Ingredients section={section} />
        ) : section.kind === "steps" ? (
          <ol className="program-steps">
            {section.items.map((item, i) => (
              <li key={i}>
                <span className="step-marker">
                  {item.label ?? String(i + 1).padStart(2, "0")}
                </span>
                <div>
                  <h3>{item.title[language]}</h3>
                  <p>{item.text[language]}</p>
                </div>
              </li>
            ))}
          </ol>
        ) : section.kind === "metrics" ? (
          <dl className="program-metrics">
            {section.items.map((item, i) => (
              <div key={i}>
                <dt>{item.title[language]}</dt>
                <dd>{item.text[language]}</dd>
              </div>
            ))}
          </dl>
        ) : section.kind === "faq" ? (
          <div className="program-faq">
            {section.items.map((item, i) => (
              <details key={i}>
                <summary>
                  {item.title[language]}
                  <Icon name="chevron" size={18} />
                </summary>
                <p>{item.text[language]}</p>
              </details>
            ))}
          </div>
        ) : (
          <div className={`program-cards cards-${section.kind}`}>
            {section.items.map((item, i) => (
              <article key={i} className="program-card">
                {item.icon ? (
                  <span className="program-card-icon">
                    <Icon name={item.icon} size={26} />
                  </span>
                ) : (
                  <span className="card-label">{item.label}</span>
                )}
                {section.kind === "features" && (
                  <div
                    className={`component-art component-art-${i}`}
                    aria-hidden="true"
                  >
                    <div />
                    <div />
                    <div />
                    <span>{item.title[language].charAt(0)}</span>
                  </div>
                )}
                {item.image && (
                  <img
                    className="program-content-image"
                    src={item.image.src}
                    alt={item.image.alt[language]}
                    loading="lazy"
                  />
                )}
                <h3>{item.title[language]}</h3>
                <p>{item.text[language]}</p>
              </article>
            ))}
          </div>
        )}
      </div>
    </section>
  );
}
export function ProgramCTA({
  program,
  onContact,
}: {
  program: ProgramDefinition;
  onContact: () => void;
}) {
  const { language } = usePreferences();
  if (!program.cta) return null;
  return (
    <section className="container program-cta">
      <div>
        <p className="eyebrow">{program.name}</p>
        <h2>{program.cta.title[language]}</h2>
        <p>{program.cta.text[language]}</p>
        <button className="button" onClick={onContact}>
          {ui.contact[language]}
          <Icon name="diagonal" size={18} />
        </button>
      </div>
      <BrandMark />
    </section>
  );
}
export function ProgramPage({
  program,
  onContact,
  children,
}: {
  program: ProgramDefinition;
  onContact: () => void;
  children?: ReactNode;
}) {
  const { language } = usePreferences();
  return (
    <div
      className={`program-panel program-${program.id}`}
      role="tabpanel"
      id={`panel-${program.id}`}
      aria-labelledby={`tab-${program.id}`}
      tabIndex={0}
    >
      {program.status === "pending" ? (
        <section className="pending-program container">
          <BrandMark />
          <p className="eyebrow">{ui.pending[language]}</p>
          <h1>{program.name}</h1>
          <p>{ui.pendingText[language]}</p>
          <button className="button" onClick={onContact}>
            {ui.contact[language]}
            <Icon name="diagonal" size={18} />
          </button>
        </section>
      ) : (
        <>
          <ProgramHero program={program} onContact={onContact} />
          {children}
          {program.sections.map((section) => (
            <ProgramContent key={section.id} section={section} />
          ))}
          <ProgramCTA program={program} onContact={onContact} />
        </>
      )}
    </div>
  );
}
