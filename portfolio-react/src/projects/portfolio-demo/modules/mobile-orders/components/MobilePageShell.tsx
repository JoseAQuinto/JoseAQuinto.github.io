import { useEffect, useLayoutEffect, useRef, useState } from "react";
import type { ReactNode } from "react";
import MobileDeviceFrame from "./MobileDeviceFrame";

interface MobilePageShellProps {
  header?: ReactNode;
  hasHeader?: boolean;
  title?: string;
  children: ReactNode;
  fixedHeader?: boolean;
  className?: string;
  headerContainerClassName?: string;
  contentClassName?: string;
  useDeviceFrame?: boolean;
}

export default function MobilePageShell({
  header,
  children,
  title = "",
  fixedHeader = true,
  hasHeader = true,
  className = "",
  headerContainerClassName = "",
  contentClassName = "",
  useDeviceFrame = true,
}: MobilePageShellProps) {
  const headerRef = useRef<HTMLDivElement | null>(null);
  const [headerHeight, setHeaderHeight] = useState(0);

  useLayoutEffect(() => {
    if (!fixedHeader || !hasHeader) return;
    const updateHeight = () =>
      setHeaderHeight(headerRef.current?.getBoundingClientRect().height ?? 0);

    updateHeight();
    const observer = new ResizeObserver(updateHeight);
    if (headerRef.current) observer.observe(headerRef.current);
    return () => observer.disconnect();
  }, [fixedHeader, hasHeader]);

  useEffect(() => {
    window.scrollTo(0, 0);
  }, []);

  const pageContent = (
    <div
      className={`relative min-h-full overflow-hidden bg-slate-100 text-slate-900 sm:min-h-[780px] ${className}`}
    >
      {hasHeader ? (
        <div
          ref={headerRef}
          className={`${fixedHeader ? "absolute inset-x-0 top-0 z-20" : "sticky top-0 z-20"} px-2 pt-2 sm:px-3 sm:pt-3`}
        >
          <div className={`overflow-hidden rounded-xl border border-slate-200 bg-white/95 shadow-sm backdrop-blur-sm sm:rounded-2xl ${headerContainerClassName}`}>
            {header}
          </div>
        </div>
      ) : title ? (
        <div className="sticky top-0 z-20 px-3 pt-3">
          <div className="rounded-xl border border-slate-200 bg-white px-4 py-3 font-semibold shadow-sm">
            {title}
          </div>
        </div>
      ) : null}

      <div
        className={`relative z-10 px-2 pb-5 sm:px-3 ${contentClassName}`}
        style={{ paddingTop: fixedHeader && hasHeader ? headerHeight + 10 : 10 }}
      >
        {children}
      </div>
    </div>
  );

  return useDeviceFrame ? <MobileDeviceFrame>{pageContent}</MobileDeviceFrame> : pageContent;
}
