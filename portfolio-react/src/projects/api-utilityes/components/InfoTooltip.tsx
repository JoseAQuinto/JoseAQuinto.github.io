type Props = {
  text: string;
};

export default function InfoTooltip({ text }: Props) {
  return (
    <div className="group relative">
      <button
        type="button"
        className="
          flex h-6 w-6 items-center justify-center
          rounded-full
          border border-[#d8d2c8]
          text-xs font-medium
          text-[#6d655f]
          transition
          hover:bg-[#f3eee7]
        "
        aria-label="Información"
      >
        i
      </button>

      <div
        className="
          pointer-events-none
          absolute
          left-1/2
          top-full
          z-50
          mt-3
          w-72
          -translate-x-1/2
          rounded-xl
          border border-[#e5dfd6]
          bg-white/95
          p-4
          text-left
          text-sm
          text-[#3d3d3d]
          shadow-lg
          opacity-0
          backdrop-blur-sm
          transition
          duration-200
          group-hover:opacity-100
          group-focus-within:opacity-100
        "
      >
        {text}
      </div>
    </div>
  );
}