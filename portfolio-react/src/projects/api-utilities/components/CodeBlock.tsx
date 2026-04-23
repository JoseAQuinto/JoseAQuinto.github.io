const editorialFont = "'Georgia', 'Times New Roman', serif";

type Props = {
  title: string;
  code: unknown;
};

export default function CodeBlock({ title, code }: Props) {
  return (
    <div className="overflow-hidden rounded-[22px] border border-[#e4dfd8] bg-[#fbfaf7]">
      <div className="border-b border-[#e4dfd8] px-4 py-3">
        <p
          className="text-[10px] uppercase tracking-[0.2em] text-[#9b948a]"
          style={{ fontFamily: editorialFont }}
        >
          {title}
        </p>
      </div>

      <pre className="overflow-x-auto px-4 py-4 text-sm leading-[1.9] text-[#403b36]">
        <code>{JSON.stringify(code, null, 2)}</code>
      </pre>
    </div>
  );
}