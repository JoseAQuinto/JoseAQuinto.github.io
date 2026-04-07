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

    const updateHeight = () => {
      setHeaderHeight(headerRef.current?.getBoundingClientRect().height ?? 0);
    };

    updateHeight();

    const resizeObserver = new ResizeObserver(updateHeight);
    if (headerRef.current) resizeObserver.observe(headerRef.current);

    window.addEventListener("resize", updateHeight);

    return () => {
      resizeObserver.disconnect();
      window.removeEventListener("resize", updateHeight);
    };
  }, [fixedHeader, hasHeader]);

  useEffect(() => {
    window.scrollTo(0, 0);
  }, []);

  const pageContent = (
    <div
      className={[
        "relative min-h-[780px] overflow-hidden bg-[linear-gradient(180deg,#f8fafc_0%,#eef2ff_100%)] text-slate-900",
        className,
      ].join(" ")}
    >
      {hasHeader ? (
        <div
          ref={headerRef}
          className={`${
            fixedHeader ? "absolute inset-x-0 top-0 z-20" : "sticky top-0 z-20"
          } px-3 pt-3`}
        >
          <div
            className={[
              "overflow-hidden rounded-2xl border border-slate-200 bg-white/95 shadow-sm backdrop-blur-sm",
              headerContainerClassName,
            ].join(" ")}
          >
            {header}
          </div>
        </div>
      ) : !!title ? (
        <div className="sticky top-0 z-20 px-3 pt-3">
          <div className="rounded-2xl border border-slate-200 bg-white px-4 py-3 font-semibold text-slate-900 shadow-sm">
            {title}
          </div>
        </div>
      ) : null}

      <div
        className={["relative z-10 px-3 pb-5", contentClassName].join(" ")}
        style={{
          paddingTop: fixedHeader && hasHeader ? headerHeight + 12 : 12,
        }}
      >
        {children}
      </div>
    </div>
  );

  if (!useDeviceFrame) {
    return pageContent;
  }

  return <MobileDeviceFrame>{pageContent}</MobileDeviceFrame>;
}