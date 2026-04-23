import type { ApiEndpoint } from "../types/api";
import { apiUtilitiesTranslations } from "../translations/translations";

function getCurrentTranslations() {
  const savedLanguage = localStorage.getItem("language");
  const language = savedLanguage === "es" ? "es" : "en";
  return apiUtilitiesTranslations[language];
}

export function getCrudEndpoints(): ApiEndpoint[] {
  const t = getCurrentTranslations();

  return [
    {
      id: "get-notes",
      section: "crud",
      title: t.crudGetNotesTitle,
      method: "GET",
      path: "/notes",
      description: t.crudGetNotesDescription,
      requestExample: {},
      responseExample: [
        {
          id: 1,
          title: "Demo note",
          content: "This row comes from Supabase",
          created_at: "2026-04-23T10:00:00Z",
        },
      ],
    },
    {
      id: "create-note",
      section: "crud",
      title: t.crudCreateNoteTitle,
      method: "POST",
      path: "/notes",
      description: t.crudCreateNoteDescription,
      requestExample: {
        title: "New note",
        content: "Created from portfolio playground",
      },
      responseExample: {
        id: 2,
        title: "New note",
        content: "Created from portfolio playground",
        created_at: "2026-04-23T10:00:00Z",
      },
    },
    {
      id: "update-note",
      section: "crud",
      title: t.crudUpdateNoteTitle,
      method: "PATCH",
      path: "/notes/:id",
      description: t.crudUpdateNoteDescription,
      requestExample: {
        id: 1,
        title: "Updated note title",
        content: "Updated content from portfolio UI",
      },
      responseExample: {
        id: 1,
        title: "Updated note title",
        content: "Updated content from portfolio UI",
        created_at: "2026-04-23T10:00:00Z",
      },
    },
    {
      id: "delete-note",
      section: "crud",
      title: t.crudDeleteNoteTitle,
      method: "DELETE",
      path: "/notes/:id",
      description: t.crudDeleteNoteDescription,
      requestExample: {
        id: 1,
      },
      responseExample: {
        success: true,
        deletedId: 1,
      },
    },
  ];
}