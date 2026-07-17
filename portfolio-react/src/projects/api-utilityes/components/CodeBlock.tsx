type Props = { title: string; code: unknown };

export default function CodeBlock({ title, code }: Props) {
  let formattedCode: string;
  try {
    formattedCode = JSON.stringify(code, null, 2);
  } catch {
    formattedCode = String(code);
  }

  return (
    <div className="min-w-0 overflow-hidden rounded-lg border border-slate-800 bg-slate-950">
      <div className="flex items-center justify-between border-b border-slate-800 bg-slate-900 px-4 py-2.5">
        <p className="text-[10px] font-semibold uppercase tracking-[0.16em] text-slate-400">
          {title}
        </p>
        <span className="font-mono text-[10px] text-slate-600">JSON</span>
      </div>
      <pre className="max-h-[360px] overflow-auto p-4 font-mono text-xs leading-6 text-slate-200 sm:text-sm">
        <code>{formattedCode}</code>
      </pre>
    </div>
  );
}
