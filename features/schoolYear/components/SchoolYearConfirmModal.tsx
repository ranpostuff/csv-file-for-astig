import { AlertTriangle, CheckCircle, Trash2, X } from "lucide-react";

interface SchoolYearConfirmModalProps {
  isOpen: boolean;
  action: "activate" | "delete";
  schoolYearName: string;
  isPending?: boolean;
  onConfirm: () => void;
  onClose: () => void;
}

export default function SchoolYearConfirmModal({
  isOpen,
  action,
  schoolYearName,
  isPending = false,
  onConfirm,
  onClose,
}: SchoolYearConfirmModalProps) {
  if (!isOpen) {
    return null;
  }

  const isDelete = action === "delete";

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/40 p-4">
      <div className="w-full max-w-md rounded-2xl bg-white shadow-xl">
        {/* Header */}
        <div className="flex items-start justify-between p-6">
          <div className="flex items-center gap-3">
            <div
              className={`rounded-xl p-2 ${
                isDelete ? "bg-red-50 text-red-600" : "bg-rose-50 text-rose-700"
              }`}
            >
              {isDelete ? (
                <Trash2 className="h-5 w-5" />
              ) : (
                <CheckCircle className="h-5 w-5" />
              )}
            </div>

            <h2 className="text-xl font-semibold text-slate-900">
              {isDelete ? "Delete School Year" : "Activate School Year"}
            </h2>
          </div>

          <button
            type="button"
            onClick={onClose}
            disabled={isPending}
            className="rounded-lg p-2 text-slate-400 transition-colors hover:bg-slate-100 hover:text-slate-600 disabled:cursor-not-allowed disabled:opacity-50"
          >
            <X className="h-5 w-5" />
          </button>
        </div>

        {/* Content */}
        <div className="px-6 pb-6">
          {isDelete ? (
            <>
              <p className="text-sm leading-6 text-slate-600">
                Are you sure you want to delete{" "}
                <span className="font-semibold text-slate-800">
                  {schoolYearName}
                </span>
                ?
              </p>

              <div className="mt-4 flex gap-3 rounded-xl bg-red-50 p-4">
                <AlertTriangle className="mt-0.5 h-5 w-5 shrink-0 text-red-600" />

                <p className="text-sm leading-5 text-red-700">
                  This action cannot be undone. Only inactive school years can
                  be deleted.
                </p>
              </div>
            </>
          ) : (
            <>
              <p className="text-sm leading-6 text-slate-600">
                Are you sure you want to activate{" "}
                <span className="font-semibold text-slate-800">
                  {schoolYearName}
                </span>
                ?
              </p>

              <div className="mt-4 flex gap-3 rounded-xl bg-rose-50 p-4">
                <CheckCircle className="mt-0.5 h-5 w-5 shrink-0 text-rose-700" />

                <p className="text-sm leading-5 text-rose-700">
                  Activating this school year will make it the current active
                  school year.
                </p>
              </div>
            </>
          )}
        </div>

        {/* Actions */}
        <div className="flex justify-end gap-3 border-t border-slate-100 p-6">
          <button
            type="button"
            onClick={onClose}
            disabled={isPending}
            className="rounded-lg border border-slate-200 px-4 py-2.5 text-sm font-medium text-slate-600 transition-colors hover:bg-slate-50 disabled:cursor-not-allowed disabled:opacity-50"
          >
            Cancel
          </button>

          <button
            type="button"
            onClick={onConfirm}
            disabled={isPending}
            className={`rounded-lg px-4 py-2.5 text-sm font-medium text-white transition-colors disabled:cursor-not-allowed disabled:opacity-50 ${
              isDelete
                ? "bg-red-600 hover:bg-red-700"
                : "bg-rose-900 hover:bg-rose-800"
            }`}
          >
            {isPending
              ? isDelete
                ? "Deleting..."
                : "Activating..."
              : isDelete
                ? "Delete"
                : "Activate"}
          </button>
        </div>
      </div>
    </div>
  );
}
