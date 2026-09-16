import { contact, whatsappUrl } from "../config/contact";
import { useEffect, useRef, useState } from "react";
import type { CSSProperties, ReactNode } from "react";
import { usePreferences } from "../i18n/usePreferences";
import { areas } from "../i18n/areas";
import { DnaMark, Icon } from "./Icon";

export const sectionIds = ["ecosystem", "model", "technology", "community"];
export const accentStyle = (color: string): CSSProperties =>
  ({ "--accent": color }) as CSSProperties;
export function Brand({ footer = false }: { footer?: boolean }) {
  const { t } = usePreferences();
  return (
    <a
      className={`brand ${footer ? "brand-footer" : ""}`}
      href="#top"
      aria-label={`COPP–ADRESD · ${t.home}`}
    >
      <span className="brand-symbol">
        <DnaMark />
      </span>
      <span>
        COPP–ADRESD<span className="brand-tm">™</span>
        <small>{t.hero.orbitLabel}</small>
      </span>
    </a>
  );
}
export function Header({ onContact }: { onContact: () => void }) {
  const { t, language, theme, toggleLanguage, toggleTheme } = usePreferences();
  const [open, setOpen] = useState(false);
  const menuButton = useRef<HTMLButtonElement>(null);
  useEffect(() => {
    const close = (e: KeyboardEvent) => {
      if (e.key === "Escape" && open) {
        setOpen(false);
        menuButton.current?.focus();
      }
    };
    window.addEventListener("keydown", close);
    const media = window.matchMedia("(min-width: 1051px)");
    const reset = () => {
      if (media.matches) setOpen(false);
    };
    media.addEventListener("change", reset);
    return () => {
      window.removeEventListener("keydown", close);
      media.removeEventListener("change", reset);
    };
  }, [open]);
  return (
    <header className="header">
      <div className="container header-inner">
        <Brand />
        <nav
          id="main-nav"
          aria-label={t.footer.explore}
          className={open ? "navigation is-open" : "navigation"}
        >
          {t.nav.map((label, i) => (
            <a
              href={`#${sectionIds[i]}`}
              key={label}
              onClick={() => setOpen(false)}
            >
              {label}
            </a>
          ))}
          <button
            className="mobile-contact"
            onClick={() => {
              setOpen(false);
              onContact();
            }}
          >
            {t.contact}
            <Icon name="diagonal" size={17} />
          </button>
        </nav>
        <div className="header-controls">
          <button
            className="language-control"
            onClick={toggleLanguage}
            aria-label={t.language}
          >
            <Icon name="globe" size={17} />
            <span>{language.toUpperCase()}</span>
          </button>
          <span className="control-divider" />
          <button
            className="icon-button theme-control"
            onClick={toggleTheme}
            aria-label={theme === "light" ? t.dark : t.light}
          >
            <Icon name={theme === "light" ? "moon" : "sun"} size={19} />
          </button>
          <button
            className="button button-small header-contact"
            onClick={onContact}
          >
            {t.contact}
            <Icon name="diagonal" size={16} />
          </button>
          <button
            className="icon-button menu-button"
            ref={menuButton}
            aria-label={open ? t.close : t.menu}
            aria-expanded={open}
            aria-controls="main-nav"
            onClick={() => setOpen(!open)}
          >
            <Icon name={open ? "close" : "menu"} />
          </button>
        </div>
      </div>
    </header>
  );
}
export function SectionHeading({
  eyebrow,
  title,
  description,
  centered = false,
}: {
  eyebrow: string;
  title: string;
  description?: string;
  centered?: boolean;
}) {
  return (
    <div className={`section-heading ${centered ? "centered" : ""}`}>
      <p className="eyebrow">
        <span />
        {eyebrow}
      </p>
      <h2>{title}</h2>
      {description && <p className="section-description">{description}</p>}
    </div>
  );
}
export function Modal({
  children,
  open,
  onClose,
  titleId,
  wide = false,
}: {
  children: ReactNode;
  open: boolean;
  onClose: () => void;
  titleId: string;
  wide?: boolean;
}) {
  const ref = useRef<HTMLDialogElement>(null);
  const { t } = usePreferences();
  useEffect(() => {
    const dialog = ref.current;
    if (!dialog || !open) return;
    const previous = document.activeElement as HTMLElement | null;
    dialog.showModal();
    const previousOverflow = document.body.style.overflow;
    document.body.style.overflow = "hidden";
    return () => {
      dialog.close();
      document.body.style.overflow = previousOverflow;
      previous?.focus();
    };
  }, [open]);
  return (
    <dialog
      ref={ref}
      className={`modal ${wide ? "modal-wide" : ""}`}
      aria-labelledby={titleId}
      onCancel={(e) => {
        e.preventDefault();
        onClose();
      }}
      onClick={(e) => {
        if (e.target === e.currentTarget) {
          const r = e.currentTarget.getBoundingClientRect();
          if (
            e.clientX < r.left ||
            e.clientX > r.right ||
            e.clientY < r.top ||
            e.clientY > r.bottom
          )
            onClose();
        }
      }}
    >
      <button
        className="icon-button modal-close"
        onClick={onClose}
        aria-label={t.close}
        autoFocus
      >
        <Icon name="close" />
      </button>
      {children}
    </dialog>
  );
}
export function Inquiry({
  open,
  onClose,
  initialArea,
  initialAudience,
}: {
  open: boolean;
  onClose: () => void;
  initialArea: number | null;
  initialAudience: number;
}) {
  const { t, language } = usePreferences();
  function handleSubmit(event: React.FormEvent<HTMLFormElement>) {
    event.preventDefault();
    const data = new FormData(event.currentTarget);
    const message = `${t.inquiry.documentTitle}\n\n${t.inquiry.organization}: ${data.get("organization") || "—"}\n${t.inquiry.audience}: ${data.get("audience")}\n${t.inquiry.interest}: ${data.get("interest")}\n\n${data.get("message") || ""}\n`;
    window.open(whatsappUrl(message), "_blank", "noopener,noreferrer");
  }

  return (
    <Modal open={open} onClose={onClose} titleId="inquiry-title">
      <p className="eyebrow">COPP–ADRESD</p>
      <h2 id="inquiry-title">{t.inquiry.title}</h2>
      <p>{t.inquiry.intro}</p>
      {open && (
        <form onSubmit={handleSubmit}>
          <label>
            {t.inquiry.organization}
            <input
              name="organization"
              placeholder={t.inquiry.organizationPlaceholder}
              maxLength={160}
              autoComplete="organization"
            />
          </label>
          <div className="form-row">
            <label>
              {t.inquiry.audience}
              <select
                name="audience"
                defaultValue={t.ecosystem.audiences[initialAudience]}
              >
                {t.ecosystem.audiences.map((a) => (
                  <option key={a}>{a}</option>
                ))}
              </select>
            </label>
            <label>
              {t.inquiry.interest}
              <select
                name="interest"
                defaultValue={
                  initialArea === null
                    ? t.inquiry.all
                    : areas[initialArea][language].name
                }
              >
                <option>{t.inquiry.all}</option>
                {areas.map((a) => (
                  <option key={a.brand}>{a[language].name}</option>
                ))}
              </select>
            </label>
          </div>
          <label>
            {t.inquiry.message}
            <textarea
              name="message"
              rows={3}
              placeholder={t.inquiry.messagePlaceholder}
              maxLength={1500}
            />
          </label>
          <p className="form-note">
            {t.inquiry.whatsappNote}
            <br />
            <strong>{contact.displayNumber}</strong>
          </p>
          <button className="button" type="submit">
            {t.inquiry.whatsapp}
            <Icon name="arrow" size={18} />
          </button>
        </form>
      )}
    </Modal>
  );
}
export function Footer() {
  const { t } = usePreferences();
  return (
    <footer className="footer">
      <div className="container">
        <div className="footer-main">
          <div>
            <Brand footer />
            <p className="footer-description">{t.footer.description}</p>
            <a
              href={whatsappUrl()}
              target="_blank"
              rel="noopener noreferrer"
              className="footer-whatsapp"
            >
              WhatsApp · {contact.displayNumber}
            </a>
          </div>
          <div>
            <p className="footer-label">{t.footer.explore}</p>
            {t.nav.map((label, i) => (
              <a key={label} href={`#${sectionIds[i]}`}>
                {label}
              </a>
            ))}
          </div>
          <div>
            <p className="footer-label">{t.footer.approach}</p>
            {t.footer.items.map((item) => (
              <span key={item}>{item}</span>
            ))}
          </div>
          <a className="back-top" href="#top" aria-label={t.footer.top}>
            <Icon name="arrow" />
          </a>
        </div>
        <div className="footer-bottom">
          <span>
            © {new Date().getFullYear()} COPP–ADRESD. {t.footer.rights}
          </span>
          <span>{t.footer.owner}</span>
        </div>
      </div>
    </footer>
  );
}
