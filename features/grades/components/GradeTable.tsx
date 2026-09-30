import { Eye, Pencil, Trash2 } from "lucide-react";

import type { Grade } from "../types/grade";

interface GradeTableProps {
  grades: Grade[];
  onView: (grade: Grade) => void;
  onEdit: (grade: Grade) => void;
  onDelete: (grade: Grade) => void;
}

export function GradeTable({
  grades,
  onView,
  onEdit,
  onDelete,
}: GradeTableProps) {
  if (grades.length === 0) {
    return (
      <div className="rounded-xl border border-slate-200 bg-white px-6 py-12 text-center">
        <p className="text-sm font-medium text-slate-700">No grades found.</p>

        <p className="mt-1 text-sm text-slate-500">
          Try changing your search or create a new grade.
        </p>
      </div>
    );
  }

  return (
    <div className="overflow-hidden rounded-xl border border-slate-200 bg-white">
      <div className="overflow-x-auto">
        <table className="min-w-full divide-y divide-slate-200">
          <thead className="bg-slate-50">
            <tr>
              <th className="px-6 py-3 text-left text-xs font-semibold uppercase tracking-wide text-slate-500">
                Name
              </th>

              <th className="px-6 py-3 text-left text-xs font-semibold uppercase tracking-wide text-slate-500">
                Description
              </th>

              <th className="px-6 py-3 text-right text-xs font-semibold uppercase tracking-wide text-slate-500">
                Actions
              </th>
            </tr>
          </thead>

          <tbody className="divide-y divide-slate-200">
            {grades.map((grade) => (
              <tr key={grade.id} className="transition hover:bg-slate-50">
                <td className="whitespace-nowrap px-6 py-4 text-sm font-medium text-slate-900">
                  {grade.name}
                </td>

                <td className="max-w-md px-6 py-4 text-sm text-slate-600">
                  <span className="line-clamp-2">
                    {grade.description || "—"}
                  </span>
                </td>

                <td className="whitespace-nowrap px-6 py-4">
                  <div className="flex justify-end gap-1">
                    <button
                      type="button"
                      onClick={() => onView(grade)}
                      title="View"
                      className="rounded-lg p-2 text-slate-500 transition hover:bg-slate-100 hover:text-slate-700"
                    >
                      <Eye className="h-4 w-4" />
                    </button>

                    <button
                      type="button"
                      onClick={() => onEdit(grade)}
                      title="Edit"
                      className="rounded-lg p-2 text-slate-500 transition hover:bg-rose-50 hover:text-rose-900"
                    >
                      <Pencil className="h-4 w-4" />
                    </button>

                    <button
                      type="button"
                      onClick={() => onDelete(grade)}
                      title="Delete"
                      className="rounded-lg p-2 text-slate-500 transition hover:bg-red-50 hover:text-red-600"
                    >
                      <Trash2 className="h-4 w-4" />
                    </button>
                  </div>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
}
