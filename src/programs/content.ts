import type { ContentItem } from "./types";
import { l } from "./types";
export function item(
  es: string,
  en: string,
  esText: string,
  enText: string,
  label?: string,
  icon?: string,
): ContentItem {
  return { title: l(es, en), text: l(esText, enText), label, icon };
}
