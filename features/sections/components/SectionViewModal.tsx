import { Loader2, X } from "lucide-react";
import { useSection } from "../hooks/useSection";

interface SectionViewModalProps {
  sectionId: number | null;
  isOpen: boolean;
  onClose: () => void;
}

export function SectionViewModal({
  sectionId,
  isOpen,
  onClose,
}: SectionViewModalProps) {
  const { data: section, isLoading, isError } = useSection(sectionId);

  if (!isOpen) {
    return null;
  }

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/40 p-4">
      <div className="w-full max-w-lg rounded-2xl bg-white shadow-xl">
        <div className="flex items-center justify-between border-b border-slate-200 px-6 py-4">
          <h2 className="text-lg font-semibold text-slate-900">
            Section Details
          </h2>

          <button
            type="button"
            onClick={onClose}
            className="rounded-lg p-2 text-slate-500 hover:bg-slate-100"
          >
            <X size={20} />
          </button>
        </div>

        <div className="p-6">
          {isLoading && (
            <div className="flex justify-center py-8">
              <Loader2 size={24} className="animate-spin text-rose-800" />
            </div>
          )}

          {isError && (
            <p className="py-8 text-center text-sm text-red-600">
              Failed to load section details.
            </p>
          )}

          {section && (
            <div className="space-y-5">
              <div>
                <p className="text-xs font-medium uppercase text-slate-500">
                  Section
                </p>
                <p className="mt-1 text-sm font-medium text-slate-900">
                  {section.name}
                </p>
              </div>

              <div>
                <p className="text-xs font-medium uppercase text-slate-500">
                  Grade
                </p>
                <p className="mt-1 text-sm font-medium text-slate-900">
                  {section.gradeName}
                </p>
              </div>

              <div>
                <p className="text-xs font-medium uppercase text-slate-500">
                  Assigned Teacher
                </p>
                <p className="mt-1 text-sm font-medium text-slate-900">
                  {section.assignedTeacherName}
                </p>
              </div>
            </div>
          )}
        </div>

        <div className="flex justify-end border-t border-slate-200 px-6 py-4">
          <button
            type="button"
            onClick={onClose}
            className="rounded-lg bg-rose-950 px-4 py-2 text-sm font-medium text-white hover:bg-rose-900"
          >
            Close
          </button>
        </div>
      </div>
    </div>
  );
}
