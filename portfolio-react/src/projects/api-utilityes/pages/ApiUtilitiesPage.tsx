import { useEffect, useMemo, useState } from "react";
import ApiEndpointCard from "../components/ApiEndpointCard";
import ApiHeader from "../components/ApiHeader";
import NotesTablePanel from "../components/NotesTablePanel";
import PlaygroundPanel from "../components/PlaygroundPanel";
import SectionTabs from "../components/SectionTabs";
import UtilitySidebar from "../components/UtilitySidebar";
import { getCrudEndpoints } from "../data/crudEndpoints";
import { getUtilityEndpoints } from "../data/utilityEndpoints";
import { executeCrudEndpoint } from "../services/notesApi";
import type { ApiEndpoint, ApiSection } from "../types/api";
import UserSessionInfo from "../components/UserSessionInfo";
import { useApiUtilitiesLanguage } from "../translations/ApiUtilitiesLanguageProvider";

type NoteRow = {
  id: number;
  title: string;
  content: string;
  created_at: string;
};

export default function ApiUtilitiesPage() {
  const { language, t } = useApiUtilitiesLanguage();

  const initialUtilityEndpoints = getUtilityEndpoints();

  const [activeSection, setActiveSection] =
    useState<ApiSection>("utilities");

  const [selectedId, setSelectedId] =
    useState<string>(initialUtilityEndpoints[0]?.id ?? "");

  const [notesRows, setNotesRows] = useState<NoteRow[]>([]);
  const [notesLoading, setNotesLoading] = useState(false);
  const [notesError, setNotesError] = useState("");

  const endpoints = useMemo<ApiEndpoint[]>(() => {
    return activeSection === "utilities"
      ? getUtilityEndpoints()
      : getCrudEndpoints();
  }, [activeSection, language]);

  useEffect(() => {
    setSelectedId(endpoints[0]?.id ?? "");
  }, [activeSection, endpoints]);

  const selectedEndpoint = useMemo(() => {
    return (
      endpoints.find((item) => item.id === selectedId) ??
      endpoints[0]
    );
  }, [endpoints, selectedId]);

  const loadNotesTable = async () => {
    setNotesLoading(true);
    setNotesError("");

    try {
      const result = await executeCrudEndpoint("get-notes", {});
      const normalizedRows = Array.isArray(result)
        ? (result as NoteRow[])
        : [];

      setNotesRows(normalizedRows);
    } catch (error) {
      const message =
        error instanceof Error ? error.message : t.unknownError;
      setNotesError(message);
    } finally {
      setNotesLoading(false);
    }
  };

  useEffect(() => {
    if (activeSection === "crud") {
      void loadNotesTable();
    }
  }, [activeSection]);

  if (!selectedEndpoint) {
    return null;
  }

  return (
    <div className="min-h-screen bg-[#f7f6f3] text-[#1a1a1a]">
      <div
        className="pointer-events-none absolute inset-0 opacity-100"
        style={{
          background:
            "radial-gradient(circle at 80% 20%, rgba(186,176,163,0.12), transparent 60%)",
        }}
      />

      <div className="relative mx-auto max-w-7xl px-6 py-10 sm:px-8">
        <ApiHeader />

        <UserSessionInfo />

        <SectionTabs
          activeSection={activeSection}
          onChange={setActiveSection}
        />

        <div className="grid gap-6 lg:grid-cols-[300px_minmax(0,1fr)]">
          <UtilitySidebar
            endpoints={endpoints}
            selectedId={selectedId}
            onSelect={setSelectedId}
          />

          <div className="grid gap-6">
            <ApiEndpointCard endpoint={selectedEndpoint} />

            <PlaygroundPanel
              endpoint={selectedEndpoint}
              onCrudMutationSuccess={activeSection === "crud" ? loadNotesTable : undefined}
            />

            {activeSection === "crud" ? (
              <NotesTablePanel
                rows={notesRows}
                isLoading={notesLoading}
                errorMessage={notesError}
                onRefresh={loadNotesTable}
              />
            ) : null}
          </div>
        </div>
      </div>
    </div>
  );
}