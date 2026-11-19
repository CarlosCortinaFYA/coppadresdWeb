import { contact, whatsappUrl } from "../config/contact";
import { useEffect, useRef, useState } from "react";
import type { CSSProperties, ReactNode } from "react";
import { usePreferences } from "../i18n/usePreferences";
import { areas } from "../i18n/areas";
import { ROUTES, navigate } from "../router";
import { Icon } from "./Icon";
import { BrandMark } from "./BrandMark";

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
        <BrandMark />
      </span>
      <span>
        COPP-ADRESD<span className="brand-tm">®</span>
        <small>COMPREHENSIVE OBESITY PREVENTION PROGRAM</small>
      </span>
    </a>
  );
}
type NavLink = { id: string; label: string };
export function Header({
  onContact,
  links,
}: {
  onContact: () => void;
  links: NavLink[];
}) {
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
          {links.map(({ label, id }) => (
            <a href={`#${id}`} key={label} onClick={() => setOpen(false)}>
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
          <button
            className="mobile-membership"
            onClick={() => {
              setOpen(false);
              navigate(ROUTES.membership);
            }}
          >
            {t.membership}
            <Icon name="sparkles" size={17} />
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
            className="button button-small membership-button"
            onClick={() => {
              setOpen(false);
              navigate(ROUTES.membership);
            }}
          >
            <Icon name="sparkles" size={16} />
            {t.membership}
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
  programName,
  institutional,
}: {
  open: boolean;
  onClose: () => void;
  initialArea: number | null;
  initialAudience: number;
  programName: string;
  institutional: boolean;
}) {
  const { t, language } = usePreferences();
  function handleSubmit(event: React.FormEvent<HTMLFormElement>) {
    event.preventDefault();
    const data = new FormData(event.currentTarget);
    const message = `${t.inquiry.documentTitle}\n${programName}\n\n${t.inquiry.organization}: ${data.get("organization") || "—"}\n${t.inquiry.audience}: ${data.get("audience")}\n${t.inquiry.interest}: ${data.get("interest")}\n\n${data.get("message") || ""}\n`;
    window.open(whatsappUrl(message), "_blank", "noopener,noreferrer");
  }

  return (
    <Modal open={open} onClose={onClose} titleId="inquiry-title">
      <p className="eyebrow">COPP–ADRESD</p>
      <h2 id="inquiry-title">{t.inquiry.title}</h2>
      <p>
        {institutional
          ? t.inquiry.intro
          : language === "es"
            ? `Prepara tu consulta sobre ${programName}. Podrás revisar el mensaje en WhatsApp antes de enviarlo.`
            : `Prepare your inquiry about ${programName}. You can review the message in WhatsApp before sending it.`}
      </p>
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
                  !institutional
                    ? programName
                    : initialArea === null
                      ? t.inquiry.all
                      : areas[initialArea][language].name
                }
              >
                <option>{institutional ? t.inquiry.all : programName}</option>
                {institutional &&
                  areas.map((a) => (
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
export function Footer({ links }: { links: NavLink[] }) {
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
            <a className="footer-patient-channel" href={ROUTES.patientChannel}>
              {t.footer.patientChannel}
            </a>
          </div>
          <div>
            <p className="footer-label">{t.footer.explore}</p>
            {links.map(({ label, id }) => (
              <a key={label} href={`#${id}`}>
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
