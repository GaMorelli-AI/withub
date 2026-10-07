"use client";

import { createContext, useCallback, useContext, useEffect, useState } from "react";
import enUS from "@/locales/en-US.json";
import ptBR from "@/locales/pt-BR.json";

export type Locale = "en-US" | "pt-BR";

const DICTIONARIES: Record<Locale, Record<string, string>> = {
  "en-US": enUS,
  "pt-BR": ptBR,
};

export const LOCALE_LABELS: Record<Locale, string> = {
  "en-US": "EN",
  "pt-BR": "PT-BR",
};

const STORAGE_KEY = "withub-locale";

interface I18nContextValue {
  locale: Locale;
  setLocale: (locale: Locale) => void;
  t: (key: string, vars?: Record<string, string | number>) => string;
}

const I18nContext = createContext<I18nContextValue | null>(null);

export function I18nProvider({ children }: { children: React.ReactNode }) {
  const [locale, setLocaleState] = useState<Locale>("en-US");

  useEffect(() => {
    // One-time sync from localStorage after mount: the default "en-US" must
    // match what the server rendered, so this can't be a lazy initializer.
    const stored = window.localStorage.getItem(STORAGE_KEY) as Locale | null;
    if (stored === "en-US" || stored === "pt-BR") {
      // eslint-disable-next-line react-hooks/set-state-in-effect
      setLocaleState(stored);
    }
  }, []);

  const setLocale = useCallback((next: Locale) => {
    setLocaleState(next);
    window.localStorage.setItem(STORAGE_KEY, next);
  }, []);

  const t = useCallback(
    (key: string, vars?: Record<string, string | number>) => {
      const dict = DICTIONARIES[locale];
      let value = dict[key] ?? DICTIONARIES["en-US"][key] ?? key;
      if (vars) {
        for (const [k, v] of Object.entries(vars)) {
          value = value.replace(`{${k}}`, String(v));
        }
      }
      return value;
    },
    [locale]
  );

  return (
    <I18nContext.Provider value={{ locale, setLocale, t }}>
      {children}
    </I18nContext.Provider>
  );
}

export function useI18n() {
  const ctx = useContext(I18nContext);
  if (!ctx) throw new Error("useI18n must be used within I18nProvider");
  return ctx;
}
