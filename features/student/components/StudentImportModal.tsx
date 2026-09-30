import { useEffect, useMemo, useRef, useState } from "react";

import {
  AlertTriangle,
  CheckCircle2,
  Download,
  FileSpreadsheet,
  Loader2,
  Upload,
  X,
} from "lucide-react";

import { useSections } from "../../sections/hooks/useSections";

import { SIMULATE_IMPORT, useImportStudents } from "../hooks/useImportStudents";

import {
  IMPORT_REQUIRED_LABELS,
  IMPORT_TEMPLATE_HEADERS,
  ImportFileError,
  MAX_IMPORT_FILE_SIZE_MB,
  MAX_IMPORT_ROWS,
  parseStudentImportFile,
} from "../utils/parseStudentImportFile";
import { validateStudentImportRows } from "../utils/validateStudentImport";

import type {
  StudentImportOutcome,
  StudentImportRawRow,
} from "../types/studentImport";

import { toastService } from "~/services/toastService";

interface StudentImportModalProps {
  isOpen: boolean;
  onClose: () => void;
}

type Step = "select" | "review" | "done";

const SECTION_LOOKUP_PAGE_SIZE = 100;

function downloadTemplate() {
  const csv = `${IMPORT_TEMPLATE_HEADERS.join(",")}\r\n`;
  const blob = new Blob([`\uFEFF${csv}`], { type: "text/csv;charset=utf-8" });
  const url = URL.createObjectURL(blob);

  const link = document.createElement("a");
  link.href = url;
  link.download = "student-import-template.csv";
  link.click();

  URL.revokeObjectURL(url);
}

export function StudentImportModal({ isOpen, onClose }: StudentImportModalProps) {
  const fileInputRef = useRef<HTMLInputElement>(null);

  const [step, setStep] = useState<Step>("select");
  const [isDragging, setIsDragging] = useState(false);
  const [isReading, setIsReading] = useState(false);
  const [fileError, setFileError] = useState<string | null>(null);

  const [fileName, setFileName] = useState("");
  const [rawRows, setRawRows] = useState<StudentImportRawRow[]>([]);
  const [showOnlyErrors, setShowOnlyErrors] = useState(false);
  const [outcomes, setOutcomes] = useState<StudentImportOutcome[]>([]);

  const { importStudents, isImporting, progress } = useImportStudents();

  const {
    data: sectionsData,
    isLoading: isSectionsLoading,
  } = useSections(
    { pageNumber: 1, pageSize: SECTION_LOOKUP_PAGE_SIZE },
    isOpen,
  );

  const sections = sectionsData?.results ?? null;

  // Re-validates automatically if the sections finish loading after the file is read.
  const rows = useMemo(
    () => validateStudentImportRows(rawRows, sections),
    [rawRows, sections],
  );

  const validRows = rows.filter((row) => row.errors.length === 0);
  const invalidRows = rows.filter((row) => row.errors.length > 0);
  const visibleRows = showOnlyErrors ? invalidRows : rows;

  const canImport =
    validRows.length > 0 &&
    !isImporting &&
    (SIMULATE_IMPORT || sections !== null);

  // Start fresh every time the modal is closed.
  useEffect(() => {
    if (isOpen) {
      return;
    }

    setStep("select");
    setIsDragging(false);
    setIsReading(false);
    setFileError(null);
    setFileName("");
    setRawRows([]);
    setShowOnlyErrors(false);
    setOutcomes([]);
  }, [isOpen]);

  async function handleFile(file: File | undefined) {
    if (!file) {
      return;
    }

    setFileError(null);
    setIsReading(true);

    try {
      const parsed = await parseStudentImportFile(file);

      setFileName(file.name);
      setRawRows(parsed.rows);
      setShowOnlyErrors(false);
      setStep("review");
    } catch (error) {
      setFileError(
        error instanceof ImportFileError
          ? error.message
          : "Something went wrong while reading the file.",
      );
    } finally {
      setIsReading(false);

      if (fileInputRef.current) {
        fileInputRef.current.value = "";
      }
    }
  }

  function handleDrop(event: React.DragEvent<HTMLLabelElement>) {
    event.preventDefault();
    setIsDragging(false);

    void handleFile(event.dataTransfer.files?.[0]);
  }

  function handleChooseAnother() {
    setStep("select");
    setRawRows([]);
    setFileName("");
    setFileError(null);
  }

  async function handleImport() {
    const results = await importStudents(validRows);

    setOutcomes(results);
    setStep("done");

    const failed = results.filter((r) => r.status === "failed").length;

    if (failed === 0) {
      toastService.success(
        `${results.length} student${results.length === 1 ? "" : "s"} ${
          SIMULATE_IMPORT ? "imported (demo)" : "imported"
        }.`,
      );
    } else {
      toastService.warning(
        `${results.length - failed} imported, ${failed} failed.`,
      );
    }
  }

  function handleClose() {
    if (isImporting) {
      return;
    }

    onClose();
  }

  if (!isOpen) {
    return null;
  }

  const successCount = outcomes.filter((o) => o.status === "success").length;
  const failedOutcomes = outcomes.filter((o) => o.status === "failed");

  return (
    <div
      role="dialog"
      aria-modal="true"
      aria-labelledby="student-import-title"
      className="fixed inset-0 z-50 flex items-center justify-center bg-black/50 p-4"
    >
      <div className="flex max-h-[90vh] w-full max-w-4xl flex-col overflow-hidden rounded-xl bg-white shadow-xl">
        {/* Header */}
        <div className="flex items-center justify-between border-b border-slate-200 px-6 py-4">
          <div>
            <h2
              id="student-import-title"
              className="text-lg font-semibold text-slate-900"
            >
              Import Students
            </h2>

            <p className="mt-1 text-sm text-slate-500">
              Add many students at once from a CSV or Excel file.
            </p>
          </div>

          <button
            type="button"
            onClick={handleClose}
            disabled={isImporting}
            className="rounded-lg p-2 text-slate-500 transition hover:bg-slate-100 hover:text-slate-700 disabled:cursor-not-allowed disabled:opacity-50"
          >
            <X className="h-5 w-5" />
          </button>
        </div>

        {/* Body */}
        <div className="flex-1 overflow-y-auto p-6">
          {SIMULATE_IMPORT && (
            <div className="mb-4 flex items-start gap-2 rounded-lg border border-amber-200 bg-amber-50 px-3 py-2 text-sm text-amber-800">
              <AlertTriangle className="mt-0.5 h-4 w-4 shrink-0" />
              <p>
                Demo mode: students are checked and "imported" on screen only.
                Nothing is saved to the server yet.
              </p>
            </div>
          )}

          {/* ---------- Step 1: choose a file ---------- */}
          {step === "select" && (
            <div className="space-y-5">
              <label
                onDragOver={(event) => {
                  event.preventDefault();
                  setIsDragging(true);
                }}
                onDragLeave={() => setIsDragging(false)}
                onDrop={handleDrop}
                className={`flex cursor-pointer flex-col items-center justify-center rounded-xl border-2 border-dashed px-6 py-12 text-center transition ${
                  isDragging
                    ? "border-rose-700 bg-rose-50"
                    : "border-slate-300 hover:border-rose-700 hover:bg-slate-50"
                }`}
              >
                {isReading ? (
                  <Loader2 className="h-8 w-8 animate-spin text-rose-900" />
                ) : (
                  <Upload className="h-8 w-8 text-slate-400" />
                )}

                <p className="mt-3 text-sm font-medium text-slate-700">
                  {isReading
                    ? "Reading file..."
                    : "Click to choose a file, or drag it here"}
                </p>

                <p className="mt-1 text-xs text-slate-500">
                  .csv or .xlsx, up to {MAX_IMPORT_FILE_SIZE_MB} MB and{" "}
                  {MAX_IMPORT_ROWS} students
                </p>

                <input
                  ref={fileInputRef}
                  type="file"
                  accept=".csv,.xlsx"
                  className="hidden"
                  disabled={isReading}
                  onChange={(event) => void handleFile(event.target.files?.[0])}
                />
              </label>

              {fileError && (
                <p
                  role="alert"
                  className="rounded-lg border border-red-200 bg-red-50 px-3 py-2 text-sm text-red-700"
                >
                  {fileError}
                </p>
              )}

              <div className="rounded-xl border border-slate-200 bg-slate-50 p-4">
                <div className="flex flex-col gap-3 sm:flex-row sm:items-start sm:justify-between">
                  <div>
                    <h3 className="text-sm font-semibold text-slate-900">
                      Expected columns
                    </h3>

                    <p className="mt-1 text-sm text-slate-600">
                      {IMPORT_TEMPLATE_HEADERS.map((header, index) => (
                        <span key={header}>
                          {index > 0 && ", "}
                          <span
                            className={
                              IMPORT_REQUIRED_LABELS.includes(header)
                                ? "font-semibold text-slate-900"
                                : ""
                            }
                          >
                            {header}
                          </span>
                        </span>
                      ))}
                    </p>

                    <p className="mt-1 text-xs text-slate-500">
                      Bold columns are required. Grade and Section must match
                      the names already set up in the system (for example
                      "Grade 7" and "Rizal").
                    </p>
                  </div>

                  <button
                    type="button"
                    onClick={downloadTemplate}
                    className="inline-flex shrink-0 items-center justify-center gap-2 rounded-lg border border-slate-300 bg-white px-4 py-2.5 text-sm font-medium text-slate-700 transition hover:bg-slate-50"
                  >
                    <Download className="h-4 w-4" />
                    Download template
                  </button>
                </div>
              </div>
            </div>
          )}

          {/* ---------- Step 2: review ---------- */}
          {step === "review" && (
            <div className="space-y-4">
              <div className="flex flex-wrap items-center gap-x-4 gap-y-2">
                <div className="flex items-center gap-2 text-sm text-slate-700">
                  <FileSpreadsheet className="h-4 w-4 text-slate-400" />
                  <span className="font-medium">{fileName}</span>
                </div>

                <span className="rounded-full bg-slate-100 px-2.5 py-1 text-xs font-medium text-slate-700">
                  {rows.length} rows
                </span>

                <span className="rounded-full bg-green-50 px-2.5 py-1 text-xs font-medium text-green-700">
                  {validRows.length} ready
                </span>

                {invalidRows.length > 0 && (
                  <span className="rounded-full bg-red-50 px-2.5 py-1 text-xs font-medium text-red-700">
                    {invalidRows.length} with errors
                  </span>
                )}
              </div>

              {isSectionsLoading && (
                <p className="text-sm text-slate-500">
                  Checking grades and sections...
                </p>
              )}

              {!isSectionsLoading && sections === null && (
                <div className="flex items-start gap-2 rounded-lg border border-amber-200 bg-amber-50 px-3 py-2 text-sm text-amber-800">
                  <AlertTriangle className="mt-0.5 h-4 w-4 shrink-0" />
                  <p>
                    Couldn't load the list of sections, so Grade and Section
                    names haven't been checked against the system.
                  </p>
                </div>
              )}

              {invalidRows.length > 0 && (
                <div className="flex items-center justify-between gap-3">
                  <p className="text-sm text-slate-500">
                    Rows with errors will be skipped.
                  </p>

                  <button
                    type="button"
                    onClick={() => setShowOnlyErrors((current) => !current)}
                    className="text-sm font-medium text-rose-900 hover:underline"
                  >
                    {showOnlyErrors ? "Show all rows" : "Show only rows with errors"}
                  </button>
                </div>
              )}

              <div className="overflow-hidden rounded-xl border border-slate-200">
                <div className="max-h-[42vh] overflow-auto">
                  <table className="min-w-full divide-y divide-slate-200">
                    <thead className="sticky top-0 bg-slate-50">
                      <tr>
                        {["Row", "LRN", "Student", "Grade & Section", "Status"].map(
                          (heading) => (
                            <th
                              key={heading}
                              className="px-4 py-3 text-left text-xs font-semibold uppercase tracking-wide text-slate-500"
                            >
                              {heading}
                            </th>
                          ),
                        )}
                      </tr>
                    </thead>

                    <tbody className="divide-y divide-slate-200 bg-white">
                      {visibleRows.map((row) => (
                        <tr
                          key={row.rowNumber}
                          className={row.errors.length > 0 ? "bg-red-50/40" : ""}
                        >
                          <td className="whitespace-nowrap px-4 py-3 text-sm text-slate-500">
                            {row.rowNumber}
                          </td>

                          <td className="whitespace-nowrap px-4 py-3 text-sm text-slate-700">
                            {row.lrn || "—"}
                          </td>

                          <td className="whitespace-nowrap px-4 py-3 text-sm text-slate-900">
                            {[
                              row.lastName ? `${row.lastName},` : "",
                              row.firstName,
                              row.middleName,
                              row.extension,
                            ]
                              .filter(Boolean)
                              .join(" ") || "—"}
                          </td>

                          <td className="whitespace-nowrap px-4 py-3 text-sm text-slate-600">
                            {[row.gradeName, row.sectionName]
                              .filter(Boolean)
                              .join(" · ") || "—"}
                          </td>

                          <td className="px-4 py-3 text-sm">
                            {row.errors.length === 0 ? (
                              <span className="inline-flex items-center gap-1 text-green-700">
                                <CheckCircle2 className="h-4 w-4" />
                                Ready
                              </span>
                            ) : (
                              <ul className="space-y-0.5 text-red-700">
                                {row.errors.map((message) => (
                                  <li key={message}>{message}</li>
                                ))}
                              </ul>
                            )}
                          </td>
                        </tr>
                      ))}
                    </tbody>
                  </table>
                </div>
              </div>
            </div>
          )}

          {/* ---------- Step 3: done ---------- */}
          {step === "done" && (
            <div className="space-y-4">
              <div className="rounded-xl border border-green-200 bg-green-50 px-4 py-4 text-center">
                <CheckCircle2 className="mx-auto h-8 w-8 text-green-600" />

                <p className="mt-2 text-base font-semibold text-slate-900">
                  {successCount} student{successCount === 1 ? "" : "s"}{" "}
                  {SIMULATE_IMPORT ? "imported (demo)" : "imported"}
                </p>

                {invalidRows.length > 0 && (
                  <p className="mt-1 text-sm text-slate-600">
                    {invalidRows.length} row{invalidRows.length === 1 ? "" : "s"}{" "}
                    skipped because of errors.
                  </p>
                )}
              </div>

              {failedOutcomes.length > 0 && (
                <div className="rounded-xl border border-red-200 bg-red-50 p-4">
                  <p className="text-sm font-semibold text-red-800">
                    {failedOutcomes.length} could not be imported
                  </p>

                  <ul className="mt-2 space-y-1 text-sm text-red-700">
                    {failedOutcomes.map((outcome) => (
                      <li key={outcome.rowNumber}>
                        Row {outcome.rowNumber} ({outcome.name}): {outcome.message}
                      </li>
                    ))}
                  </ul>
                </div>
              )}

              {successCount > 0 && (
                <div className="overflow-hidden rounded-xl border border-slate-200">
                  <div className="max-h-[32vh] overflow-auto">
                    <table className="min-w-full divide-y divide-slate-200">
                      <thead className="sticky top-0 bg-slate-50">
                        <tr>
                          <th className="px-4 py-3 text-left text-xs font-semibold uppercase tracking-wide text-slate-500">
                            LRN
                          </th>
                          <th className="px-4 py-3 text-left text-xs font-semibold uppercase tracking-wide text-slate-500">
                            Student
                          </th>
                        </tr>
                      </thead>

                      <tbody className="divide-y divide-slate-200 bg-white">
                        {outcomes
                          .filter((outcome) => outcome.status === "success")
                          .map((outcome) => (
                            <tr key={outcome.rowNumber}>
                              <td className="whitespace-nowrap px-4 py-3 text-sm text-slate-700">
                                {outcome.lrn}
                              </td>
                              <td className="whitespace-nowrap px-4 py-3 text-sm text-slate-900">
                                {outcome.name}
                              </td>
                            </tr>
                          ))}
                      </tbody>
                    </table>
                  </div>
                </div>
              )}
            </div>
          )}
        </div>

        {/* Footer */}
        <div className="flex flex-col-reverse gap-3 border-t border-slate-200 px-6 py-4 sm:flex-row sm:items-center sm:justify-end">
          {step === "select" && (
            <button
              type="button"
              onClick={handleClose}
              className="rounded-lg border border-slate-300 px-5 py-2.5 text-sm font-medium text-slate-700 transition hover:bg-slate-50"
            >
              Cancel
            </button>
          )}

          {step === "review" && (
            <>
              <button
                type="button"
                onClick={handleChooseAnother}
                disabled={isImporting}
                className="rounded-lg border border-slate-300 px-5 py-2.5 text-sm font-medium text-slate-700 transition hover:bg-slate-50 disabled:cursor-not-allowed disabled:opacity-50"
              >
                Choose another file
              </button>

              <button
                type="button"
                onClick={() => void handleImport()}
                disabled={!canImport}
                className="inline-flex items-center justify-center gap-2 rounded-lg bg-rose-950 px-5 py-2.5 text-sm font-medium text-white transition hover:bg-rose-900 disabled:cursor-not-allowed disabled:opacity-50"
              >
                {isImporting ? (
                  <>
                    <Loader2 className="h-4 w-4 animate-spin" />
                    Importing {progress.done} of {progress.total}...
                  </>
                ) : (
                  `Import ${validRows.length} student${
                    validRows.length === 1 ? "" : "s"
                  }`
                )}
              </button>
            </>
          )}

          {step === "done" && (
            <button
              type="button"
              onClick={onClose}
              className="rounded-lg bg-rose-950 px-5 py-2.5 text-sm font-medium text-white transition hover:bg-rose-900"
            >
              Done
            </button>
          )}
        </div>
      </div>
    </div>
  );
}
