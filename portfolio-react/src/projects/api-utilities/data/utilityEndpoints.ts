import type { ApiEndpoint } from "../types/api";

export const utilityEndpoints: ApiEndpoint[] = [
  {
    id: "uppercase",
    section: "utilities",
    title: "Transform text to uppercase",
    method: "POST",
    path: "/transform/uppercase",
    description:
      "Receives a text string and returns the same content transformed to uppercase.",
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
    title: "Generate a URL slug",
    method: "POST",
    path: "/transform/slugify",
    description:
      "Converts a text string into a clean URL-friendly slug.",
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
    title: "Count words in a text",
    method: "POST",
    path: "/transform/count-words",
    description:
      "Returns the total number of words and characters from the input text.",
    requestExample: {
      text: "This is a fake enterprise utility endpoint",
    },
    responseExample: {
      words: 7,
      characters: 41,
    },
  },
];