import { Eye, Pencil, Trash2 } from "lucide-react";

import type { Student } from "../types/student";

interface StudentTableProps {
  students: Student[];
  onView: (student: Student) => void;
  onEdit: (student: Student) => void;
  onDelete: (student: Student) => void;
}

function getStudentName(student: Student) {
  return [
    student.lastName + ",",
    student.firstName,
    student.middleName,
    student.extension,
  ]
    .filter(Boolean)
    .join(" ");
}

export function StudentTable({
  students,
  onView,
  onEdit,
  onDelete,
}: StudentTableProps) {
  if (students.length === 0) {
    return (
      <div className="rounded-xl border border-slate-200 bg-white px-6 py-12 text-center">
        <p className="text-sm font-medium text-slate-700">No students found.</p>

        <p className="mt-1 text-sm text-slate-500">
          Try changing your search or create a new student.
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
                Student
              </th>

              <th className="px-6 py-3 text-left text-xs font-semibold uppercase tracking-wide text-slate-500">
                Grade
              </th>

              <th className="px-6 py-3 text-left text-xs font-semibold uppercase tracking-wide text-slate-500">
                Section
              </th>

              <th className="px-6 py-3 text-right text-xs font-semibold uppercase tracking-wide text-slate-500">
                Actions
              </th>
            </tr>
          </thead>

          <tbody className="divide-y divide-slate-200">
            {students.map((student) => (
              <tr key={student.id} className="transition hover:bg-slate-50">
                <td className="whitespace-nowrap px-6 py-4">
                  <p className="text-sm font-medium text-slate-900">
                    {getStudentName(student)}
                  </p>
                </td>

                <td className="whitespace-nowrap px-6 py-4 text-sm text-slate-600">
                  {student.gradeName}
                </td>

                <td className="whitespace-nowrap px-6 py-4 text-sm text-slate-600">
                  {student.sectionName}
                </td>

                <td className="whitespace-nowrap px-6 py-4">
                  <div className="flex justify-end gap-1">
                    <button
                      type="button"
                      onClick={() => onView(student)}
                      title="View"
                      className="rounded-lg p-2 text-slate-500 transition hover:bg-slate-100 hover:text-slate-700"
                    >
                      <Eye className="h-4 w-4" />
                    </button>

                    <button
                      type="button"
                      onClick={() => onEdit(student)}
                      title="Edit"
                      className="rounded-lg p-2 text-slate-500 transition hover:bg-rose-50 hover:text-rose-900"
                    >
                      <Pencil className="h-4 w-4" />
                    </button>

                    <button
                      type="button"
                      onClick={() => onDelete(student)}
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
