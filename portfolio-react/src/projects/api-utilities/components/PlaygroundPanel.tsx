import { useEffect, useState } from "react";
import type { ApiEndpoint } from "../types/api";
import CodeBlock from "./CodeBlock";
import StatusBadge from "./StatusBadge";
import { executeUtility } from "../services/utilityApi";
import { executeCrudEndpoint } from "../services/notesApi";
import { hasSupabaseConfig } from "../services/supabaseClient";

const editorialFont = "'Georgia', 'Times New Roman', serif";

type Props = {
  endpoint: ApiEndpoint;
};

export default function PlaygroundPanel({ endpoint }: Props) {
  const [requestText, setRequestText] = useState(
    JSON.stringify(endpoint.requestExample ?? {}, null, 2)
  );
  const [responseData, setResponseData] = useState<unknown>(
    endpoint.responseExample
  );
  const [isLoading, setIsLoading] = useState(false);
  const [errorMessage, setErrorMessage] = useState("");
  const [statusText, setStatusText] = useState("200 OK");

  useEffect(() => {
    setRequestText(JSON.stringify(endpoint.requestExample ?? {}, null, 2));
    setResponseData(endpoint.responseExample);
    setErrorMessage("");
    setStatusText("200 OK");
  }, [endpoint]);

  const handleReset = () => {
    setRequestText(JSON.stringify(endpoint.requestExample ?? {}, null, 2));
    setResponseData(endpoint.responseExample);
    setErrorMessage("");
    setStatusText("200 OK");
  };

  const handleSendRequest = async () => {
    setErrorMessage("");
    setIsLoading(true);
    setStatusText("Loading...");

    try {
      const parsedBody = JSON.parse(requestText) as Record<string, unknown>;

      const result =
        endpoint.section === "utilities"
          ? await executeUtility({
              endpointId: endpoint.id,
              body: parsedBody,
            })
          : await executeCrudEndpoint(endpoint.id, parsedBody);

      setResponseData(result);
      setStatusText("200 OK");
    } catch (error) {
      const message =
        error instanceof Error ? error.message : "Error desconocido.";
      setErrorMessage(message);
      setStatusText("400 ERROR");
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <section className="rounded-[30px] border border-[#e5dfd6] bg-white/88 p-6 backdrop-blur-sm transition-[box-shadow,border-color,background-color] duration-500 hover:border-[#cfc6ba] hover:bg-white hover:shadow-[0_20px_60px_rgba(0,0,0,0.06)]">
      <div className="border-b border-[#e8e2d9] pb-4">
        <div className="mb-3 flex items-center gap-3">
          <StatusBadge method={endpoint.method} />
          <span
            className="text-[10px] uppercase tracking-[0.18em] text-[#9b948a]"
            style={{ fontFamily: editorialFont }}
          >
            Playground
          </span>
        </div>

        <h3
          className="text-[1.55rem] font-normal leading-[1.2] text-[#171717]"
          style={{ fontFamily: editorialFont }}
        >
          Interactive request preview
        </h3>

        <p
          className="mt-2 text-sm leading-[1.9] text-[#6d655f]"
          style={{ fontFamily: editorialFont }}
        >
          {endpoint.section === "utilities"
            ? "Este panel ejecuta utilidades. Si Supabase está configurado, podrá invocar Edge Functions; si no, usa modo mock."
            : "Este panel ejecuta operaciones CRUD sobre la tabla notes. Si Supabase no está configurado todavía, usa datos mock locales."}
        </p>

        <div className="mt-4 flex flex-wrap items-center gap-3">
          <p
            className="text-[10px] uppercase tracking-[0.18em]"
            style={{
              fontFamily: editorialFont,
              color: hasSupabaseConfig ? "#2f7a54" : "#8f887f",
            }}
          >
            {hasSupabaseConfig ? "Supabase mode" : "Mock mode"}
          </p>

          <span
            className={`rounded-full border px-3 py-1 text-[10px] uppercase tracking-[0.14em] ${
              statusText === "200 OK"
                ? "border-[#cfe7d8] bg-[#eaf7f0] text-[#2f7a54]"
                : statusText === "Loading..."
                ? "border-[#eadcb8] bg-[#fbf5e8] text-[#8b6b2c]"
                : "border-[#f3cfcf] bg-[#fdecec] text-[#9b3a3a]"
            }`}
            style={{ fontFamily: editorialFont }}
          >
            {statusText}
          </span>
        </div>
      </div>

      <div className="mt-6 grid gap-6">
        <div className="overflow-hidden rounded-[22px] border border-[#e4dfd8] bg-[#fbfaf7]">
          <div className="border-b border-[#e4dfd8] px-4 py-3">
            <p
              className="text-[10px] uppercase tracking-[0.2em] text-[#9b948a]"
              style={{ fontFamily: editorialFont }}
            >
              Request body
            </p>
          </div>

          <div className="p-4">
            <textarea
              value={requestText}
              onChange={(e) => setRequestText(e.target.value)}
              spellCheck={false}
              className="min-h-[220px] w-full resize-y rounded-[16px] border border-[#e4dfd8] bg-white px-4 py-3 font-mono text-sm leading-7 text-[#403b36] outline-none transition focus:border-[#cfc6ba]"
            />
          </div>
        </div>

        <div className="flex flex-wrap items-center gap-3">
          <button
            type="button"
            onClick={handleSendRequest}
            disabled={isLoading}
            className="rounded-full border border-[#cfc5b9] bg-[#f9f7f4] px-4 py-2.5 text-[11px] uppercase tracking-[0.14em] text-[#302c28] transition-all duration-300 hover:border-[#c3b9ad] hover:bg-[#f3eee7] hover:text-[#2a2622] hover:shadow-[0_6px_18px_rgba(0,0,0,0.05)] disabled:cursor-not-allowed disabled:opacity-60"
            style={{ fontFamily: editorialFont }}
          >
            {isLoading ? "Sending..." : "Send request"}
          </button>

          <button
            type="button"
            onClick={handleReset}
            className="rounded-full border border-[#ddd5cb] bg-white px-4 py-2.5 text-[11px] uppercase tracking-[0.14em] text-[#7c756d] transition-all duration-300 hover:border-[#c3b9ad] hover:bg-[#faf8f5] hover:text-[#2a2622]"
            style={{ fontFamily: editorialFont }}
          >
            Reset
          </button>

          <span
            className="text-[10px] uppercase tracking-[0.18em] text-[#a09890]"
            style={{ fontFamily: editorialFont }}
          >
            {endpoint.path}
          </span>
        </div>

        {errorMessage ? (
          <div className="rounded-[20px] border border-[#f1d1d1] bg-[#fff6f6] px-4 py-3 text-sm text-[#9b3a3a]">
            {errorMessage}
          </div>
        ) : null}

        <CodeBlock title="Response" code={responseData} />
      </div>
    </section>
  );
}