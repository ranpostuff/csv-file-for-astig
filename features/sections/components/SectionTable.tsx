import { Pencil, Eye, Trash2 } from "lucide-react";
import type { Section } from "../types/section";

interface SectionTableProps {
  sections: Section[];
  onView: (section: Section) => void;
  onEdit: (section: Section) => void;
  onDelete: (section: Section) => void;
}

export function SectionTable({
  sections,
  onView,
  onEdit,
  onDelete,
}: SectionTableProps) {
  if (sections.length === 0) {
    return (
      <div className="rounded-xl border border-slate-200 bg-white p-8 text-center">
        <p className="text-sm text-slate-500">No sections found.</p>
      </div>
    );
  }

  return (
    <div className="overflow-hidden rounded-xl border border-slate-200 bg-white">
      <div className="overflow-x-auto">
        <table className="min-w-full divide-y divide-slate-200">
          <thead className="bg-slate-50">
            <tr>
              <th className="px-6 py-4 text-left text-xs font-semibold uppercase tracking-wider text-slate-500">
                Section
              </th>

              <th className="px-6 py-4 text-left text-xs font-semibold uppercase tracking-wider text-slate-500">
                Assigned Teacher
              </th>

              <th className="px-6 py-4 text-left text-xs font-semibold uppercase tracking-wider text-slate-500">
                Grade
              </th>

              <th className="px-6 py-4 text-right text-xs font-semibold uppercase tracking-wider text-slate-500">
                Actions
              </th>
            </tr>
          </thead>

          <tbody className="divide-y divide-slate-200">
            {sections.map((section) => (
              <tr key={section.id} className="hover:bg-slate-50">
                <td className="whitespace-nowrap px-6 py-4 text-sm font-medium text-slate-900">
                  {section.name}
                </td>

                <td className="whitespace-nowrap px-6 py-4 text-sm text-slate-600">
                  {section.assignedTeacher}
                </td>

                <td className="whitespace-nowrap px-6 py-4 text-sm text-slate-600">
                  {section.gradeName}
                </td>

                <td className="whitespace-nowrap px-6 py-4">
                  <div className="flex justify-end gap-2">
                    <button
                      type="button"
                      onClick={() => onView(section)}
                      className="rounded-lg p-2 text-slate-500 hover:bg-slate-100 hover:text-slate-700"
                      title="View"
                    >
                      <Eye size={18} />
                    </button>

                    <button
                      type="button"
                      onClick={() => onEdit(section)}
                      className="rounded-lg p-2 text-rose-700 hover:bg-rose-50"
                      title="Edit"
                    >
                      <Pencil size={18} />
                    </button>

                    <button
                      type="button"
                      onClick={() => onDelete(section)}
                      className="rounded-lg p-2 text-red-600 hover:bg-red-50"
                      title="Delete"
                    >
                      <Trash2 size={18} />
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
