import { useApiUtilitiesLanguage } from "../translations/ApiUtilitiesLanguageProvider";

const editorialFont = "'Georgia', 'Times New Roman', serif";

type NoteRow = {
  id: number;
  title: string;
  content: string;
  created_at: string;
};

type Props = {
  rows: NoteRow[];
  isLoading: boolean;
  errorMessage: string;
  onRefresh: () => void | Promise<void>;
};

function formatDate(value: string) {
  const date = new Date(value);

  if (Number.isNaN(date.getTime())) {
    return value;
  }

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
    <section className="rounded-md border border-[#e3ddd3] bg-white p-6 shadow-sm">
      {/* Header */}
      <div className="mb-6 flex flex-wrap items-center justify-between gap-4 border-b border-[#e6e0d7] pb-4">
        <div>
          <p
            className="text-[11px] uppercase tracking-wider text-[#8e877f]"
            style={{ fontFamily: editorialFont }}
          >
            {t.notesTableEyebrow}
          </p>

          <h3
            className="mt-1 text-lg font-semibold text-[#1c1a18]"
            style={{ fontFamily: editorialFont }}
          >
            {t.notesTableTitle}
          </h3>

          <p
            className="mt-1 text-sm text-[#6f6861]"
            style={{ fontFamily: editorialFont }}
          >
            {t.notesTableDescription}
          </p>
        </div>

        <button
          type="button"
          onClick={() => void onRefresh()}
          className="
            inline-flex items-center
            rounded-md
            border border-[#d6cfc6]
            bg-[#f7f4ef]
            px-4 py-2
            text-xs font-medium
            uppercase tracking-wide
            text-[#5f5953]
            transition
            hover:bg-[#f0ebe4]
            hover:border-[#c9c1b7]
            active:bg-[#e8e1d8]
          "
          style={{ fontFamily: editorialFont }}
        >
          {t.refreshTable}
        </button>
      </div>

      {/* Error */}
      {errorMessage ? (
        <div className="mb-4 rounded-md border border-[#f0cfcf] bg-[#fff5f5] px-4 py-3 text-sm text-[#9b3a3a]">
          {errorMessage}
        </div>
      ) : null}

      {/* Table */}
      <div className="overflow-hidden rounded-md border border-[#e3ddd3]">
        <div className="overflow-x-auto">
          <table className="min-w-full border-collapse text-left">
            <thead>
              <tr className="bg-[#f6f3ee] border-b border-[#e3ddd3]">
                <th className="px-4 py-3 text-xs font-semibold uppercase tracking-wide text-[#857f78]">
                  ID
                </th>

                <th className="px-4 py-3 text-xs font-semibold uppercase tracking-wide text-[#857f78]">
                  {t.notesTableTitleColumn}
                </th>

                <th className="px-4 py-3 text-xs font-semibold uppercase tracking-wide text-[#857f78]">
                  {t.notesTableContentColumn}
                </th>

                <th className="px-4 py-3 text-xs font-semibold uppercase tracking-wide text-[#857f78]">
                  {t.notesTableCreatedAtColumn}
                </th>
              </tr>
            </thead>

            <tbody>
              {isLoading ? (
                <tr>
                  <td
                    colSpan={4}
                    className="px-4 py-10 text-center text-sm text-[#8e877f]"
                  >
                    {t.loadingTable}
                  </td>
                </tr>
              ) : rows.length === 0 ? (
                <tr>
                  <td
                    colSpan={4}
                    className="px-4 py-10 text-center text-sm text-[#8e877f]"
                  >
                    {t.noNotesAvailable}
                  </td>
                </tr>
              ) : (
                rows.map((row) => (
                  <tr
                    key={row.id}
                    className="
                      border-b border-[#ece6dd]
                      even:bg-[#fbf9f6]
                      hover:bg-[#f6f2ec]
                      transition
                    "
                  >
                    <td className="px-4 py-3 text-sm font-medium text-[#3f3a35]">
                      {row.id}
                    </td>

                    <td className="px-4 py-3 text-sm text-[#2b2927]">
                      {row.title}
                    </td>

                    <td className="px-4 py-3 text-sm text-[#5f5953]">
                      <div className="max-w-[420px] truncate">
                        {row.content}
                      </div>
                    </td>

                    <td className="px-4 py-3 text-sm text-[#5f5953]">
                      {formatDate(row.created_at)}
                    </td>
                  </tr>
                ))
              )}
            </tbody>
          </table>
        </div>
      </div>
    </section>
  );
}