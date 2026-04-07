import type { ReactNode } from "react";

interface MobileDeviceFrameProps {
  children: ReactNode;
  className?: string;
}

export default function MobileDeviceFrame({
  children,
  className = "",
}: MobileDeviceFrameProps) {
  return (
    <div className={`mx-auto flex w-full justify-center px-4 py-8 ${className}`}>
      <div
        className="
          relative w-full max-w-[430px]
          rounded-[2.5rem]
          border-[10px] border-slate-900
          bg-slate-900
          shadow-[0_25px_80px_rgba(15,23,42,0.35)]
        "
      >
        {/* Cámara / isla superior */}
        <div className="pointer-events-none absolute left-1/2 top-0 z-30 -translate-x-1/2">
          <div className="mt-2 h-7 w-36 rounded-full bg-black" />
        </div>

        {/* Botones laterales decorativos */}
        <div className="pointer-events-none absolute -left-[12px] top-28 h-16 w-[4px] rounded-full bg-slate-700" />
        <div className="pointer-events-none absolute -left-[12px] top-48 h-10 w-[4px] rounded-full bg-slate-700" />
        <div className="pointer-events-none absolute -right-[12px] top-36 h-20 w-[4px] rounded-full bg-slate-700" />

        {/* Pantalla */}
        <div
          className="
            relative overflow-hidden rounded-[2rem]
            bg-slate-100
            min-h-[780px]
          "
        >
          {children}
        </div>
      </div>
    </div>
  );
}