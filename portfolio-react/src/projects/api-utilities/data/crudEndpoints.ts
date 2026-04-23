import type { ApiEndpoint } from "../types/api";

export const crudEndpoints: ApiEndpoint[] = [
  {
    id: "get-notes",
    section: "crud",
    title: "Get all notes",
    method: "GET",
    path: "/notes",
    description:
      "Reads all notes stored in Supabase. If Supabase is not configured yet, it falls back to local mock data.",
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
    title: "Create a new note",
    method: "POST",
    path: "/notes",
    description:
      "Creates a new note in Supabase using title and content.",
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
    title: "Update an existing note",
    method: "PATCH",
    path: "/notes/:id",
    description:
      "Updates a note by id. You can send title, content, or both.",
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
    title: "Delete a note",
    method: "DELETE",
    path: "/notes/:id",
    description:
      "Deletes a note by id from Supabase.",
    requestExample: {
      id: 1,
    },
    responseExample: {
      success: true,
      deletedId: 1,
    },
  },
];