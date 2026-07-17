import { useCallback, useEffect, useMemo, useState } from "react";
import ApiEndpointCard from "../components/ApiEndpointCard";
import ApiHeader from "../components/ApiHeader";
import NotesTablePanel from "../components/NotesTablePanel";
import PlaygroundPanel from "../components/PlaygroundPanel";
import SectionTabs from "../components/SectionTabs";
import UserSessionInfo from "../components/UserSessionInfo";
import UtilitySidebar from "../components/UtilitySidebar";
import { getCrudEndpoints } from "../data/crudEndpoints";
import { getUtilityEndpoints } from "../data/utilityEndpoints";
import { executeCrudEndpoint } from "../services/notesApi";
import { useApiUtilitiesLanguage } from "../translations/ApiUtilitiesLanguageProvider";
import type { ApiEndpoint, ApiSection } from "../types/api";

type NoteRow = {
  id: number;
  title: string;
  content: string;
  created_at: string;
};

export default function ApiUtilitiesPage() {
  const { language, t } = useApiUtilitiesLanguage();
  const [activeSection, setActiveSection] = useState<ApiSection>("utilities");
  const [selectedId, setSelectedId] = useState("");
  const [notesRows, setNotesRows] = useState<NoteRow[]>([]);
  const [notesLoading, setNotesLoading] = useState(false);
  const [notesError, setNotesError] = useState("");

  const endpoints = useMemo<ApiEndpoint[]>(() => {
    // Endpoint copy is read from the same persisted language key.
    void language;
    return activeSection === "utilities"
      ? getUtilityEndpoints()
      : getCrudEndpoints();
  }, [activeSection, language]);

  const selectedEndpoint = useMemo(
    () => endpoints.find((item) => item.id === selectedId) ?? endpoints[0],
    [endpoints, selectedId]
  );

  const loadNotesTable = useCallback(async () => {
    setNotesLoading(true);
    setNotesError("");

    try {
      const result = await executeCrudEndpoint("get-notes", {});
      setNotesRows(Array.isArray(result) ? (result as NoteRow[]) : []);
    } catch (error) {
      setNotesError(error instanceof Error ? error.message : t.unknownError);
    } finally {
      setNotesLoading(false);
    }
  }, [t.unknownError]);

  useEffect(() => {
    if (activeSection === "crud") void loadNotesTable();
  }, [activeSection, loadNotesTable]);

  if (!selectedEndpoint) return null;

  return (
    <div className="min-h-screen bg-slate-100 font-sans text-slate-900">
      <ApiHeader />

      <main className="mx-auto max-w-[1440px] px-4 py-5 sm:px-6 sm:py-7 lg:px-8">
        <div className="mb-5 flex flex-col gap-4 rounded-xl border border-slate-200 bg-white p-4 shadow-sm sm:flex-row sm:items-center sm:justify-between sm:p-5">
          <SectionTabs activeSection={activeSection} onChange={setActiveSection} />
          <UserSessionInfo />
        </div>

        <div className="grid min-w-0 gap-5 xl:grid-cols-[290px_minmax(0,1fr)]">
          <UtilitySidebar
            endpoints={endpoints}
            selectedId={selectedEndpoint.id}
            onSelect={setSelectedId}
          />

          <div className="grid min-w-0 gap-5">
            <ApiEndpointCard endpoint={selectedEndpoint} />
            <PlaygroundPanel
              endpoint={selectedEndpoint}
              onCrudMutationSuccess={
                activeSection === "crud" ? loadNotesTable : undefined
              }
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
      </main>
    </div>
  );
}
