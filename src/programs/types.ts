import type { Language } from "../i18n/translations";
export type Localized = Record<Language, string>;
export const l = (es: string, en: string): Localized => ({ es, en });
export type ProgramId =
  "coppAdresd" | "weightSupportPlus" | "longevityProgram" | "pepMimetic";
export interface ContentItem {
  title: Localized;
  text: Localized;
  label?: string;
  icon?: string;
  image?: {
    src: string;
    alt: Localized;
    caption?: Localized;
    expandable?: boolean;
    width?: number;
    height?: number;
  };
}
export interface ProgramSection {
  id: string;
  kind:
    | "overview"
    | "features"
    | "benefits"
    | "content"
    | "ingredients"
    | "faq"
    | "steps"
    | "metrics";
  eyebrow: Localized;
  title: Localized;
  description?: Localized;
  items: ContentItem[];
  navLabel?: Localized;
  initialSelected?: number;
  note?: Localized;
}
export interface ProgramDefinition {
  id: ProgramId;
  name: string;
  status: "available" | "pending";
  hero?: {
    eyebrow: Localized;
    title: Localized;
    description: Localized;
    note: Localized;
    artwork?: {
      code: string;
      center?: string;
      centerCaption?: string;
      eyebrow: Localized;
      title: Localized;
      caption: Localized;
      tags: { title: Localized; label: string }[];
    };
    image?: {
      src: string;
      alt: Localized;
      caption?: Localized;
      expandable?: boolean;
      width?: number;
      height?: number;
    };
    facts?: { value?: string; icon?: string; label: Localized }[];
  };
  sections: ProgramSection[];
  institutional?: boolean;
  cta?: { title: Localized; text: Localized };
}
