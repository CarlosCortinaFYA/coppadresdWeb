import { createContext, useContext } from "react";
import type { Language, translations } from "./translations";
export type Theme = "light" | "dark";

export const Preferences = createContext<{
  language: Language;
  theme: Theme;
  t: typeof translations.es;
  toggleLanguage: () => void;
  toggleTheme: () => void;
} | null>(null);

export function usePreferences() {
  const context = useContext(Preferences);
  if (!context) throw new Error("PreferencesProvider is required");
  return context;
}
