import { useState } from "react";
import { executeCrudEndpoint } from "../services/notesApi";
import { hasSupabaseConfig } from "../services/supabaseClient";
import { executeUtility } from "../services/utilityApi";
import { useApiUtilitiesLanguage } from "../translations/ApiUtilitiesLanguageProvider";
import type { ApiEndpoint } from "../types/api";
import CodeBlock from "./CodeBlock";
import StatusBadge from "./StatusBadge";

type Props = {
  endpoint: ApiEndpoint;
  onCrudMutationSuccess?: () => void | Promise<void>;
};

function PlaygroundContent({ endpoint, onCrudMutationSuccess }: Props) {
  const { t } = useApiUtilitiesLanguage();
  const [requestText, setRequestText] = useState(() =>
    JSON.stringify(endpoint.requestExample ?? {}, null, 2)
  );
  const [responseData, setResponseData] = useState<unknown>(endpoint.responseExample);
  const [isLoading, setIsLoading] = useState(false);
  const [errorMessage, setErrorMessage] = useState("");
  const [statusText, setStatusText] = useState<string>(t.statusOk);

  function handleReset() {
    setRequestText(JSON.stringify(endpoint.requestExample ?? {}, null, 2));
    setResponseData(endpoint.responseExample);
    setErrorMessage("");
    setStatusText(t.statusOk);
  }

  async function handleSendRequest() {
    setErrorMessage("");
    setIsLoading(true);
    setStatusText(t.statusLoading);

    try {
      const parsedBody = JSON.parse(requestText) as Record<string, unknown>;
      const result =
        endpoint.section === "utilities"
          ? await executeUtility({ endpointId: endpoint.id, body: parsedBody })
          : await executeCrudEndpoint(endpoint.id, parsedBody);

      setResponseData(result);
      setStatusText(t.statusOk);
      if (endpoint.section === "crud") await onCrudMutationSuccess?.();
    } catch (error) {
      setErrorMessage(error instanceof Error ? error.message : t.unknownError);
      setStatusText(t.statusError);
    } finally {
      setIsLoading(false);
    }
  }

  const statusClasses =
    statusText === t.statusOk
      ? "border-emerald-200 bg-emerald-50 text-emerald-700"
      : statusText === t.statusLoading
        ? "border-amber-200 bg-amber-50 text-amber-800"
        : "border-red-200 bg-red-50 text-red-700";

  return (
    <section className="overflow-hidden rounded-xl border border-slate-200 bg-white shadow-sm">
      <div className="border-b border-slate-200 p-4 sm:p-6">
        <div className="flex flex-wrap items-center gap-3">
          <StatusBadge method={endpoint.method} />
          <span className="text-xs font-semibold uppercase tracking-[0.14em] text-slate-500">
            {t.playgroundLabel}
          </span>
          <span className={`rounded-full border px-2.5 py-1 text-[10px] font-semibold uppercase tracking-wider ${statusClasses}`}>
            {statusText}
          </span>
        </div>
        <h3 className="mt-4 text-lg font-semibold text-slate-950 sm:text-xl">
          {t.interactiveRequestPreview}
        </h3>
        <p className="mt-2 max-w-3xl text-sm leading-6 text-slate-600">
          {endpoint.section === "utilities"
            ? t.playgroundUtilitiesDescription
            : t.playgroundCrudDescription}
        </p>
        <p className="mt-3 inline-flex items-center gap-2 text-xs font-semibold text-slate-500">
          <span className={`h-2 w-2 rounded-full ${hasSupabaseConfig ? "bg-emerald-500" : "bg-slate-400"}`} />
          {hasSupabaseConfig ? t.supabaseMode : t.mockMode}
        </p>
      </div>

      <div className="grid min-w-0 gap-5 p-4 sm:p-6 2xl:grid-cols-2">
        <div className="min-w-0">
          <div className="overflow-hidden rounded-lg border border-slate-800 bg-slate-950">
            <div className="flex items-center justify-between border-b border-slate-800 bg-slate-900 px-4 py-2.5">
              <span className="text-[10px] font-semibold uppercase tracking-[0.16em] text-slate-400">
                {t.requestBody}
              </span>
              <span className="font-mono text-[10px] text-slate-500">Editable JSON</span>
            </div>
            <textarea
              value={requestText}
              onChange={(event) => setRequestText(event.target.value)}
              spellCheck={false}
              aria-label={t.requestBody}
              className="min-h-64 w-full resize-y bg-slate-950 p-4 font-mono text-xs leading-6 text-slate-200 outline-none focus:ring-2 focus:ring-inset focus:ring-blue-500 sm:text-sm"
            />
          </div>

          <div className="mt-4 flex flex-col gap-3 sm:flex-row sm:items-center">
            <button
              type="button"
              onClick={() => void handleSendRequest()}
              disabled={isLoading}
              className="h-10 rounded-lg bg-blue-700 px-4 text-xs font-semibold text-white transition hover:bg-blue-800 disabled:cursor-not-allowed disabled:opacity-60"
            >
              {isLoading ? t.sendingRequest : t.sendRequest}
            </button>
            <button
              type="button"
              onClick={handleReset}
              className="h-10 rounded-lg border border-slate-300 bg-white px-4 text-xs font-semibold text-slate-700 transition hover:bg-slate-50"
            >
              {t.reset}
            </button>
          </div>
        </div>

        <div className="min-w-0">
          {errorMessage ? (
            <div className="mb-3 rounded-lg border border-red-200 bg-red-50 px-4 py-3 text-sm text-red-700" role="alert">
              {errorMessage}
            </div>
          ) : null}
          <CodeBlock title={t.response} code={responseData} />
        </div>
      </div>
    </section>
  );
}

export default function PlaygroundPanel(props: Props) {
  const { language } = useApiUtilitiesLanguage();

  return (
    <PlaygroundContent
      key={`${props.endpoint.id}:${language}`}
      {...props}
    />
  );
}
