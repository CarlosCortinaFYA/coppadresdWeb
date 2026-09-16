import { useEffect, useState } from "react";
import type { ReactNode } from "react";
import { translations } from "./translations";
import type { Language } from "./translations";

import { Preferences } from "./usePreferences";
import type { Theme } from "./usePreferences";
function readPreference<T extends string>(
  key: string,
  values: readonly T[],
  fallback: T,
): T {
  try {
    const stored = localStorage.getItem(key);
    return values.includes(stored as T) ? (stored as T) : fallback;
  } catch {
    return fallback;
  }
}
export function PreferencesProvider({ children }: { children: ReactNode }) {
  const [language, setLanguage] = useState<Language>(() =>
    readPreference("copp-language", ["es", "en"], "es"),
  );
  const [theme, setTheme] = useState<Theme>(() =>
    readPreference("copp-theme", ["light", "dark"], "light"),
  );
  const t = translations[language];
  useEffect(() => {
    document.documentElement.lang = language;
    document.title = t.metaTitle;
    document
      .querySelector('meta[name="description"]')
      ?.setAttribute("content", t.metaDescription);
    document
      .querySelector('meta[property="og:title"]')
      ?.setAttribute("content", t.metaTitle);
    document
      .querySelector('meta[property="og:description"]')
      ?.setAttribute("content", t.metaDescription);
    try {
      localStorage.setItem("copp-language", language);
    } catch {
      /* Preferences remain in memory. */
    }
  }, [language, t]);
  useEffect(() => {
    document.documentElement.dataset.theme = theme;
    document
      .querySelector('meta[name="theme-color"]')
      ?.setAttribute("content", theme === "dark" ? "#0c1625" : "#f7f9fc");
    try {
      localStorage.setItem("copp-theme", theme);
    } catch {
      /* Preferences remain in memory. */
    }
  }, [theme]);
  return (
    <Preferences.Provider
      value={{
        language,
        theme,
        t,
        toggleLanguage: () => setLanguage(language === "es" ? "en" : "es"),
        toggleTheme: () => setTheme(theme === "light" ? "dark" : "light"),
      }}
    >
      {children}
    </Preferences.Provider>
  );
}
