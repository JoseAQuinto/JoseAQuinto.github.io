import { useApiUtilitiesLanguage } from "../translations/ApiUtilitiesLanguageProvider";

type NoteRow = { id: number; title: string; content: string; created_at: string };
type Props = {
  rows: NoteRow[];
  isLoading: boolean;
  errorMessage: string;
  onRefresh: () => void | Promise<void>;
};

function formatDate(value: string) {
  const date = new Date(value);
  if (Number.isNaN(date.getTime())) return value;
  return new Intl.DateTimeFormat(undefined, {
    dateStyle: "short",
    timeStyle: "short",
  }).format(date);
}

export default function NotesTablePanel({
  rows,
  isLoading,
  errorMessage,
  onRefresh,
}: Props) {
  const { t } = useApiUtilitiesLanguage();

  return (
    <section className="overflow-hidden rounded-xl border border-slate-200 bg-white shadow-sm">
      <div className="flex flex-col gap-4 border-b border-slate-200 p-4 sm:flex-row sm:items-center sm:justify-between sm:p-5">
        <div>
          <p className="text-xs font-semibold uppercase tracking-[0.14em] text-slate-500">
            {t.notesTableEyebrow}
          </p>
          <h3 className="mt-1 text-lg font-semibold text-slate-950">{t.notesTableTitle}</h3>
          <p className="mt-1 text-sm text-slate-600">{t.notesTableDescription}</p>
        </div>
        <button
          type="button"
          onClick={() => void onRefresh()}
          disabled={isLoading}
          className="h-10 rounded-lg border border-slate-300 bg-white px-4 text-xs font-semibold text-slate-700 transition hover:bg-slate-50 disabled:opacity-60"
        >
          {t.refreshTable}
        </button>
      </div>

      {errorMessage ? (
        <div className="m-4 rounded-lg border border-red-200 bg-red-50 px-4 py-3 text-sm text-red-700">
          {errorMessage}
        </div>
      ) : null}

      <div className="overflow-x-auto">
        <table className="w-full min-w-[720px] border-collapse text-left">
          <thead>
            <tr className="border-b border-slate-200 bg-slate-50">
              {["ID", t.notesTableTitleColumn, t.notesTableContentColumn, t.notesTableCreatedAtColumn].map((label) => (
                <th key={label} className="px-5 py-3 text-xs font-semibold uppercase tracking-wider text-slate-500">
                  {label}
                </th>
              ))}
            </tr>
          </thead>
          <tbody className="divide-y divide-slate-100">
            {isLoading ? (
              <tr><td colSpan={4} className="px-5 py-12 text-center text-sm text-slate-500">{t.loadingTable}</td></tr>
            ) : rows.length === 0 ? (
              <tr><td colSpan={4} className="px-5 py-12 text-center text-sm text-slate-500">{t.noNotesAvailable}</td></tr>
            ) : (
              rows.map((row) => (
                <tr key={row.id} className="transition hover:bg-slate-50/70">
                  <td className="px-5 py-4 font-mono text-xs text-slate-600">{row.id}</td>
                  <td className="px-5 py-4 text-sm font-semibold text-slate-900">{row.title}</td>
                  <td className="max-w-md px-5 py-4 text-sm text-slate-600"><p className="truncate">{row.content}</p></td>
                  <td className="whitespace-nowrap px-5 py-4 text-sm text-slate-500">{formatDate(row.created_at)}</td>
                </tr>
              ))
            )}
          </tbody>
        </table>
      </div>
    </section>
  );
}
