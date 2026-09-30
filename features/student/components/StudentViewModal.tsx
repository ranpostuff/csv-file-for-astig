import { Barcode, Loader2, QrCode, X } from "lucide-react";

import type { StudentDetails } from "../types/student";
import { useState } from "react";

interface StudentViewModalProps {
  isOpen: boolean;
  student?: StudentDetails | null;
  isLoading: boolean;
  onClose: () => void;
  onViewQr: () => void;
  onViewBarcode: () => void;
}

export function StudentViewModal({
  isOpen,
  student,
  isLoading,
  onClose,
  onViewQr,
  onViewBarcode,
}: StudentViewModalProps) {
  if (!isOpen) {
    return null;
  }

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/50 p-4">
      <div className="w-full max-w-2xl rounded-xl bg-white shadow-xl">
        {/* Header */}
        <div className="flex items-center justify-between border-b border-slate-200 px-6 py-4">
          <div>
            <h2 className="text-lg font-semibold text-slate-900">
              Student Details
            </h2>

            <p className="mt-1 text-sm text-slate-500">
              View student information.
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
          ) : !student ? (
            <div className="py-10 text-center text-sm text-slate-500">
              Student information could not be loaded.
            </div>
          ) : (
            <div className="space-y-6">
              {/* Student Name */}
              <div className="border-b border-slate-200 pb-5">
                <p className="text-xs font-medium uppercase tracking-wide text-slate-500">
                  Student Name
                </p>

                <p className="mt-1 text-lg font-semibold text-slate-900">
                  {[
                    student.firstName,
                    student.middleName,
                    student.lastName,
                    student.extension,
                  ]
                    .filter((value) => value?.trim())
                    .join(" ")}
                </p>
              </div>

              {/* Personal Information */}
              <div>
                <h3 className="mb-4 text-sm font-semibold text-rose-950">
                  Personal Information
                </h3>

                <div className="grid gap-5 sm:grid-cols-2">
                  <div>
                    <p className="text-xs font-medium uppercase tracking-wide text-slate-500">
                      LRN
                    </p>

                    <p className="mt-1 text-sm text-slate-700">{student.lrn}</p>
                  </div>

                  <div>
                    <p className="text-xs font-medium uppercase tracking-wide text-slate-500">
                      First Name
                    </p>

                    <p className="mt-1 text-sm text-slate-700">
                      {student.firstName}
                    </p>
                  </div>

                  <div>
                    <p className="text-xs font-medium uppercase tracking-wide text-slate-500">
                      Middle Name
                    </p>

                    <p className="mt-1 text-sm text-slate-700">
                      {student.middleName || "N/A"}
                    </p>
                  </div>

                  <div>
                    <p className="text-xs font-medium uppercase tracking-wide text-slate-500">
                      Last Name
                    </p>

                    <p className="mt-1 text-sm text-slate-700">
                      {student.lastName}
                    </p>
                  </div>

                  <div>
                    <p className="text-xs font-medium uppercase tracking-wide text-slate-500">
                      Extension
                    </p>

                    <p className="mt-1 text-sm text-slate-700">
                      {student.extension || "N/A"}
                    </p>
                  </div>
                </div>
              </div>

              {/* Parent Information */}
              <div>
                <h3 className="mb-4 text-sm font-semibold text-rose-950">
                  Parent / Guardian Information
                </h3>

                <div className="grid gap-5 sm:grid-cols-2">
                  <div>
                    <p className="text-xs font-medium uppercase tracking-wide text-slate-500">
                      Parent Email
                    </p>

                    <p className="mt-1 break-words text-sm text-slate-700">
                      {student.parentEmail || "N/A"}
                    </p>
                  </div>

                  <div>
                    <p className="text-xs font-medium uppercase tracking-wide text-slate-500">
                      Parent Mobile Number
                    </p>

                    <p className="mt-1 text-sm text-slate-700">
                      {student.parentMobileNo}
                    </p>
                  </div>
                </div>
              </div>

              {/* Academic Information */}
              <div>
                <h3 className="mb-4 text-sm font-semibold text-rose-950">
                  Academic Information
                </h3>

                <div className="grid gap-5 sm:grid-cols-2">
                  <div>
                    <p className="text-xs font-medium uppercase tracking-wide text-slate-500">
                      Grade
                    </p>

                    <p className="mt-1 text-sm text-slate-700">
                      {student.gradeName}
                    </p>
                  </div>

                  <div>
                    <p className="text-xs font-medium uppercase tracking-wide text-slate-500">
                      Section
                    </p>

                    <p className="mt-1 text-sm text-slate-700">
                      {student.sectionName}
                    </p>
                  </div>
                </div>
              </div>

              {/* Profile Picture */}
              {student.studentPicUrl && (
                <div>
                  <h3 className="mb-4 text-sm font-semibold text-rose-950">
                    Profile Picture
                  </h3>

                  <div className="flex justify-center">
                    <img
                      src={student.studentPicUrl}
                      alt="Student profile"
                      className="h-32 w-32 rounded-full border border-slate-200 object-cover"
                    />
                  </div>
                </div>
              )}

              {/* Record Information */}
              <div>
                <h3 className="mb-4 text-sm font-semibold text-rose-950">
                  Record Information
                </h3>

                <div className="grid gap-5 sm:grid-cols-2">
                  <div>
                    <p className="text-xs font-medium uppercase tracking-wide text-slate-500">
                      Created By
                    </p>

                    <p className="mt-1 text-sm text-slate-700">
                      {student.createdBy || "N/A"}
                    </p>
                  </div>

                  <div>
                    <p className="text-xs font-medium uppercase tracking-wide text-slate-500">
                      Created At
                    </p>

                    <p className="mt-1 text-sm text-slate-700">
                      {new Date(student.createdDate).toLocaleString()}
                    </p>
                  </div>

                  <div>
                    <p className="text-xs font-medium uppercase tracking-wide text-slate-500">
                      Updated By
                    </p>

                    <p className="mt-1 text-sm text-slate-700">
                      {student.updatedBy || "N/A"}
                    </p>
                  </div>

                  <div>
                    <p className="text-xs font-medium uppercase tracking-wide text-slate-500">
                      Updated At
                    </p>

                    <p className="mt-1 text-sm text-slate-700">
                      {new Date(student.updatedDate).toLocaleString()}
                    </p>
                  </div>
                </div>
              </div>
            </div>
          )}
        </div>

        {/* Footer */}
        <div className="flex justify-end gap-3 border-t border-slate-200 px-6 py-4">
          <button
            type="button"
            onClick={onClose}
            className="rounded-lg border border-slate-300 px-4 py-2.5 text-sm font-medium text-slate-700 transition hover:bg-slate-50"
          >
            Close
          </button>

          <button
            type="button"
            onClick={onViewBarcode}
            disabled={isLoading || !student}
            className="inline-flex items-center gap-2 rounded-lg border border-rose-950 px-4 py-2.5 text-sm font-medium text-rose-950 transition hover:bg-rose-50 disabled:cursor-not-allowed disabled:opacity-50"
          >
            <Barcode className="h-4 w-4" />
            View Barcode
          </button>

          <button
            type="button"
            onClick={onViewQr}
            disabled={isLoading || !student}
            className="inline-flex items-center gap-2 rounded-lg bg-rose-950 px-4 py-2.5 text-sm font-medium text-white transition hover:bg-rose-900 disabled:cursor-not-allowed disabled:opacity-50"
          >
            <QrCode className="h-4 w-4" />
            View QR
          </button>
        </div>
      </div>
    </div>
  );
}
