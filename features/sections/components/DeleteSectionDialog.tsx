import { Loader2, Trash2, X } from "lucide-react";
import type { Section } from "../types/section";

interface DeleteSectionDialogProps {
  section: Section | null;
  isOpen: boolean;
  isDeleting: boolean;
  onClose: () => void;
  onConfirm: () => void;
}

export function DeleteSectionDialog({
  section,
  isOpen,
  isDeleting,
  onClose,
  onConfirm,
}: DeleteSectionDialogProps) {
  if (!isOpen || !section) {
    return null;
  }

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/40 p-4">
      <div className="w-full max-w-md rounded-2xl bg-white shadow-xl">
        <div className="flex items-center justify-between border-b border-slate-200 px-6 py-4">
          <h2 className="text-lg font-semibold text-slate-900">
            Delete Section
          </h2>

          <button
            type="button"
            onClick={onClose}
            disabled={isDeleting}
            className="rounded-lg p-2 text-slate-500 hover:bg-slate-100"
          >
            <X size={20} />
          </button>
        </div>

        <div className="px-6 py-6">
          <div className="mb-4 flex justify-center">
            <div className="rounded-full bg-red-50 p-3 text-red-600">
              <Trash2 size={24} />
            </div>
          </div>

          <p className="text-center text-sm text-slate-600">
            Are you sure you want to delete{" "}
            <span className="font-semibold text-slate-900">{section.name}</span>
            ?
          </p>

          <p className="mt-2 text-center text-xs text-slate-500">
            This action cannot be undone.
          </p>
        </div>

        <div className="flex justify-end gap-3 border-t border-slate-200 px-6 py-4">
          <button
            type="button"
            onClick={onClose}
            disabled={isDeleting}
            className="rounded-lg border border-slate-300 px-4 py-2 text-sm font-medium text-slate-700 hover:bg-slate-50 disabled:cursor-not-allowed disabled:opacity-50"
          >
            Cancel
          </button>

          <button
            type="button"
            onClick={onConfirm}
            disabled={isDeleting}
            className="flex items-center gap-2 rounded-lg bg-red-600 px-4 py-2 text-sm font-medium text-white hover:bg-red-700 disabled:cursor-not-allowed disabled:opacity-50"
          >
            {isDeleting && <Loader2 size={16} className="animate-spin" />}
            Delete
          </button>
        </div>
      </div>
    </div>
  );
}
