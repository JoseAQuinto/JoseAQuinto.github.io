import type { ApiEndpoint } from "../types/api";
import { apiUtilitiesTranslations } from "../translations/translations";

function getCurrentTranslations() {
  const savedLanguage = localStorage.getItem("language");
  const language = savedLanguage === "es" ? "es" : "en";
  return apiUtilitiesTranslations[language];
}

export function getUtilityEndpoints(): ApiEndpoint[] {
  const t = getCurrentTranslations();

  return [
    {
      id: "uppercase",
      section: "utilities",
      title: t.utilityUppercaseTitle,
      method: "POST",
      path: "/transform/uppercase",
      description: t.utilityUppercaseDescription,
      requestExample: {
        text: "hola jose",
      },
      responseExample: {
        original: "hola jose",
        result: "HOLA JOSE",
        length: 9,
      },
    },
    {
      id: "slugify",
      section: "utilities",
      title: t.utilitySlugifyTitle,
      method: "POST",
      path: "/transform/slugify",
      description: t.utilitySlugifyDescription,
      requestExample: {
        text: "React API Utilities Demo",
      },
      responseExample: {
        original: "React API Utilities Demo",
        slug: "react-api-utilities-demo",
      },
    },
    {
      id: "count-words",
      section: "utilities",
      title: t.utilityCountWordsTitle,
      method: "POST",
      path: "/transform/count-words",
      description: t.utilityCountWordsDescription,
      requestExample: {
        text: "This is a fake enterprise utility endpoint",
      },
      responseExample: {
        words: 7,
        characters: 41,
      },
    },
  ];
}