import { AlertTriangle, Loader2, X } from "lucide-react";

interface DeleteGradeDialogProps {
  isOpen: boolean;
  gradeName?: string;
  isDeleting: boolean;
  onClose: () => void;
  onConfirm: () => void;
}

export function DeleteGradeDialog({
  isOpen,
  gradeName,
  isDeleting,
  onClose,
  onConfirm,
}: DeleteGradeDialogProps) {
  if (!isOpen) {
    return null;
  }

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/50 p-4">
      <div className="w-full max-w-md rounded-xl bg-white shadow-xl">
        <div className="flex items-center justify-between border-b border-slate-200 px-6 py-4">
          <h2 className="text-lg font-semibold text-slate-900">Delete Grade</h2>

          <button
            type="button"
            onClick={onClose}
            disabled={isDeleting}
            className="rounded-lg p-2 text-slate-500 transition hover:bg-slate-100 disabled:cursor-not-allowed disabled:opacity-50"
          >
            <X className="h-5 w-5" />
          </button>
        </div>

        <div className="p-6">
          <div className="flex gap-4">
            <div className="flex h-10 w-10 shrink-0 items-center justify-center rounded-full bg-red-100">
              <AlertTriangle className="h-5 w-5 text-red-600" />
            </div>

            <div>
              <h3 className="font-medium text-slate-900">Are you sure?</h3>

              <p className="mt-1 text-sm leading-6 text-slate-600">
                You are about to delete{" "}
                <span className="font-medium text-slate-900">
                  {gradeName || "this grade"}
                </span>
                . This action cannot be undone.
              </p>
            </div>
          </div>
        </div>

        <div className="flex justify-end gap-3 border-t border-slate-200 px-6 py-4">
          <button
            type="button"
            onClick={onClose}
            disabled={isDeleting}
            className="rounded-lg border border-slate-300 px-4 py-2.5 text-sm font-medium text-slate-700 transition hover:bg-slate-50 disabled:cursor-not-allowed disabled:opacity-50"
          >
            Cancel
          </button>

          <button
            type="button"
            onClick={onConfirm}
            disabled={isDeleting}
            className="inline-flex items-center gap-2 rounded-lg bg-red-600 px-4 py-2.5 text-sm font-medium text-white transition hover:bg-red-700 disabled:cursor-not-allowed disabled:opacity-70"
          >
            {isDeleting && <Loader2 className="h-4 w-4 animate-spin" />}
            Delete
          </button>
        </div>
      </div>
    </div>
  );
}
