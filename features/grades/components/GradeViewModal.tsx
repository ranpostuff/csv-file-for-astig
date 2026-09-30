import { X, Loader2 } from "lucide-react";
import type { GradeResponse } from "../types/grade";

interface GradeViewModalProps {
  isOpen: boolean;
  grade?: GradeResponse | null;
  isLoading: boolean;
  onClose: () => void;
}

export function GradeViewModal({
  isOpen,
  grade,
  isLoading,
  onClose,
}: GradeViewModalProps) {
  if (!isOpen) {
    return null;
  }

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/50 p-4">
      <div className="w-full max-w-lg rounded-xl bg-white shadow-xl">
        {/* Header */}
        <div className="flex items-center justify-between border-b border-slate-200 px-6 py-4">
          <div>
            <h2 className="text-lg font-semibold text-slate-900">
              Grade Details
            </h2>

            <p className="mt-1 text-sm text-slate-500">
              View grade information.
            </p>
          </div>

          <button
            type="button"
            onClick={onClose}
            className="rounded-lg p-2 text-slate-500 transition hover:bg-slate-100 hover:text-slate-700"
          >
            <X className="h-5 w-5" />
          </button>
        </div>

        {/* Content */}
        <div className="p-6">
          {isLoading ? (
            <div className="flex items-center justify-center py-12">
              <Loader2 className="h-6 w-6 animate-spin text-rose-900" />
            </div>
          ) : !grade ? (
            <div className="py-10 text-center text-sm text-slate-500">
              Grade information could not be loaded.
            </div>
          ) : (
            <div className="space-y-5">
              <div>
                <p className="text-xs font-medium uppercase tracking-wide text-slate-500">
                  Name
                </p>

                <p className="mt-1 text-sm font-medium text-slate-900">
                  {grade.name}
                </p>
              </div>

              <div>
                <p className="text-xs font-medium uppercase tracking-wide text-slate-500">
                  Description
                </p>

                <p className="mt-1 text-sm text-slate-700">
                  {grade.description || "No description provided."}
                </p>
              </div>

              <div>
                <p className="text-xs font-medium uppercase tracking-wide text-slate-500">
                  Created By
                </p>

                <p className="mt-1 text-sm text-slate-700">
                  {grade.createdBy || "N/A"}
                </p>
              </div>

              <div>
                <p className="text-xs font-medium uppercase tracking-wide text-slate-500">
                  Created At
                </p>

                <p className="mt-1 text-sm text-slate-700">
                  {new Date(grade.createdAt).toLocaleString()}
                </p>
              </div>
            </div>
          )}
        </div>

        {/* Footer */}
        <div className="flex justify-end border-t border-slate-200 px-6 py-4">
          <button
            type="button"
            onClick={onClose}
            className="rounded-lg bg-rose-950 px-4 py-2.5 text-sm font-medium text-white transition hover:bg-rose-900"
          >
            Close
          </button>
        </div>
      </div>
    </div>
  );
}
