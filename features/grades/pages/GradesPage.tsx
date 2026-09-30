import { useState } from "react";
import { ChevronLeft, ChevronRight, Plus, Search } from "lucide-react";

import { GradeTable } from "../components/GradeTable";
import { GradeFormModal } from "../components/GradeFormModal";
import { GradeViewModal } from "../components/GradeViewModal";
import { DeleteGradeDialog } from "../components/DeleteGradeDialog";

import { useGrades } from "../hooks/useGrades";
import { useGrade } from "../hooks/useGrade";
import { useCreateGrade } from "../hooks/useCreateGrade";
import { useUpdateGrade } from "../hooks/useUpdateGrade";
import { useDeleteGrade } from "../hooks/useDeleteGrade";

import type { Grade } from "../types/grade";
import type { GradeFormValues } from "../schema/gradeSchema";

type ModalType = "create" | "view" | "edit" | "delete" | null;

const PAGE_SIZE = 10;

export function GradesPage() {
  const [pageNumber, setPageNumber] = useState(1);
  const [search, setSearch] = useState("");
  const [searchInput, setSearchInput] = useState("");

  const [modal, setModal] = useState<ModalType>(null);
  const [selectedGrade, setSelectedGrade] = useState<Grade | null>(null);

  const params = {
    pageNumber,
    pageSize: PAGE_SIZE,
    ...(search ? { name: search } : {}),
  };

  const { data, isLoading, isFetching } = useGrades(params);

  const selectedGradeId = selectedGrade?.id ?? 0;

  const { data: gradeDetails, isLoading: isGradeLoading } =
    useGrade(selectedGradeId);

  const createGrade = useCreateGrade();
  const updateGrade = useUpdateGrade();
  const deleteGrade = useDeleteGrade();

  const grades = data?.results ?? [];
  const totalPages = data?.totalPages ?? 1;
  const totalCount = data?.totalCount ?? 0;

  function handleSearch(event: React.FormEvent<HTMLFormElement>) {
    event.preventDefault();

    setPageNumber(1);
    setSearch(searchInput.trim());
  }

  function handleClearSearch() {
    setSearchInput("");
    setSearch("");
    setPageNumber(1);
  }

  function handleCreate() {
    setSelectedGrade(null);
    setModal("create");
  }

  function handleView(grade: Grade) {
    setSelectedGrade(grade);
    setModal("view");
  }

  function handleEdit(grade: Grade) {
    setSelectedGrade(grade);
    setModal("edit");
  }

  function handleDelete(grade: Grade) {
    setSelectedGrade(grade);
    setModal("delete");
  }

  function handleCloseModal() {
    if (
      createGrade.isPending ||
      updateGrade.isPending ||
      deleteGrade.isPending
    ) {
      return;
    }

    setModal(null);
    setSelectedGrade(null);
  }

  function handleCreateSubmit(data: GradeFormValues) {
    createGrade.mutate(
      {
        name: data.name,
        description: data.description || null,
      },
      {
        onSuccess: () => {
          setModal(null);
          setSelectedGrade(null);
        },
      },
    );
  }

  function handleUpdateSubmit(data: GradeFormValues) {
    if (!selectedGrade) {
      return;
    }

    updateGrade.mutate(
      {
        id: selectedGrade.id,
        request: {
          name: data.name,
          description: data.description || null,
        },
      },
      {
        onSuccess: () => {
          setModal(null);
          setSelectedGrade(null);
        },
      },
    );
  }

  function handleConfirmDelete() {
    if (!selectedGrade) {
      return;
    }

    deleteGrade.mutate(selectedGrade.id, {
      onSuccess: () => {
        setModal(null);
        setSelectedGrade(null);

        if (grades.length === 1 && pageNumber > 1) {
          setPageNumber((current) => current - 1);
        }
      },
    });
  }

  function handlePreviousPage() {
    setPageNumber((current) => Math.max(1, current - 1));
  }

  function handleNextPage() {
    setPageNumber((current) => Math.min(totalPages, current + 1));
  }

  return (
    <div className="space-y-6">
      {/* Page header */}
      <div className="flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
        <div>
          <h1 className="text-2xl font-bold text-slate-900">Grades</h1>

          <p className="mt-1 text-sm text-slate-500">
            Manage the grade levels in your school.
          </p>
        </div>

        <button
          type="button"
          onClick={handleCreate}
          className="inline-flex items-center justify-center gap-2 rounded-lg bg-rose-950 px-4 py-2.5 text-sm font-medium text-white transition hover:bg-rose-900"
        >
          <Plus className="h-4 w-4" />
          Create Grade
        </button>
      </div>

      {/* Search */}
      <div className="rounded-xl border border-slate-200 bg-white p-4">
        <form
          onSubmit={handleSearch}
          className="flex flex-col gap-3 sm:flex-row"
        >
          <div className="relative flex-1">
            <Search className="pointer-events-none absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-slate-400" />

            <input
              type="text"
              value={searchInput}
              onChange={(event) => setSearchInput(event.target.value)}
              placeholder="Search grades..."
              className="w-full rounded-lg border border-slate-300 py-2.5 pl-9 pr-3 text-sm outline-none transition focus:border-rose-700"
            />
          </div>

          <button
            type="submit"
            className="inline-flex items-center justify-center gap-2 rounded-lg bg-slate-900 px-5 py-2.5 text-sm font-medium text-white transition hover:bg-slate-800"
          >
            <Search className="h-4 w-4" />
            Search
          </button>

          {search && (
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

          <p className="mt-3 text-sm text-slate-500">Loading grades...</p>
        </div>
      ) : (
        <>
          <GradeTable
            grades={grades}
            onView={handleView}
            onEdit={handleEdit}
            onDelete={handleDelete}
          />

          {/* Pagination */}
          {totalCount > 0 && (
            <div className="flex flex-col gap-3 sm:flex-row sm:items-center sm:justify-between">
              <p className="text-sm text-slate-500">
                Page {pageNumber} of {totalPages} · {totalCount}{" "}
                {totalCount === 1 ? "grade" : "grades"}
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

      {/* Create/Edit Modal */}
      <GradeFormModal
        isOpen={modal === "create" || modal === "edit"}
        mode={modal === "edit" ? "edit" : "create"}
        grade={modal === "edit" ? gradeDetails : null}
        isSubmitting={createGrade.isPending || updateGrade.isPending}
        onClose={handleCloseModal}
        onSubmit={modal === "edit" ? handleUpdateSubmit : handleCreateSubmit}
      />

      {/* View Modal */}
      <GradeViewModal
        isOpen={modal === "view"}
        grade={gradeDetails}
        isLoading={isGradeLoading}
        onClose={handleCloseModal}
      />

      {/* Delete Modal */}
      <DeleteGradeDialog
        isOpen={modal === "delete"}
        gradeName={selectedGrade?.name}
        isDeleting={deleteGrade.isPending}
        onClose={handleCloseModal}
        onConfirm={handleConfirmDelete}
      />
    </div>
  );
}
