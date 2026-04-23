import {
  createContext,
  useContext,
  useEffect,
  useMemo,
  useState,
  type ReactNode,
} from "react";
import { apiUtilitiesTranslations } from "./translations";
import type { ApiUtilitiesLanguage } from "./types";

type ApiUtilitiesLanguageContextType = {
  language: ApiUtilitiesLanguage;
  setLanguage: React.Dispatch<React.SetStateAction<ApiUtilitiesLanguage>>;
  toggleLanguage: () => void;
  t: (typeof apiUtilitiesTranslations)[ApiUtilitiesLanguage];
};

const ApiUtilitiesLanguageContext =
  createContext<ApiUtilitiesLanguageContextType | null>(null);

const LANGUAGE_STORAGE_KEY = "language";

function getInitialLanguage(): ApiUtilitiesLanguage {
  if (typeof window === "undefined") {
    return "en";
  }

  const saved = window.localStorage.getItem(LANGUAGE_STORAGE_KEY);
  return saved === "es" ? "es" : "en";
}

export function ApiUtilitiesLanguageProvider({
  children,
}: {
  children: ReactNode;
}) {
  const [language, setLanguage] =
    useState<ApiUtilitiesLanguage>(getInitialLanguage);

  useEffect(() => {
    window.localStorage.setItem(LANGUAGE_STORAGE_KEY, language);
  }, [language]);

  useEffect(() => {
    const handleStorage = (event: StorageEvent) => {
      if (event.key !== LANGUAGE_STORAGE_KEY) return;

      const newValue = event.newValue;
      setLanguage(newValue === "es" ? "es" : "en");
    };

    window.addEventListener("storage", handleStorage);
    return () => window.removeEventListener("storage", handleStorage);
  }, []);

  const toggleLanguage = () => {
    setLanguage((current) => (current === "es" ? "en" : "es"));
  };

  const value = useMemo(
    () => ({
      language,
      setLanguage,
      toggleLanguage,
      t: apiUtilitiesTranslations[language],
    }),
    [language]
  );

  return (
    <ApiUtilitiesLanguageContext.Provider value={value}>
      {children}
    </ApiUtilitiesLanguageContext.Provider>
  );
}

export function useApiUtilitiesLanguage() {
  const context = useContext(ApiUtilitiesLanguageContext);

  if (!context) {
    throw new Error(
      "useApiUtilitiesLanguage debe usarse dentro de ApiUtilitiesLanguageProvider"
    );
  }

  return context;
}