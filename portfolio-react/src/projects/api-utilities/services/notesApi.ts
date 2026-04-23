import { apiUtilitiesTranslations } from "../translations/translations";
import { hasSupabaseConfig, supabase } from "./supabaseClient";

type NoteRow = {
  id: number;
  title: string;
  content: string;
  created_at: string;
};

function getCurrentTranslations() {
  const savedLanguage = localStorage.getItem("language");
  const language = savedLanguage === "es" ? "es" : "en";
  return apiUtilitiesTranslations[language];
}

let mockNotes: NoteRow[] = [
  {
    id: 1,
    title: "Demo note",
    content: "This row comes from local mock data until Supabase is configured.",
    created_at: new Date().toISOString(),
  },
  {
    id: 2,
    title: "Second note",
    content: "You can create, update and delete notes from the playground.",
    created_at: new Date().toISOString(),
  },
];

function getNextId() {
  if (mockNotes.length === 0) return 1;
  return Math.max(...mockNotes.map((note) => note.id)) + 1;
}

async function getAllMock() {
  return [...mockNotes];
}

async function createMock(body: Record<string, unknown>) {
  const newNote: NoteRow = {
    id: getNextId(),
    title: typeof body.title === "string" ? body.title : "",
    content: typeof body.content === "string" ? body.content : "",
    created_at: new Date().toISOString(),
  };

  mockNotes = [newNote, ...mockNotes];
  return newNote;
}

async function updateMock(body: Record<string, unknown>) {
  const t = getCurrentTranslations();
  const id = Number(body.id);

  if (!id) {
    throw new Error(t.noteIdRequiredForUpdate);
  }

  const existing = mockNotes.find((note) => note.id === id);

  if (!existing) {
    throw new Error(t.noteNotFound.replace("{id}", String(id)));
  }

  const updated: NoteRow = {
    ...existing,
    title: typeof body.title === "string" ? body.title : existing.title,
    content: typeof body.content === "string" ? body.content : existing.content,
  };

  mockNotes = mockNotes.map((note) => (note.id === id ? updated : note));
  return updated;
}

async function removeMock(body: Record<string, unknown>) {
  const t = getCurrentTranslations();
  const id = Number(body.id);

  if (!id) {
    throw new Error(t.noteIdRequiredForDelete);
  }

  const exists = mockNotes.some((note) => note.id === id);

  if (!exists) {
    throw new Error(t.noteNotFound.replace("{id}", String(id)));
  }

  mockNotes = mockNotes.filter((note) => note.id !== id);

  return {
    success: true,
    deletedId: id,
  };
}

async function getAllSupabase() {
  const t = getCurrentTranslations();

  if (!supabase) {
    throw new Error(t.supabaseNotConfigured);
  }

  const { data, error } = await supabase
    .from("notes")
    .select("*")
    .order("id", { ascending: false });

  if (error) {
    throw new Error(error.message || t.errorFetchingNotes);
  }

  return data ?? [];
}

async function createSupabase(body: Record<string, unknown>) {
  const t = getCurrentTranslations();

  if (!supabase) {
    throw new Error(t.supabaseNotConfigured);
  }

  const payload = {
    title: typeof body.title === "string" ? body.title : "",
    content: typeof body.content === "string" ? body.content : "",
  };

  const { data, error } = await supabase
    .from("notes")
    .insert(payload)
    .select()
    .single();

  if (error) {
    throw new Error(error.message || t.errorCreatingNote);
  }

  return data;
}

async function updateSupabase(body: Record<string, unknown>) {
  const t = getCurrentTranslations();

  if (!supabase) {
    throw new Error(t.supabaseNotConfigured);
  }

  const id = Number(body.id);

  if (!id) {
    throw new Error(t.noteIdRequiredForUpdate);
  }

  const updatePayload: Record<string, unknown> = {};

  if (typeof body.title === "string") {
    updatePayload.title = body.title;
  }

  if (typeof body.content === "string") {
    updatePayload.content = body.content;
  }

  const { data, error } = await supabase
    .from("notes")
    .update(updatePayload)
    .eq("id", id)
    .select()
    .single();

  if (error) {
    throw new Error(error.message || t.errorUpdatingNote);
  }

  return data;
}

async function removeSupabase(body: Record<string, unknown>) {
  const t = getCurrentTranslations();

  if (!supabase) {
    throw new Error(t.supabaseNotConfigured);
  }

  const id = Number(body.id);

  if (!id) {
    throw new Error(t.noteIdRequiredForDelete);
  }

  const { error } = await supabase.from("notes").delete().eq("id", id);

  if (error) {
    throw new Error(error.message || t.errorDeletingNote);
  }

  return {
    success: true,
    deletedId: id,
  };
}

export async function executeCrudEndpoint(
  endpointId: string,
  body: Record<string, unknown>
) {
  const t = getCurrentTranslations();

  if (hasSupabaseConfig) {
    switch (endpointId) {
      case "get-notes":
        return getAllSupabase();
      case "create-note":
        return createSupabase(body);
      case "update-note":
        return updateSupabase(body);
      case "delete-note":
        return removeSupabase(body);
      default:
        throw new Error(t.unsupportedCrudEndpoint);
    }
  }

  switch (endpointId) {
    case "get-notes":
      return getAllMock();
    case "create-note":
      return createMock(body);
    case "update-note":
      return updateMock(body);
    case "delete-note":
      return removeMock(body);
    default:
      throw new Error(t.unsupportedCrudEndpoint);
  }
}