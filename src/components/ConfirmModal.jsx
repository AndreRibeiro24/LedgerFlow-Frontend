import { useEffect } from "react";
import { FiAlertTriangle, FiX } from "react-icons/fi";

export default function ConfirmModal({
  isOpen,
  title,
  message,
  confirmLabel = "Delete",
  cancelLabel = "Cancel",
  loading = false,
  onConfirm,
  onCancel,
}) {
  useEffect(() => {
    if (!isOpen) return;

    const handleKeyDown = (event) => {
      if (event.key === "Escape" && !loading) {
        onCancel();
      }
    };

    document.addEventListener("keydown", handleKeyDown);

    return () => {
      document.removeEventListener("keydown", handleKeyDown);
    };
  }, [isOpen, loading, onCancel]);

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 z-[60] flex items-center justify-center p-4">
      {/* Backdrop */}
      <button
        type="button"
        aria-label="Close confirmation dialog"
        onClick={() => {
          if (!loading) onCancel();
        }}
        className="absolute inset-0 bg-[#0F172A]/45 backdrop-blur-[2px] dark:bg-black/65"
      />

      {/* Modal */}
      <div className="relative w-full max-w-md overflow-hidden rounded-xl border border-[#E2E8F0] bg-white shadow-2xl transition-colors dark:border-[#243044] dark:bg-[#111827]">
        {/* Header */}
        <div className="flex items-start justify-between gap-4 px-6 pt-6">
          <div className="flex h-11 w-11 shrink-0 items-center justify-center rounded-full bg-[#FEF2F2] text-[#DC2626] dark:bg-[#450A0A]/50 dark:text-[#F87171]">
            <FiAlertTriangle size={20} />
          </div>

          <button
            type="button"
            onClick={onCancel}
            disabled={loading}
            aria-label="Close"
            className="flex h-9 w-9 items-center justify-center rounded-lg text-[#94A3B8] transition hover:bg-[#F1F5F9] hover:text-[#0F172A] disabled:cursor-not-allowed dark:text-[#64748B] dark:hover:bg-[#172033] dark:hover:text-[#F8FAFC]"
          >
            <FiX size={18} />
          </button>
        </div>

        {/* Content */}
        <div className="px-6 pb-6 pt-4">
          <h2 className="text-lg font-bold text-[#0F172A] dark:text-[#F8FAFC]">
            {title}
          </h2>

          <p className="mt-2 text-sm leading-6 text-[#64748B] dark:text-[#94A3B8]">
            {message}
          </p>

          <p className="mt-4 text-xs font-medium text-[#DC2626] dark:text-[#F87171]">
            This action cannot be undone.
          </p>
        </div>

        {/* Actions */}
        <div className="flex flex-col-reverse gap-3 border-t border-[#E2E8F0] bg-[#F8FAFC] px-6 py-4 dark:border-[#243044] dark:bg-[#0F172A] sm:flex-row sm:justify-end">
          <button
            type="button"
            onClick={onCancel}
            disabled={loading}
            className="rounded-lg border border-[#CBD5E1] bg-white px-4 py-2.5 text-sm font-semibold text-[#475569] transition hover:bg-[#F8FAFC] disabled:cursor-not-allowed disabled:opacity-50 dark:border-[#334155] dark:bg-[#111827] dark:text-[#CBD5E1] dark:hover:bg-[#172033]"
          >
            {cancelLabel}
          </button>

          <button
            type="button"
            onClick={onConfirm}
            disabled={loading}
            className="rounded-lg bg-[#DC2626] px-4 py-2.5 text-sm font-semibold text-white transition hover:bg-[#B91C1C] disabled:cursor-not-allowed disabled:bg-[#FCA5A5] dark:bg-[#DC2626] dark:hover:bg-[#B91C1C] dark:disabled:bg-[#7F1D1D]"
          >
            {loading ? "Deleting..." : confirmLabel}
          </button>
        </div>
      </div>
    </div>
  );
}