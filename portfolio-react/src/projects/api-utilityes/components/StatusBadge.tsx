import type { HttpMethod } from "../types/api";

type Props = {
  method: HttpMethod;
};

const methodStyles: Record<HttpMethod, string> = {
  GET: "bg-[#eaf7f0] text-[#2f7a54] border-[#cfe7d8]",
  POST: "bg-[#eef4fb] text-[#3f6f9e] border-[#d6e2f2]",
  PATCH: "bg-[#fbf5e8] text-[#8b6b2c] border-[#eadcb8]",
  DELETE: "bg-[#fdecec] text-[#9b3a3a] border-[#f3cfcf]",
};

export default function StatusBadge({ method }: Props) {
  return (
    <span
      className={`inline-flex min-w-[72px] justify-center rounded-full border px-3 py-1 text-xs font-semibold tracking-[0.12em] ${methodStyles[method]}`}
    >
      {method}
    </span>
  );
}