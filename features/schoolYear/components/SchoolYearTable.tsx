import { CheckCircle, Trash2 } from "lucide-react";
import { useState } from "react";

import { useActivateSchoolYear } from "../hooks/useActivateSchoolYear";
import { useDeleteSchoolYear } from "../hooks/useDeleteSchoolYear";
import { useSchoolYears } from "../hooks/useSchoolYears";
import SchoolYearConfirmModal from "./SchoolYearConfirmModal";

export default function SchoolYearTable() {
  const [confirmAction, setConfirmAction] = useState<
    "activate" | "delete" | null
  >(null);

  const [selectedSchoolYear, setSelectedSchoolYear] = useState<{
    id: number;
    name: string;
  } | null>(null);

  const { data, isLoading } = useSchoolYears({
    pageNumber: 1,
    pageSize: 10,
  });

  const activateSchoolYear = useActivateSchoolYear();
  const deleteSchoolYear = useDeleteSchoolYear();

  const schoolYears = data?.results ?? [];

  const handleActivateClick = (schoolYear: { id: number; name: string }) => {
    setSelectedSchoolYear(schoolYear);
    setConfirmAction("activate");
  };

  const handleDeleteClick = (schoolYear: { id: number; name: string }) => {
    setSelectedSchoolYear(schoolYear);
    setConfirmAction("delete");
  };

  const handleConfirm = () => {
    if (!selectedSchoolYear) {
      return;
    }

    if (confirmAction === "activate") {
      activateSchoolYear.mutate(selectedSchoolYear.id, {
        onSuccess: () => {
          setConfirmAction(null);
          setSelectedSchoolYear(null);
        },
      });

      return;
    }

    if (confirmAction === "delete") {
      deleteSchoolYear.mutate(selectedSchoolYear.id, {
        onSuccess: () => {
          setConfirmAction(null);
          setSelectedSchoolYear(null);
        },
      });
    }
  };

  const handleCloseModal = () => {
    if (activateSchoolYear.isPending || deleteSchoolYear.isPending) {
      return;
    }

    setConfirmAction(null);
    setSelectedSchoolYear(null);
  };

  if (isLoading) {
    return (
      <div className="rounded-xl border border-slate-200 bg-white p-8 text-center text-sm text-slate-500 shadow-sm">
        Loading school years...
      </div>
    );
  }

  if (schoolYears.length === 0) {
    return (
      <div className="rounded-xl border border-slate-200 bg-white p-12 text-center shadow-sm">
        <p className="font-medium text-slate-700">No school years found.</p>

        <p className="mt-1 text-sm text-slate-500">
          Create your first school year configuration.
        </p>

        <SchoolYearConfirmModal
          isOpen={confirmAction !== null && selectedSchoolYear !== null}
          action={confirmAction ?? "activate"}
          schoolYearName={selectedSchoolYear?.name ?? ""}
          isPending={activateSchoolYear.isPending || deleteSchoolYear.isPending}
          onConfirm={handleConfirm}
          onClose={handleCloseModal}
        />
      </div>
    );
  }

  return (
    <>
      <div className="overflow-hidden rounded-xl border border-slate-200 bg-white shadow-sm">
        <div className="overflow-x-auto">
          <table className="w-full min-w-225 text-left text-sm">
            <thead className="border-b border-slate-200 bg-slate-50">
              <tr>
                <th className="px-6 py-3 font-semibold text-slate-700">
                  School Year
                </th>

                <th className="px-6 py-3 font-semibold text-slate-700">
                  Start Date
                </th>

                <th className="px-6 py-3 font-semibold text-slate-700">
                  End Date
                </th>

                <th className="px-6 py-3 font-semibold text-slate-700">
                  Status
                </th>

                <th className="px-6 py-3 text-right font-semibold text-slate-700">
                  Actions
                </th>
              </tr>
            </thead>

            <tbody className="divide-y divide-slate-100">
              {schoolYears.map((schoolYear) => (
                <tr
                  key={schoolYear.id}
                  className="transition-colors hover:bg-rose-50/40"
                >
                  <td className="px-6 py-4">
                    <div className="font-medium text-slate-900">
                      {schoolYear.name}
                    </div>
                  </td>

                  <td className="px-6 py-4 text-slate-600">
                    {new Date(schoolYear.startDate).toLocaleDateString()}
                  </td>

                  <td className="px-6 py-4 text-slate-600">
                    {new Date(schoolYear.endDate).toLocaleDateString()}
                  </td>

                  <td className="px-6 py-4">
                    {schoolYear.isActive ? (
                      <span
                        className="
                          inline-flex items-center gap-1.5
                          rounded-full
                          bg-rose-100
                          px-3 py-1
                          text-xs font-medium
                          text-rose-700
                        "
                      >
                        <span className="h-1.5 w-1.5 rounded-full bg-rose-600" />
                        Active
                      </span>
                    ) : (
                      <span
                        className="
                          inline-flex
                          rounded-full
                          bg-slate-100
                          px-3 py-1
                          text-xs font-medium
                          text-slate-600
                        "
                      >
                        Inactive
                      </span>
                    )}
                  </td>

                  <td className="px-6 py-4">
                    <div className="flex justify-end gap-2">
                      {!schoolYear.isActive && (
                        <>
                          <button
                            type="button"
                            title="Activate school year"
                            onClick={() => handleActivateClick(schoolYear)}
                            disabled={activateSchoolYear.isPending}
                            className="
                              inline-flex items-center gap-1.5
                              rounded-lg
                              px-3 py-2
                              text-sm font-medium
                              text-rose-700
                              transition-colors
                              hover:bg-rose-100
                              disabled:cursor-not-allowed
                              disabled:opacity-50
                              cursor-pointer
                            "
                          >
                            <CheckCircle className="h-4 w-4" />
                            Activate
                          </button>

                          <button
                            type="button"
                            title="Delete school year"
                            onClick={() => handleDeleteClick(schoolYear)}
                            disabled={deleteSchoolYear.isPending}
                            className="
                              inline-flex items-center gap-1.5
                              rounded-lg
                              px-3 py-2
                              text-sm font-medium
                              text-red-600
                              transition-colors
                              hover:bg-red-50
                              disabled:cursor-not-allowed
                              disabled:opacity-50
                              cursor-pointer
                            "
                          >
                            <Trash2 className="h-4 w-4" />
                            Delete
                          </button>
                        </>
                      )}
                    </div>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>

      <SchoolYearConfirmModal
        isOpen={confirmAction !== null && selectedSchoolYear !== null}
        action={confirmAction ?? "activate"}
        schoolYearName={selectedSchoolYear?.name ?? ""}
        isPending={activateSchoolYear.isPending || deleteSchoolYear.isPending}
        onConfirm={handleConfirm}
        onClose={handleCloseModal}
      />
    </>
  );
}
