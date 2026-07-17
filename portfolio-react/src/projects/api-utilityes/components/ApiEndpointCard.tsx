import type { ApiEndpoint } from "../types/api";
import { useApiUtilitiesLanguage } from "../translations/ApiUtilitiesLanguageProvider";
import CodeBlock from "./CodeBlock";
import StatusBadge from "./StatusBadge";

type Props = { endpoint: ApiEndpoint };

export default function ApiEndpointCard({ endpoint }: Props) {
  const { t } = useApiUtilitiesLanguage();

  return (
    <section className="overflow-hidden rounded-xl border border-slate-200 bg-white shadow-sm">
      <div className="border-b border-slate-200 p-4 sm:p-6">
        <div className="flex min-w-0 flex-wrap items-center gap-3">
          <StatusBadge method={endpoint.method} />
          <code className="min-w-0 break-all rounded-md border border-slate-200 bg-slate-50 px-3 py-1.5 text-xs text-slate-700 sm:text-sm">
            {endpoint.path}
          </code>
        </div>
        <h2 className="mt-5 text-xl font-semibold tracking-tight text-slate-950 sm:text-2xl">
          {endpoint.title}
        </h2>
        <p className="mt-2 max-w-4xl text-sm leading-6 text-slate-600">
          {endpoint.description}
        </p>
      </div>

      <div className="grid min-w-0 gap-4 p-4 lg:grid-cols-2 sm:p-6">
        <CodeBlock
          title={t.requestExample}
          code={endpoint.requestExample ?? { note: t.noRequestBody }}
        />
        <CodeBlock title={t.responseExample} code={endpoint.responseExample} />
      </div>
    </section>
  );
}
