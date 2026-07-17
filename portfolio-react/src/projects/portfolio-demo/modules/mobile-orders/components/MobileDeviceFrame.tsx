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
    <div className={`mx-auto flex w-full justify-center bg-slate-100 sm:px-4 sm:py-8 ${className}`}>
      <div className="relative h-[calc(100svh-4rem)] min-h-[560px] w-full overflow-hidden bg-slate-900 shadow-none sm:h-[min(820px,calc(100svh-8rem))] sm:min-h-[620px] sm:max-w-[430px] sm:rounded-[2.5rem] sm:border-[10px] sm:border-slate-900 sm:shadow-[0_25px_80px_rgba(15,23,42,0.28)]">
        <div className="pointer-events-none absolute left-1/2 top-0 z-30 hidden -translate-x-1/2 sm:block">
          <div className="mt-2 h-7 w-36 rounded-full bg-black" />
        </div>

        <div className="relative h-full bg-slate-100 sm:rounded-[2rem]">
          <div className="h-full overflow-y-auto [scrollbar-width:none] [-ms-overflow-style:none] [&::-webkit-scrollbar]:hidden sm:rounded-[2rem]">
            {children}
          </div>
        </div>
      </div>
    </div>
  );
}
