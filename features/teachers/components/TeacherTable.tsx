import { Eye, Pencil, Trash2 } from "lucide-react";
import type { Teacher } from "../types/teacher";

type TeacherTableProps = {
  teachers: Teacher[];
  isLoading?: boolean;
  onView: (teacher: Teacher) => void;
  onEdit: (teacher: Teacher) => void;
  onDelete: (teacher: Teacher) => void;
};

export function TeacherTable({
  teachers,
  isLoading = false,
  onEdit,
  onDelete,
  onView,
}: TeacherTableProps) {
  if (isLoading) {
    return (
      <div className="rounded-xl border border-slate-200 bg-white p-8 text-center text-sm text-slate-500 shadow-sm">
        Loading teachers...
      </div>
    );
  }

  if (teachers.length === 0) {
    return (
      <div className="rounded-xl border border-slate-200 bg-white p-12 text-center shadow-sm">
        <p className="font-medium text-slate-700">No teachers found.</p>
        <p className="mt-1 text-sm text-slate-500">
          Try changing your search filters.
        </p>
      </div>
    );
  }

  return (
    <div className="overflow-hidden rounded-xl border border-slate-200 bg-white shadow-sm">
      <div className="overflow-x-auto">
        <table className="w-full min-w-225 text-left text-sm">
          <thead className="border-b border-slate-200 bg-slate-50">
            <tr>
              <th className="px-6 py-3 font-semibold text-slate-700">Name</th>

              <th className="px-6 py-3 font-semibold text-slate-700">Email</th>

              <th className="px-6 py-3 font-semibold text-slate-700">
                Address
              </th>

              <th className="px-6 py-3 font-semibold text-slate-700">
                Date of Birth
              </th>

              <th className="px-6 py-3 text-right font-semibold text-slate-700">
                Actions
              </th>
            </tr>
          </thead>

          <tbody className="divide-y divide-slate-100">
            {teachers.map((teacher) => (
              <tr
                key={teacher.id}
                className="transition-colors hover:bg-rose-50/40"
              >
                <td className="px-6 py-4">
                  <div className="font-medium text-slate-900">
                    {teacher.firstName}{" "}
                    {teacher.middleName ? `${teacher.middleName} ` : ""}
                    {teacher.lastName}
                    {teacher.extension ? ` ${teacher.extension}` : ""}
                  </div>
                </td>

                <td className="px-6 py-4 text-slate-600">{teacher.email}</td>

                <td className="max-w-xs truncate px-6 py-4 text-slate-600">
                  {teacher.address}
                </td>

                <td className="px-6 py-4 text-slate-600">
                  {new Date(teacher.dateOfBirth).toLocaleDateString()}
                </td>

                <td className="px-6 py-4">
                  <div className="flex justify-end gap-2">
                    <button
                      type="button"
                      onClick={() => onView(teacher)}
                      title="View teacher"
                      className="
                        inline-flex items-center gap-1.5
                        rounded-lg
                        px-3 py-2
                        text-sm font-medium
                        text-rose-700
                        transition-colors
                       hover:bg-rose-100
                      "
                    >
                      <Eye className="h-4 w-4" />
                      View
                    </button>
                    <button
                      type="button"
                      onClick={() => onEdit(teacher)}
                      className="
                        inline-flex items-center gap-1.5
                        rounded-lg
                        px-3 py-2
                        text-sm font-medium
                        text-rose-700
                        transition-colors
                        hover:bg-rose-100
                      "
                    >
                      <Pencil className="h-4 w-4" />
                      Edit
                    </button>

                    <button
                      type="button"
                      onClick={() => onDelete(teacher)}
                      className="
                        inline-flex items-center gap-1.5
                        rounded-lg
                        px-3 py-2
                        text-sm font-medium
                        text-red-600
                        transition-colors
                        hover:bg-red-50
                      "
                    >
                      <Trash2 className="h-4 w-4" />
                      Delete
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
