import type { ReactNode } from "react";
import { XMarkIcon } from "@heroicons/react/24/outline";

interface MobileBottomSheetProps {
  open: boolean;
  onClose?: () => void;
  title?: string;
  submitLabel?: string;
  children: ReactNode;
  onFinish?: () => void;
  hideCancel?: boolean;
  disableSubmit?: boolean;
}

export default function MobileBottomSheet({
  open,
  onClose,
  title = "New item",
  children,
  onFinish,
  submitLabel = "Save",
  hideCancel = false,
  disableSubmit = false,
}: MobileBottomSheetProps) {
  return (
    <div
      className={`absolute inset-0 z-[70] transition-opacity duration-200 ${
        open ? "pointer-events-auto opacity-100" : "pointer-events-none opacity-0"
      }`}
    >
      <div
        className="absolute inset-0 bg-slate-900/45 backdrop-blur-[2px]"
        onClick={onClose}
      />

      <div
        className={`absolute inset-x-0 bottom-0 z-[71] transition-transform duration-300 ${
          open ? "translate-y-0" : "translate-y-full"
        }`}
      >
        <div className="rounded-t-[1.75rem] border-t border-slate-200 bg-white shadow-2xl">
          <div className="mx-auto mt-2 h-1.5 w-12 rounded-full bg-slate-300" />

          <div className="flex items-center justify-between px-4 pb-2 pt-4">
            <h2 className="text-base font-semibold text-slate-900">{title}</h2>

            {onClose && (
              <button
                onClick={onClose}
                className="rounded-full p-2 text-slate-500 transition hover:bg-slate-100 hover:text-slate-700"
                aria-label="Close"
              >
                <XMarkIcon className="h-5 w-5" />
              </button>
            )}
          </div>

          <div className="max-h-[60vh] overflow-y-auto px-4 pb-4">{children}</div>

          <div className="border-t border-slate-100 p-4">
            <div className="flex items-center gap-2">
              {!hideCancel && (
                <button
                  className="flex-1 rounded-xl border border-slate-300 bg-white px-3 py-2.5 text-sm font-medium text-slate-700 transition hover:bg-slate-50"
                  onClick={onClose}
                >
                  Cancel
                </button>
              )}

              <button
                className="flex-1 rounded-xl bg-slate-900 px-3 py-2.5 text-sm font-semibold text-white transition hover:bg-slate-800 disabled:cursor-not-allowed disabled:opacity-50"
                onClick={onFinish}
                disabled={disableSubmit}
              >
                {submitLabel}
              </button>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}