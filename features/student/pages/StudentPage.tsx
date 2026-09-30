import { useState } from "react";

import { ChevronLeft, ChevronRight, Plus, Search, Upload } from "lucide-react";

import { useGrades } from "../../grades/hooks/useGrades";
import { useSections } from "../../sections/hooks/useSections";

import { DeleteStudentDialog } from "../components/DeleteStudentDialog";
import { StudentFormModal } from "../components/StudentFormModal";
import { StudentImportModal } from "../components/StudentImportModal";
import { StudentQrModal } from "../components/StudentQrModal";
import { StudentTable } from "../components/StudentTable";
import { StudentViewModal } from "../components/StudentViewModal";
import { StudentBarcodeModal } from "../components/StudentBarcodeModal";

import { useStudent } from "../hooks/useStudent";
import { useStudents } from "../hooks/useStudents";

import type { Student, StudentDetails } from "../types/student";

type ModalType =
  | "create"
  | "import"
  | "view"
  | "edit"
  | "delete"
  | "qr"
  | "barcode"
  | null;

const PAGE_SIZE = 10;
const GRADE_LOOKUP_PAGE_SIZE = 100;
const SECTION_LOOKUP_PAGE_SIZE = 100;

export function StudentsPage() {
  const [pageNumber, setPageNumber] = useState(1);
  const [qrStudent, setQrStudent] = useState<StudentDetails | null>(null);

  const [search, setSearch] = useState("");
  const [searchInput, setSearchInput] = useState("");

  const [selectedGrade, setSelectedGrade] = useState("");
  const [selectedSection, setSelectedSection] = useState("");

  const [modal, setModal] = useState<ModalType>(null);
  const [selectedStudent, setSelectedStudent] = useState<Student | null>(null);

  const params = {
    pageNumber,
    pageSize: PAGE_SIZE,
    ...(search ? { name: search } : {}),
    ...(selectedGrade ? { grade: selectedGrade } : {}),
    ...(selectedSection ? { section: selectedSection } : {}),
  };

  const { data, isLoading, isFetching } = useStudents(params);

  const { data: gradesData, isLoading: isGradesLoading } = useGrades({
    pageNumber: 1,
    pageSize: GRADE_LOOKUP_PAGE_SIZE,
  });

  const { data: sectionsData, isLoading: isSectionsLoading } = useSections(
    {
      pageNumber: 1,
      pageSize: SECTION_LOOKUP_PAGE_SIZE,
      ...(selectedGrade ? { gradeName: selectedGrade } : {}),
    },
    Boolean(selectedGrade),
  );

  const selectedStudentId = selectedStudent?.id ?? 0;

  const { data: studentDetails, isLoading: isStudentLoading } =
    useStudent(selectedStudentId);

  const students = data?.results ?? [];
  const totalPages = data?.totalPages ?? 1;
  const totalCount = data?.totalCount ?? 0;

  const grades = gradesData?.results ?? [];
  const sections = sectionsData?.results ?? [];

  function handleSearch(event: React.FormEvent<HTMLFormElement>) {
    event.preventDefault();

    setPageNumber(1);
    setSearch(searchInput.trim());
  }

  function handleClearSearch() {
    setSearchInput("");
    setSearch("");
    setSelectedGrade("");
    setSelectedSection("");
    setPageNumber(1);
  }

  function handleGradeChange(event: React.ChangeEvent<HTMLSelectElement>) {
    const grade = event.target.value;

    setSelectedGrade(grade);

    // A section belongs to a grade, so changing the grade
    // should always clear the currently selected section.
    setSelectedSection("");

    setPageNumber(1);
  }

  function handleSectionChange(event: React.ChangeEvent<HTMLSelectElement>) {
    setSelectedSection(event.target.value);
    setPageNumber(1);
  }

  function handleCreate() {
    setSelectedStudent(null);
    setModal("create");
  }

  function handleImport() {
    setSelectedStudent(null);
    setModal("import");
  }

  function handleView(student: Student) {
    setSelectedStudent(student);
    setModal("view");
  }

  function handleEdit(student: Student) {
    setSelectedStudent(student);
    setModal("edit");
  }

  function handleDelete(student: Student) {
    setSelectedStudent(student);
    setModal("delete");
  }

  function handleViewQr() {
    if (!studentDetails) {
      return;
    }

    setQrStudent(studentDetails);
    setModal("qr");
  }

  function handleViewBarcode() {
    if (!studentDetails) {
      return;
    }

    setQrStudent(studentDetails);
    setModal("barcode");
  }

  function handleCloseModal() {
    setModal(null);
    setSelectedStudent(null);
    setQrStudent(null);
  }

  function handleStudentCreated(student: StudentDetails) {
    setQrStudent(student);
    setModal("qr");
  }

  function handleStudentUpdated() {
    setModal(null);
    setSelectedStudent(null);
  }

  function handleStudentDeleted() {
    setModal(null);
    setSelectedStudent(null);

    if (students.length === 1 && pageNumber > 1) {
      setPageNumber((current) => current - 1);
    }
  }

  function handlePreviousPage() {
    setPageNumber((current) => Math.max(1, current - 1));
  }

  function handleNextPage() {
    setPageNumber((current) => Math.min(totalPages, current + 1));
  }

  function getStudentName(student?: Student | StudentDetails | null) {
    if (!student) {
      return undefined;
    }

    return [
      student.firstName,
      student.middleName,
      student.lastName,
      student.extension,
    ]
      .filter(Boolean)
      .join(" ");
  }

  return (
    <div className="space-y-6">
      {/* Page Header */}
      <div className="flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
        <div>
          <h1 className="text-2xl font-bold text-slate-900">Students</h1>

          <p className="mt-1 text-sm text-slate-500">
            Manage the students in your school.
          </p>
        </div>

        <div className="flex flex-col gap-2 sm:flex-row">
          <button
            type="button"
            onClick={handleImport}
            className="inline-flex items-center justify-center gap-2 rounded-lg border border-slate-300 bg-white px-4 py-2.5 text-sm font-medium text-slate-700 transition hover:bg-slate-50"
          >
            <Upload className="h-4 w-4" />
            Import Students
          </button>

          <button
            type="button"
            onClick={handleCreate}
            className="inline-flex items-center justify-center gap-2 rounded-lg bg-rose-950 px-4 py-2.5 text-sm font-medium text-white transition hover:bg-rose-900"
          >
            <Plus className="h-4 w-4" />
            Create Student
          </button>
        </div>
      </div>

      {/* Search and Filters */}
      <div className="rounded-xl border border-slate-200 bg-white p-4">
        <form
          onSubmit={handleSearch}
          className="flex flex-col gap-3 lg:flex-row"
        >
          {/* Search */}
          <div className="relative flex-1">
            <Search className="pointer-events-none absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-slate-400" />

            <input
              type="text"
              value={searchInput}
              onChange={(event) => setSearchInput(event.target.value)}
              placeholder="Search students..."
              className="w-full rounded-lg border border-slate-300 py-2.5 pl-9 pr-3 text-sm outline-none transition focus:border-rose-700"
            />
          </div>

          {/* Grade Filter */}
          <select
            value={selectedGrade}
            onChange={handleGradeChange}
            disabled={isGradesLoading}
            className="rounded-lg border border-slate-300 bg-white px-3 py-2.5 text-sm text-slate-700 outline-none transition focus:border-rose-700 disabled:cursor-not-allowed disabled:bg-slate-100 lg:w-48"
          >
            <option value="">
              {isGradesLoading ? "Loading grades..." : "All Grades"}
            </option>

            {grades.map((grade) => (
              <option key={grade.id} value={grade.name}>
                {grade.name}
              </option>
            ))}
          </select>

          {/* Section Filter */}
          <select
            value={selectedSection}
            onChange={handleSectionChange}
            disabled={!selectedGrade || isSectionsLoading}
            className="rounded-lg border border-slate-300 bg-white px-3 py-2.5 text-sm text-slate-700 outline-none transition focus:border-rose-700 disabled:cursor-not-allowed disabled:bg-slate-100 lg:w-48"
          >
            <option value="">
              {!selectedGrade
                ? "Select a grade first"
                : isSectionsLoading
                  ? "Loading sections..."
                  : "All Sections"}
            </option>

            {sections.map((section) => (
              <option key={section.id} value={section.name}>
                {section.name}
              </option>
            ))}
          </select>

          {/* Search */}
          <button
            type="submit"
            className="inline-flex items-center justify-center gap-2 rounded-lg bg-slate-900 px-5 py-2.5 text-sm font-medium text-white transition hover:bg-slate-800"
          >
            <Search className="h-4 w-4" />
            Search
          </button>

          {/* Clear */}
          {(search || selectedGrade || selectedSection) && (
            <button
              type="button"
              onClick={handleClearSearch}
              className="rounded-lg border border-slate-300 px-5 py-2.5 text-sm font-medium text-slate-700 transition hover:bg-slate-50"
            >
              Clear
            </button>
          )}
        </form>
      </div>

      {/* Loading */}
      {isLoading ? (
        <div className="rounded-xl border border-slate-200 bg-white px-6 py-16 text-center">
          <div className="mx-auto h-6 w-6 animate-spin rounded-full border-2 border-slate-300 border-t-rose-900" />

          <p className="mt-3 text-sm text-slate-500">Loading students...</p>
        </div>
      ) : (
        <>
          <StudentTable
            students={students}
            onView={handleView}
            onEdit={handleEdit}
            onDelete={handleDelete}
          />

          {totalCount > 0 && (
            <div className="flex flex-col gap-3 sm:flex-row sm:items-center sm:justify-between">
              <p className="text-sm text-slate-500">
                Page {pageNumber} of {totalPages} · {totalCount}{" "}
                {totalCount === 1 ? "student" : "students"}
              </p>

              <div className="flex items-center gap-2">
                <button
                  type="button"
                  onClick={handlePreviousPage}
                  disabled={pageNumber <= 1 || isFetching}
                  className="inline-flex items-center gap-1 rounded-lg border border-slate-300 px-3 py-2 text-sm font-medium text-slate-700 transition hover:bg-slate-50 disabled:cursor-not-allowed disabled:opacity-50"
                >
                  <ChevronLeft className="h-4 w-4" />
                  Previous
                </button>

                <button
                  type="button"
                  onClick={handleNextPage}
                  disabled={pageNumber >= totalPages || isFetching}
                  className="inline-flex items-center gap-1 rounded-lg border border-slate-300 px-3 py-2 text-sm font-medium text-slate-700 transition hover:bg-slate-50 disabled:cursor-not-allowed disabled:opacity-50"
                >
                  Next
                  <ChevronRight className="h-4 w-4" />
                </button>
              </div>
            </div>
          )}
        </>
      )}

      {/* Create / Edit Modal */}
      <StudentFormModal
        isOpen={modal === "create" || modal === "edit"}
        mode={modal === "edit" ? "edit" : "create"}
        student={modal === "edit" ? studentDetails : null}
        onClose={handleCloseModal}
        onCreated={handleStudentCreated}
        onUpdated={handleStudentUpdated}
      />

      {/* Import Modal */}
      <StudentImportModal
        isOpen={modal === "import"}
        onClose={handleCloseModal}
      />

      {/* View Modal */}
      <StudentViewModal
        isOpen={modal === "view"}
        student={studentDetails}
        isLoading={isStudentLoading}
        onClose={handleCloseModal}
        onViewQr={handleViewQr}
        onViewBarcode={handleViewBarcode}
      />

      {/* QR Modal */}
      <StudentQrModal
        isOpen={modal === "qr"}
        student={qrStudent}
        onClose={handleCloseModal}
      />

      {/* Barcode Modal */}
      <StudentBarcodeModal
        isOpen={modal === "barcode"}
        student={qrStudent}
        onClose={handleCloseModal}
      />

      {/* Delete Modal */}
      <DeleteStudentDialog
        isOpen={modal === "delete"}
        studentId={selectedStudent?.id}
        studentName={getStudentName(selectedStudent)}
        onClose={handleCloseModal}
        onDeleted={handleStudentDeleted}
      />
    </div>
  );
}
