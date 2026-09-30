import { Loader2, Plus, Search } from "lucide-react";
import { useState } from "react";

import { SectionTable } from "../components/SectionTable";
import { SectionFormModal } from "../components/SectionFormModal";
import { SectionViewModal } from "../components/SectionViewModal";
import { DeleteSectionDialog } from "../components/DeleteSectionDialog";

import { useSections } from "../hooks/useSections";
import { useSection } from "../hooks/useSection";
import { useDeleteSection } from "../hooks/useDeleteSection";

import type { Section } from "../types/section";
import { toastService } from "../../../app/services/toastService";
import { useGrades } from "../../grades/hooks/useGrades";

export function SectionsPage() {
  const [pageNumber, setPageNumber] = useState(1);
  const pageSize = 10;

  // Search input values
  const [name, setName] = useState("");
  const [teacherName, setTeacherName] = useState("");
  const [gradeName, setGradeName] = useState("");

  // Values actually used by the API query
  const [searchParams, setSearchParams] = useState({
    name: "",
    assignedTeacherName: "",
    gradeName: "",
  });

  const [isFormOpen, setIsFormOpen] = useState(false);

  const [isViewOpen, setIsViewOpen] = useState(false);

  const [isDeleteOpen, setIsDeleteOpen] = useState(false);

  const [selectedSectionId, setSelectedSectionId] = useState<number | null>(
    null,
  );

  const [selectedSection, setSelectedSection] = useState<Section | null>(null);

  // --------------------------------------------------
  // Grades
  // --------------------------------------------------

  const { data: gradesData, isLoading: isLoadingGrades } = useGrades({
    pageNumber: 1,
    pageSize: 100,
  });

  // --------------------------------------------------
  // Sections
  // --------------------------------------------------

  const { data, isLoading, isFetching, isError } = useSections({
    ...searchParams,
    pageNumber,
    pageSize,
  });

  const { data: sectionDetails } = useSection(selectedSectionId);

  const deleteSection = useDeleteSection();

  const handleSearch = () => {
    setPageNumber(1);

    setSearchParams({
      name: name.trim(),
      assignedTeacherName: teacherName.trim(),
      gradeName: gradeName,
    });
  };

  const handleCreate = () => {
    setSelectedSectionId(null);
    setIsFormOpen(true);
  };

  const handleView = (section: Section) => {
    setSelectedSectionId(section.id);
    setIsViewOpen(true);
  };

  const handleEdit = (section: Section) => {
    setSelectedSectionId(section.id);
    setIsFormOpen(true);
  };

  const handleDelete = (section: Section) => {
    setSelectedSection(section);
    setIsDeleteOpen(true);
  };

  const handleConfirmDelete = async () => {
    if (!selectedSection) {
      return;
    }

    try {
      await deleteSection.mutateAsync(selectedSection.id);

      toastService.success("Section deleted successfully.");

      setIsDeleteOpen(false);
      setSelectedSection(null);
    } catch (error) {
      toastService.error(error);
    }
  };

  const handlePageChange = (page: number) => {
    setPageNumber(page);
  };

  const isEditing = selectedSectionId !== null;

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex flex-col justify-between gap-4 sm:flex-row sm:items-center">
        <div>
          <h1 className="text-2xl font-bold text-slate-900">Sections</h1>

          <p className="mt-1 text-sm text-slate-500">
            Manage sections and their assigned teachers.
          </p>
        </div>

        <button
          type="button"
          onClick={handleCreate}
          className="flex items-center justify-center gap-2 rounded-lg bg-rose-950 px-4 py-2.5 text-sm font-medium text-white hover:bg-rose-900"
        >
          <Plus size={18} />
          Add Section
        </button>
      </div>

      {/* Filters */}
      <div className="rounded-xl border border-slate-200 bg-white p-4">
        <div className="grid gap-4 md:grid-cols-3">
          {/* Section Name */}
          <div>
            <label className="mb-2 block text-sm font-medium text-slate-700">
              Section Name
            </label>

            <input
              value={name}
              onChange={(event) => setName(event.target.value)}
              placeholder="Search section..."
              className="w-full rounded-lg border border-slate-300 px-3 py-2 text-sm outline-none focus:border-rose-700 focus:ring-1 focus:ring-rose-700"
            />
          </div>

          {/* Assigned Teacher */}
          <div>
            <label className="mb-2 block text-sm font-medium text-slate-700">
              Assigned Teacher
            </label>

            <input
              value={teacherName}
              onChange={(event) => setTeacherName(event.target.value)}
              placeholder="Search teacher..."
              className="w-full rounded-lg border border-slate-300 px-3 py-2 text-sm outline-none focus:border-rose-700 focus:ring-1 focus:ring-rose-700"
            />
          </div>

          {/* Grade */}
          <div>
            <label className="mb-2 block text-sm font-medium text-slate-700">
              Grade
            </label>

            <select
              value={gradeName}
              onChange={(event) => setGradeName(event.target.value)}
              disabled={isLoadingGrades}
              className="w-full rounded-lg border border-slate-300 bg-white px-3 py-2 text-sm outline-none focus:border-rose-700 focus:ring-1 focus:ring-rose-700 disabled:cursor-not-allowed disabled:bg-slate-100"
            >
              <option value="">
                {isLoadingGrades ? "Loading grades..." : "All Grades"}
              </option>

              {gradesData?.results.map((grade) => (
                <option key={grade.id} value={grade.name}>
                  {grade.name}
                </option>
              ))}
            </select>
          </div>
        </div>

        {/* Search button */}
        <div className="mt-4 flex justify-end">
          <button
            type="button"
            onClick={handleSearch}
            className="flex items-center gap-2 rounded-lg bg-rose-950 px-4 py-2 text-sm font-medium text-white hover:bg-rose-900"
          >
            <Search size={17} />
            Search
          </button>
        </div>
      </div>

      {/* Table */}
      {isLoading ? (
        <div className="rounded-xl border border-slate-200 bg-white p-8 text-center">
          <p className="text-sm text-slate-500">Loading sections...</p>
        </div>
      ) : isError ? (
        <div className="rounded-xl border border-red-200 bg-red-50 p-8 text-center">
          <p className="text-sm text-red-600">Failed to load sections.</p>
        </div>
      ) : (
        <>
          <SectionTable
            sections={data?.results ?? []}
            onView={handleView}
            onEdit={handleEdit}
            onDelete={handleDelete}
          />

          {/* Pagination */}
          {data && data.totalPages > 1 && (
            <div className="flex items-center justify-between rounded-xl border border-slate-200 bg-white px-4 py-3">
              <p className="text-sm text-slate-500">
                Page {data.pageNumber} of {data.totalPages}
              </p>

              <div className="flex gap-2">
                <button
                  type="button"
                  disabled={pageNumber <= 1}
                  onClick={() => handlePageChange(pageNumber - 1)}
                  className="rounded-lg border border-slate-300 px-3 py-2 text-sm text-slate-700 hover:bg-slate-50 disabled:cursor-not-allowed disabled:opacity-50"
                >
                  Previous
                </button>

                <button
                  type="button"
                  disabled={pageNumber >= data.totalPages}
                  onClick={() => handlePageChange(pageNumber + 1)}
                  className="rounded-lg border border-slate-300 px-3 py-2 text-sm text-slate-700 hover:bg-slate-50 disabled:cursor-not-allowed disabled:opacity-50"
                >
                  Next
                </button>
              </div>
            </div>
          )}

          {isFetching && (
            <p className="text-right text-xs text-slate-400">Updating...</p>
          )}
        </>
      )}

      {/* Edit loading */}
      {isFormOpen && isEditing && !sectionDetails && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/40 p-4">
          <div className="rounded-xl bg-white px-6 py-5 shadow-xl">
            <div className="flex items-center gap-3">
              <Loader2 size={20} className="animate-spin text-rose-900" />

              <p className="text-sm text-slate-600">Loading section...</p>
            </div>
          </div>
        </div>
      )}

      {/* Create / Edit */}
      {isFormOpen && (!isEditing || sectionDetails) && (
        <SectionFormModal
          isOpen={isFormOpen}
          section={sectionDetails ?? null}
          onClose={() => {
            setIsFormOpen(false);
            setSelectedSectionId(null);
          }}
        />
      )}

      {/* View */}
      <SectionViewModal
        isOpen={isViewOpen}
        sectionId={selectedSectionId}
        onClose={() => {
          setIsViewOpen(false);
          setSelectedSectionId(null);
        }}
      />

      {/* Delete */}
      <DeleteSectionDialog
        isOpen={isDeleteOpen}
        section={selectedSection}
        isDeleting={deleteSection.isPending}
        onClose={() => {
          if (deleteSection.isPending) {
            return;
          }

          setIsDeleteOpen(false);
          setSelectedSection(null);
        }}
        onConfirm={handleConfirmDelete}
      />
    </div>
  );
}
