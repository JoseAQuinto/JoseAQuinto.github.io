import { useEffect, useState, type ReactNode, type SVGProps } from "react";
import { useLanguage } from "../../../translations/LanguageContext";

const STORAGE_KEY = "portfolio-demo-intro-modal-seen";
const editorialFont = "'Georgia', 'Times New Roman', serif";

function cx(...classes: Array<string | false | null | undefined>) {
  return classes.filter(Boolean).join(" ");
}

type ModalProps = {
  open: boolean;
  onClose: () => void;
  title: string;
  subtitle?: string;
  paragraphs: string[];
  confirmLabel: string;
};

function Icon({
  size = 16,
  viewBox = "0 0 24 24",
  className = "",
  children,
  ...props
}: SVGProps<SVGSVGElement> & {
  size?: number;
  viewBox?: string;
  className?: string;
  children?: ReactNode;
}) {
  return (
    <svg
      width={size}
      height={size}
      viewBox={viewBox}
      className={className}
      fill="none"
      xmlns="http://www.w3.org/2000/svg"
      {...props}
    >
      {children}
    </svg>
  );
}

function GridIcon({
  size = 14,
  className = "",
  ...props
}: { size?: number; className?: string } & SVGProps<SVGSVGElement>) {
  return (
    <Icon
      size={size}
      stroke="currentColor"
      strokeWidth="1.4"
      strokeLinecap="round"
      strokeLinejoin="round"
      className={className}
      {...props}
    >
      <rect x="4" y="4" width="6" height="6" rx="1.2" />
      <rect x="14" y="4" width="6" height="6" rx="1.2" />
      <rect x="4" y="14" width="6" height="6" rx="1.2" />
      <rect x="14" y="14" width="6" height="6" rx="1.2" />
    </Icon>
  );
}

function InfoIcon({
  size = 14,
  className = "",
  ...props
}: { size?: number; className?: string } & SVGProps<SVGSVGElement>) {
  return (
    <Icon
      size={size}
      stroke="currentColor"
      strokeWidth="1.5"
      strokeLinecap="round"
      strokeLinejoin="round"
      className={className}
      {...props}
    >
      <circle cx="12" cy="12" r="8.25" />
      <path d="M12 10.25v5" />
      <circle cx="12" cy="7.25" r="0.8" fill="currentColor" stroke="none" />
    </Icon>
  );
}

function ArrowRightIcon({
  size = 12,
  className = "",
  ...props
}: { size?: number; className?: string } & SVGProps<SVGSVGElement>) {
  return (
    <Icon
      size={size}
      stroke="currentColor"
      strokeWidth="1.5"
      strokeLinecap="round"
      strokeLinejoin="round"
      className={className}
      {...props}
    >
      <path d="M4 12h12" />
      <path d="M11 5l7 7-7 7" />
    </Icon>
  );
}

function Modal({
  open,
  onClose,
  title,
  subtitle,
  paragraphs,
  confirmLabel,
}: ModalProps) {
  useEffect(() => {
    if (!open) return;

    const onKeyDown = (e: KeyboardEvent) => {
      if (e.key === "Escape") onClose();
    };

    document.addEventListener("keydown", onKeyDown);
    document.body.style.overflow = "hidden";

    return () => {
      document.removeEventListener("keydown", onKeyDown);
      document.body.style.overflow = "";
    };
  }, [open, onClose]);

  if (!open) return null;

  const icons = [<GridIcon />, <InfoIcon />];

  return (
    <div
      className="fixed inset-0 z-[120] flex items-center justify-center px-5 py-8"
      aria-modal="true"
      role="dialog"
      aria-labelledby="portfolio-demo-intro-title"
    >
      {/* Backdrop */}
      <button
        type="button"
        aria-label="Close modal"
        onClick={onClose}
        className="absolute inset-0 bg-[rgba(17,14,12,0.56)] backdrop-blur-[4px]"
      />

      {/* Panel */}
      <div
        className={cx(
          "relative z-10 w-full max-w-[640px] overflow-hidden rounded-[28px]",
          "border border-[#ddd5ca] bg-[#f6f2eb]",
          "shadow-[0_28px_70px_rgba(0,0,0,0.18)]"
        )}
        style={{ fontFamily: editorialFont }}
      >
        <div className="absolute inset-0 rounded-[28px] ring-1 ring-inset ring-white/40" />

        <div className="relative px-7 pb-8 pt-7 sm:px-10 sm:pb-10 sm:pt-9">
          {/* Header */}
          <div className="flex items-start justify-between gap-5">
            <div className="min-w-0">
              <div className="mb-5 flex items-center gap-4">
                <div className="h-px w-8 bg-[#b8afa2]" />
                <span className="text-[10px] uppercase tracking-[0.22em] text-[#857d74]">
                  Portfolio Demo
                </span>
              </div>

              <h2
                id="portfolio-demo-intro-title"
                className="max-w-[18ch] text-[clamp(1.7rem,3vw,2.35rem)] font-normal leading-[1.12] tracking-[-0.02em] text-[#171717]"
              >
                {title}
              </h2>

              {subtitle ? (
                <p className="mt-3 max-w-[54ch] text-[14px] leading-[1.9] text-[#615a53]">
                  {subtitle}
                </p>
              ) : null}
            </div>

            {/* SIMPLE X */}
            <button
              type="button"
              onClick={onClose}
              aria-label="Close modal"
              className={cx(
                "mt-1 shrink-0 text-[16px] leading-none text-[#8c8378]",
                "transition-colors duration-200 hover:text-[#1a1a1a]",
                "focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[#1a1a1a]/15 focus-visible:ring-offset-2 focus-visible:ring-offset-[#f6f2eb]"
              )}
              style={{ fontFamily: editorialFont }}
            >
              ×
            </button>
          </div>

          <div className="mt-7 h-px w-full bg-[#ddd5ca]" />

          {/* Body */}
          <div className="mt-8 grid gap-4">
            {paragraphs.map((paragraph, index) => (
              <div
                key={index}
                className={cx(
                  "grid gap-4 rounded-[20px] border px-4 py-4 sm:grid-cols-[42px_minmax(0,1fr)] sm:px-5",
                  "border-[#ddd5ca] bg-[#fcfaf6]"
                )}
              >
                <div className="flex items-start">
                  <div className="inline-flex h-10 w-10 items-center justify-center rounded-full border border-[#d8cfc3] bg-[#f3eee6] text-[#6a635b]">
                    {icons[index % icons.length]}
                  </div>
                </div>

                <p className="text-[14px] leading-[1.95] text-[#4d4741]">
                  {paragraph}
                </p>
              </div>
            ))}
          </div>

          {/* Footer */}
          <div className="mt-8 flex items-center justify-end">
            <button
              type="button"
              onClick={onClose}
              className={cx(
                "group inline-flex items-center gap-2.5 rounded-full",
                "border border-[#cfc5b9] bg-[#ede6db] px-5 py-3",
                "text-[11px] uppercase tracking-[0.14em] text-[#302c28]",
                "transition-all duration-300 hover:border-[#1a1a1a] hover:bg-[#1a1a1a] hover:text-white active:translate-y-[1px]"
              )}
              style={{ fontFamily: editorialFont }}
            >
              <span>{confirmLabel}</span>
              <ArrowRightIcon
                size={11}
                className="transition-transform duration-300 group-hover:translate-x-0.5"
              />
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}

export default function PortfolioDemoIntroModal() {
  const { t } = useLanguage();
  const modalT = t.portfolioDemo.introModal;

  const [open, setOpen] = useState<boolean>(() => {
    if (typeof window === "undefined") return false;
    return true;
  });

  const handleClose = () => {
    window.localStorage.setItem(STORAGE_KEY, "true");
    setOpen(false);
  };

  return (
    <Modal
      open={open}
      onClose={handleClose}
      title={modalT.title}
      paragraphs={[modalT.description1, modalT.description2]}
      confirmLabel={modalT.confirm}
    />
  );
}