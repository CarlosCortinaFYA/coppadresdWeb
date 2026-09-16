import { BrandMark } from "../components/BrandMark";
import { usePreferences } from "../i18n/usePreferences";
import { Icon } from "../components/Icon";
import { SectionHeading } from "../components/Layout";

export function Model() {
  const { t } = usePreferences();
  return (
    <section className="section container model-section" id="model">
      <div className="section-title-row">
        <SectionHeading eyebrow={t.model.eyebrow} title={t.model.title} />
        <p className="section-description">{t.model.description}</p>
      </div>
      <div className="steps">
        {t.model.steps.map((step, i) => (
          <article className="step" key={step.title}>
            <div className="step-top">
              <span>0{i + 1}</span>
              <Icon name={["pulse", "users", "chart"][i]} size={28} />
            </div>
            <h3>{step.title}</h3>
            <p>{step.text}</p>
            <div className="step-tags">
              {step.tags.map((tag) => (
                <span key={tag}>{tag}</span>
              ))}
            </div>
          </article>
        ))}
      </div>
      <p className="model-note">
        <Icon name="shield" size={18} />
        {t.model.note}
      </p>
    </section>
  );
}

export function Technology() {
  const { t } = usePreferences();
  return (
    <section id="technology" className="technology-section">
      <div className="container technology-layout">
        <div>
          <SectionHeading
            eyebrow={t.technology.eyebrow}
            title={t.technology.title}
            description={t.technology.description}
          />
          <div className="technology-features">
            {t.technology.items.map((item, i) => (
              <div key={item.title}>
                <span className="tech-icon">
                  <Icon
                    name={["chip", "video", "chart", "shield"][i]}
                    size={21}
                  />
                </span>
                <div>
                  <h3>{item.title}</h3>
                  <p>{item.text}</p>
                </div>
              </div>
            ))}
          </div>
        </div>
        <div className="technology-visual">
          <div className="tech-card-head">
            <span>
              <span className="status-dot" />
              {t.technology.diagram}
            </span>
            <Icon name="link" size={17} />
          </div>
          <div className="connection-map">
            <svg viewBox="0 0 440 380" aria-hidden="true">
              <path d="M220 50V330M50 190H390" />
              <circle cx="220" cy="190" r="126" />
              <circle cx="220" cy="190" r="91" />
            </svg>
            <div className="connection-core">
              <BrandMark />
              <small>{t.technology.platform}</small>
              <strong>{t.technology.center}</strong>
            </div>
            {t.technology.nodes.map((node, i) => (
              <div
                key={node}
                className={`connection-node connection-node-${i}`}
              >
                <Icon
                  name={["person", "heart", "users", "building"][i]}
                  size={22}
                />
                <span>{node}</span>
              </div>
            ))}
          </div>
          <div className="metrics-list">
            {t.technology.metrics.map((metric, i) => (
              <div key={metric}>
                <span className={`metric-dot metric-dot-${i}`} />
                <span>{metric}</span>
                <Icon name="check" size={15} />
              </div>
            ))}
          </div>
          <p className="tech-card-foot">
            <Icon name="shield" size={14} />
            {t.technology.footer}
          </p>
        </div>
      </div>
    </section>
  );
}

export function Community() {
  const { t } = usePreferences();
  return (
    <section className="section container community-section" id="community">
      <div className="community-visual">
        <div className="community-rings" aria-hidden="true">
          <div />
          <div />
          <div />
          <span>
            <Icon name="users" size={46} />
          </span>
          {[0, 1, 2, 3, 4, 5].map((n) => (
            <i key={n} className={`person-dot person-dot-${n}`}>
              <Icon name="person" size={20} />
            </i>
          ))}
        </div>
        <blockquote>{t.community.quote}</blockquote>
        <div className="community-mini">
          <span />
          <span />
          <span />
          <span /> COPP–ADRESD
        </div>
      </div>
      <div className="community-copy">
        <SectionHeading
          eyebrow={t.community.eyebrow}
          title={t.community.title}
          description={t.community.description}
        />
        <p className="team-label">{t.community.team}</p>
        <div className="role-tags">
          {t.community.roles.map((role) => (
            <span key={role}>{role}</span>
          ))}
        </div>
      </div>
      <div className="community-path">
        <p>{t.community.pathLabel}</p>
        <ol>
          {t.community.path.map((item, i) => (
            <li key={item}>
              <span>0{i + 1}</span>
              <strong>{item}</strong>
              {i < 3 && <Icon name="arrow" size={20} />}
            </li>
          ))}
        </ol>
      </div>
    </section>
  );
}

export function Science() {
  const { t } = usePreferences();
  return (
    <section className="science-section section">
      <div className="container">
        <div className="science-intro">
          <SectionHeading eyebrow={t.science.eyebrow} title={t.science.title} />
          <p className="section-description">{t.science.description}</p>
        </div>
        <div className="science-cards">
          {t.science.cards.map((card, i) => (
            <article key={card.title}>
              <span className="science-icon">
                <Icon name={i === 0 ? "leaf" : "chip"} size={30} />
              </span>
              <div>
                <p className="eyebrow">{card.label}</p>
                <h3>{card.title}</h3>
                <p>{card.text}</p>
              </div>
            </article>
          ))}
        </div>
        <p className="science-note">{t.science.note}</p>
      </div>
    </section>
  );
}

export function FAQ() {
  const { t } = usePreferences();
  return (
    <section className="section container faq-section">
      <SectionHeading eyebrow={t.faq.eyebrow} title={t.faq.title} />
      <div className="faq-items">
        {t.faq.items.map((item, i) => (
          <details key={i} name="faq">
            <summary>
              <span>{item.q}</span>
              <Icon name="chevron" size={20} />
            </summary>
            <p>{item.a}</p>
          </details>
        ))}
      </div>
    </section>
  );
}

export function CallToAction({ onContact }: { onContact: () => void }) {
  const { t } = usePreferences();
  return (
    <section className="container cta-container">
      <div className="cta">
        <div className="cta-art" aria-hidden="true">
          <div />
          <div />
          <div />
          <BrandMark />
        </div>
        <div className="cta-copy">
          <p className="eyebrow">
            <span />
            {t.cta.eyebrow}
          </p>
          <h2>{t.cta.title}</h2>
          <p>{t.cta.text}</p>
          <button className="button button-white" onClick={onContact}>
            {t.cta.action}
            <Icon name="diagonal" size={18} />
          </button>
          <small>{t.cta.note}</small>
        </div>
      </div>
    </section>
  );
}
