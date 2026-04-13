import { useEffect, useId, useState, type ReactNode, type SVGProps } from "react";

const editorialFont = "'Georgia', 'Times New Roman', serif";

function cx(...classes: Array<string | false | null | undefined>) {
    return classes.filter(Boolean).join(" ");
}

type InfoFloatingButtonProps = {
    title: string;
    subtitle?: string;
    paragraphs: string[];
    buttonLabel?: string;
    position?: "top-left" | "top-right" | "bottom-left" | "bottom-right";
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

function InfoIcon({
    size = 16,
    className = "",
    ...props
}: { size?: number; className?: string } & SVGProps<SVGSVGElement>) {
    return (
        <Icon
            size={size}
            stroke="currentColor"
            strokeWidth="1.6"
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


function CloseIcon({
    size = 16,
    className = "",
    ...props
}: { size?: number; className?: string } & SVGProps<SVGSVGElement>) {
    return (
        <Icon
            size={size}
            stroke="currentColor"
            strokeWidth="1.7"
            strokeLinecap="round"
            strokeLinejoin="round"
            className={className}
            {...props}
        >
            <path d="M6.5 6.5l11 11" />
            <path d="M17.5 6.5l-11 11" />
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

function SparkInfoIcon({
    size = 18,
    className = "",
    ...props
}: { size?: number; className?: string } & SVGProps<SVGSVGElement>) {
    return (
        <Icon
            size={size}
            stroke="currentColor"
            strokeWidth="1.45"
            strokeLinecap="round"
            strokeLinejoin="round"
            className={className}
            {...props}
        >
            <circle cx="12" cy="12" r="8.3" />
            <path d="M12 10.2v4.9" />
            <circle cx="12" cy="7.35" r="0.78" fill="currentColor" stroke="none" />
            <path d="M17.9 6.6l.85-1.8" opacity="0.72" />
            <path d="M19.5 8.3l1.8-.8" opacity="0.72" />
        </Icon>
    );
}

function InfoModal({
    open,
    onClose,
    title,
    subtitle,
    paragraphs,
    buttonLabel = "Entendido",
}: {
    open: boolean;
    onClose: () => void;
    title: string;
    subtitle?: string;
    paragraphs: string[];
    buttonLabel?: string;
}) {
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

    return (
        <div
            className="fixed inset-0 z-[140] flex items-center justify-center px-5 py-8"
            aria-modal="true"
            role="dialog"
            aria-labelledby="floating-info-modal-title"
        >
            <button
                type="button"
                aria-label="Cerrar modal"
                onClick={onClose}
                className="absolute inset-0 bg-[rgba(17,14,12,0.58)] backdrop-blur-[6px]"
            />

            <div
                className={cx(
                    "relative z-10 w-full max-w-[700px] overflow-hidden rounded-[30px]",
                    "border border-[#d8d0c6] bg-[#f9f7f4]",
                    "shadow-[0_30px_80px_rgba(0,0,0,0.20)]"
                )}
                style={{ fontFamily: editorialFont }}
            >
                <div className="pointer-events-none absolute inset-0 bg-[radial-gradient(circle_at_top_left,rgba(255,255,255,0.7),transparent_34%),radial-gradient(circle_at_bottom_right,rgba(219,211,199,0.26),transparent_30%)]" />
                <div className="absolute inset-0 rounded-[30px] ring-1 ring-inset ring-white/45" />
                <div className="absolute inset-x-0 top-0 h-[1px] bg-white/55" />

                <div className="relative px-7 pb-8 pt-7 sm:px-10 sm:pb-10 sm:pt-9">
                    <div className="flex items-start justify-between gap-5">
                        <div className="min-w-0 flex-1">
                            <div className="mb-5 flex items-center gap-4">
                                <div className="h-px w-8 bg-[#b8afa2]" />
                                <span className="text-[10px] uppercase tracking-[0.24em] text-[#857d74]">
                                    Información
                                </span>
                            </div>

                            <div className="flex items-start gap-4">
                                <div
                                    className={cx(
                                        "mt-1 inline-flex h-12 w-12 shrink-0 items-center justify-center rounded-full",
                                        "border border-[#d4cbbe] bg-[linear-gradient(180deg,#fcfaf7_0%,#f1ece4_100%)]",
                                        "text-[#2a2622] shadow-[0_8px_20px_rgba(0,0,0,0.06)]"
                                    )}
                                >
                                    <SparkInfoIcon size={18} />
                                </div>

                                <div className="min-w-0">
                                    <h2
                                        id="floating-info-modal-title"
                                        className="max-w-[18ch] text-[clamp(1.8rem,3vw,2.55rem)] font-normal leading-[1.08] tracking-[-0.025em] text-[#171717]"
                                    >
                                        {title}
                                    </h2>

                                    {subtitle ? (
                                        <p className="mt-3 max-w-[58ch] text-[14px] leading-[1.9] text-[#615a53]">
                                            {subtitle}
                                        </p>
                                    ) : null}
                                </div>
                            </div>
                        </div>

                        <button
                            type="button"
                            onClick={onClose}
                            aria-label="Cerrar modal"
                            className={cx(
                                "mt-1 inline-flex h-11 w-11 shrink-0 items-center justify-center rounded-full",
                                "border border-[#d8d0c6] bg-[#fbf8f3] text-[#7a736b]",
                                "transition-all duration-300",
                                "hover:-translate-y-[1px] hover:border-[#c3b9ad] hover:bg-[#f4efe8] hover:text-[#2a2622]",
                                "hover:shadow-[0_8px_18px_rgba(0,0,0,0.06)]",
                                "focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[#1a1a1a]/15 focus-visible:ring-offset-2 focus-visible:ring-offset-[#f9f7f4]"
                            )}
                        >
                            <CloseIcon size={14} />
                        </button>
                    </div>

                    <div className="mt-7">
                        <div className="h-px w-full bg-[linear-gradient(90deg,rgba(184,175,162,0.35),rgba(184,175,162,0.85),rgba(184,175,162,0.35))]" />
                    </div>

                    <div className="mt-8 grid gap-4">
                        {paragraphs.map((paragraph, index) => (
                            <div
                                key={index}
                                className={cx(
                                    "group relative overflow-hidden rounded-[22px]",
                                    "border border-[#ddd5ca] bg-[linear-gradient(180deg,#fcfaf6_0%,#f7f3ec_100%)]",
                                    "px-5 py-4 shadow-[0_8px_24px_rgba(0,0,0,0.025)]"
                                )}
                            >
                                <div className="absolute left-0 top-0 h-full w-[3px] bg-[linear-gradient(180deg,#bdb2a3_0%,#d8d0c6_100%)]" />
                                <p className="relative pl-1 text-[14px] leading-[1.95] text-[#4d4741]">
                                    {paragraph}
                                </p>
                            </div>
                        ))}
                    </div>

                    <div className="mt-8 flex items-center justify-end">
                        <button
                            type="button"
                            onClick={onClose}
                            className={cx(
                                "group inline-flex items-center gap-2.5 rounded-full",
                                "border border-[#cfc5b9]",
                                "bg-[linear-gradient(180deg,#f9f7f4_0%,#f0ebe3_100%)] px-5 py-3",
                                "text-[11px] uppercase tracking-[0.14em] text-[#302c28]",
                                "shadow-[0_8px_20px_rgba(0,0,0,0.04)]",
                                "transition-all duration-300",
                                "hover:-translate-y-[1px] hover:border-[#c3b9ad] hover:bg-[#f3eee7] hover:text-[#2a2622]",
                                "hover:shadow-[0_10px_24px_rgba(0,0,0,0.06)]",
                                "active:translate-y-[1px]"
                            )}
                        >
                            <span>{buttonLabel}</span>
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

export default function FloatingInfoButton({
    title,
    subtitle,
    paragraphs,
    buttonLabel = "Entendido",
    position = "bottom-right",
}: InfoFloatingButtonProps) {
    const [open, setOpen] = useState(false);

    const positionClass =
        position === "top-left"
            ? "top-5 left-5"
            : position === "top-right"
                ? "top-5 right-5"
                : position === "bottom-left"
                    ? "bottom-5 left-5"
                    : "bottom-5 right-5";

    return (
        <>
            <div className={cx("fixed z-[120]", positionClass)}>
                <button
                    type="button"
                    onClick={() => setOpen(true)}
                    aria-label="Abrir información de la página"
                    className={cx(
                        "group relative inline-flex h-[58px] w-[58px] items-center justify-center rounded-full",
                        "border border-[#cfc5b9] bg-[#f9f7f4]/95 text-[#302c28]",
                        "backdrop-blur-md shadow-[0_14px_34px_rgba(0,0,0,0.12)]",
                        "transition-all duration-300",
                        "hover:-translate-y-0.5 hover:border-[#bfb4a7] hover:bg-[#f4efe7]",
                        "hover:shadow-[0_18px_40px_rgba(0,0,0,0.16)]",
                        "active:scale-95",
                        "focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[#1a1a1a]/15 focus-visible:ring-offset-2 focus-visible:ring-offset-white"
                    )}
                    style={{ fontFamily: editorialFont }}
                >
                    <span className="pointer-events-none absolute inset-[4px] rounded-full border border-white/45" />
                    <span className="pointer-events-none absolute inset-[9px] rounded-full bg-[radial-gradient(circle_at_30%_30%,rgba(255,255,255,0.8),rgba(255,255,255,0)_55%)]" />
                    <span className="pointer-events-none absolute -top-1 left-1/2 h-6 w-6 -translate-x-1/2 rounded-full bg-white/30 blur-md transition-opacity duration-300 group-hover:opacity-90" />

                    <div
                        className={cx(
                            "relative inline-flex h-[34px] w-[34px] items-center justify-center rounded-full",
                            "bg-[linear-gradient(180deg,#fffdfa_0%,#ece4d8_100%)]",
                            "shadow-[inset_0_1px_0_rgba(255,255,255,0.9),0_5px_12px_rgba(0,0,0,0.08)]"
                        )}
                    >
                        <InfoIcon
                            size={18}
                            className="transition-transform duration-300 group-hover:scale-[1.06] group-hover:rotate-[4deg]"
                        />
                    </div>
                </button>
            </div>

            <InfoModal
                open={open}
                onClose={() => setOpen(false)}
                title={title}
                subtitle={subtitle}
                paragraphs={paragraphs}
                buttonLabel={buttonLabel}
            />
        </>
    );
}