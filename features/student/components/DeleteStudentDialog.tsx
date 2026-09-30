import { AlertTriangle, Loader2, X } from "lucide-react";

import { useDeleteStudent } from "../hooks/useDeleteStudent";
import { toastService } from "~/services/toastService";

interface DeleteStudentDialogProps {
  isOpen: boolean;
  studentId?: number;
  studentName?: string;
  onClose: () => void;
  onDeleted: () => void;
}

export function DeleteStudentDialog({
  isOpen,
  studentId,
  studentName,
  onClose,
  onDeleted,
}: DeleteStudentDialogProps) {
  const deleteStudent = useDeleteStudent();

  if (!isOpen) {
    return null;
  }

  async function handleConfirm() {
    if (!studentId) {
      return;
    }

    try {
      await deleteStudent.mutateAsync(studentId);

      toastService.success("Student deleted successfully.");

      onDeleted();
    } catch (error) {
      toastService.error(error);
    }
  }

  function handleClose() {
    if (deleteStudent.isPending) {
      return;
    }

    onClose();
  }

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/50 p-4">
      <div className="w-full max-w-md rounded-xl bg-white shadow-xl">
        {/* Header */}
        <div className="flex items-center justify-between border-b border-slate-200 px-6 py-4">
          <h2 className="text-lg font-semibold text-slate-900">
            Delete Student
          </h2>

          <button
            type="button"
            onClick={handleClose}
            disabled={deleteStudent.isPending}
            className="rounded-lg p-2 text-slate-500 transition hover:bg-slate-100 disabled:cursor-not-allowed disabled:opacity-50"
          >
            <X className="h-5 w-5" />
          </button>
        </div>

        {/* Content */}
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
                  {studentName || "this student"}
                </span>
                . This action cannot be undone.
              </p>
            </div>
          </div>
        </div>

        {/* Footer */}
        <div className="flex justify-end gap-3 border-t border-slate-200 px-6 py-4">
          <button
            type="button"
            onClick={handleClose}
            disabled={deleteStudent.isPending}
            className="rounded-lg border border-slate-300 px-4 py-2.5 text-sm font-medium text-slate-700 transition hover:bg-slate-50 disabled:cursor-not-allowed disabled:opacity-50"
          >
            Cancel
          </button>

          <button
            type="button"
            onClick={handleConfirm}
            disabled={deleteStudent.isPending || !studentId}
            className="inline-flex items-center gap-2 rounded-lg bg-red-600 px-4 py-2.5 text-sm font-medium text-white transition hover:bg-red-700 disabled:cursor-not-allowed disabled:opacity-70"
          >
            {deleteStudent.isPending && (
              <Loader2 className="h-4 w-4 animate-spin" />
            )}
            Delete
          </button>
        </div>
      </div>
    </div>
  );
}
