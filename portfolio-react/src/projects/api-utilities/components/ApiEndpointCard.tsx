import type { ApiEndpoint } from "../types/api";
import CodeBlock from "./CodeBlock";
import StatusBadge from "./StatusBadge";

const editorialFont = "'Georgia', 'Times New Roman', serif";

type Props = {
  endpoint: ApiEndpoint;
};

export default function ApiEndpointCard({ endpoint }: Props) {
  return (
    <section className="rounded-[30px] border border-[#e5dfd6] bg-white/88 p-6 backdrop-blur-sm transition-[box-shadow,border-color,background-color] duration-500 hover:border-[#cfc6ba] hover:bg-white hover:shadow-[0_20px_60px_rgba(0,0,0,0.06)]">
      <div className="flex flex-col gap-4 border-b border-[#e8e2d9] pb-5">
        <div className="flex flex-wrap items-center gap-3">
          <StatusBadge method={endpoint.method} />

          <code className="rounded-full border border-[#e7e0d7] bg-[#fbfaf7] px-3 py-1.5 text-sm text-[#4b453f]">
            {endpoint.path}
          </code>
        </div>

        <div>
          <h2
            className="text-[1.9rem] font-normal leading-[1.15] tracking-[-0.015em] text-[#171717]"
            style={{ fontFamily: editorialFont }}
          >
            {endpoint.title}
          </h2>

          <p
            className="mt-3 max-w-3xl text-sm leading-[1.95] text-[#6d655f]"
            style={{ fontFamily: editorialFont }}
          >
            {endpoint.description}
          </p>
        </div>
      </div>

      <div className="mt-6 grid gap-6 lg:grid-cols-2">
        <CodeBlock
          title="Request example"
          code={endpoint.requestExample ?? { note: "No request body" }}
        />

        <CodeBlock title="Response example" code={endpoint.responseExample} />
      </div>
    </section>
  );
}