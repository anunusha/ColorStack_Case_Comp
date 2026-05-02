"use client";

import {
  createContext,
  useCallback,
  useContext,
  useEffect,
  useMemo,
  useState,
} from "react";

import translations from "@/data/translations.json";

const I18nContext = createContext({
  lang: "en",
  setLang: () => {},
  t: (key) => key,
});

function readInitialLang() {
  if (typeof window === "undefined") {
    return "en";
  }

  const saved = localStorage.getItem("taxbridge_lang");
  if (saved === "en" || saved === "hi") {
    return saved;
  }

  const browserLang = navigator.language?.toLowerCase() || "";
  if (browserLang.startsWith("hi")) {
    return "hi";
  }

  return "en";
}

export function I18nProvider({ children }) {
  const [lang, setLangState] = useState(readInitialLang);

  useEffect(() => {
    document.documentElement.setAttribute("lang", lang);
    document.documentElement.classList.toggle("lang-hi", lang === "hi");
  }, [lang]);

  const setLang = useCallback((newLang) => {
    setLangState(newLang);
    try {
      localStorage.setItem("taxbridge_lang", newLang);
    } catch {
      // ignore
    }
  }, []);

  const t = useCallback(
    (key, replacements = {}) => {
      const dict = translations[lang] ?? {};
      const fallback = translations.en ?? {};
      let text = dict[key] ?? fallback[key] ?? key;
      Object.entries(replacements).forEach(([placeholder, value]) => {
        text = text.replaceAll(`{${placeholder}}`, String(value));
      });
      return text;
    },
    [lang]
  );

  const value = useMemo(() => ({ lang, setLang, t }), [lang, setLang, t]);

  return <I18nContext.Provider value={value}>{children}</I18nContext.Provider>;
}

export function useTranslation() {
  return useContext(I18nContext);
}
