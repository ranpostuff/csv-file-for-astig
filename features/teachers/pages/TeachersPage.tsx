import { useState } from "react";
import { Plus, Search, Eye, Pencil, Trash2 } from "lucide-react";
import { useTeachers } from "../hooks/useTeachers";
import { TeacherTable } from "../components/TeacherTable";
import type { TeacherListParams } from "../types/teacher";
import { useNavigate } from "react-router";
// import { Pagination } from "../../../components/ui/Pagination";
import { useDeleteTeacher } from "../hooks/useDeleteTeacher";
export default function TeachersPage() {
  // console.log(import.meta.env.VITE_API_URL);
  const navigate = useNavigate();

  const { deleteTeacher, isPending: isDeleting } = useDeleteTeacher();

  const [filters, setFilters] = useState({
    name: "",
    address: "",
  });

  const [params, setParams] = useState<TeacherListParams>({
    pageNumber: 1,
    pageSize: 3,
  });
  const { data, isPending, isError } = useTeachers(params);

  const handleSearch = () => {
    setParams((current) => ({
      ...current,
      name: filters.name || undefined,
      address: filters.address || undefined,
      pageNumber: 1,
    }));
  };

  const handlePageChange = (pageNumber: number) => {
    setParams((current) => ({
      ...current,
      pageNumber,
    }));
  };

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
        <div>
          <h1 className="text-2xl font-bold tracking-tight text-rose-950">
            Teachers
          </h1>

          <p className="mt-1 text-sm text-slate-500">
            Manage teachers and their information.
          </p>
        </div>

        <button
          type="button"
          onClick={() => navigate("/teachers/create")}
          className="
            inline-flex items-center justify-center gap-2
            rounded-lg bg-rose-950
            px-4 py-2.5
            text-sm font-semibold text-white
            shadow-sm
            transition-colors
            hover:bg-rose-900
          "
        >
          <Plus className="h-4 w-4" />
          Add Teacher
        </button>
      </div>

      {/* Filters */}
      <div className="rounded-xl border border-slate-200 bg-white p-4 shadow-sm">
        <div className="flex flex-col gap-4 lg:flex-row lg:items-end">
          {/* Name */}
          <div className="flex-1">
            <label
              htmlFor="teacher-name"
              className="mb-1.5 block text-sm font-medium text-slate-700"
            >
              Name
            </label>

            <input
              id="teacher-name"
              type="text"
              placeholder="Search by name..."
              value={filters.name}
              onChange={(event) =>
                setFilters((current) => ({
                  ...current,
                  name: event.target.value,
                }))
              }
              className="
                w-full rounded-lg border border-slate-300
                bg-white px-3 py-2.5
                text-sm text-slate-900
                outline-none
                transition
                placeholder:text-slate-400
                focus:border-rose-500
                focus:ring-2 focus:ring-rose-500/20
              "
            />
          </div>

          {/* Address */}
          <div className="flex-1">
            <label
              htmlFor="teacher-address"
              className="mb-1.5 block text-sm font-medium text-slate-700"
            >
              Address
            </label>

            <input
              id="teacher-address"
              type="text"
              placeholder="Search by address..."
              value={filters.address}
              onChange={(event) =>
                setFilters((current) => ({
                  ...current,
                  address: event.target.value,
                }))
              }
              className="
                w-full rounded-lg border border-slate-300
                bg-white px-3 py-2.5
                text-sm text-slate-900
                outline-none
                transition
                placeholder:text-slate-400
                focus:border-rose-500
                focus:ring-2 focus:ring-rose-500/20
              "
            />
          </div>

          {/* Search */}
          <button
            type="button"
            onClick={handleSearch}
            disabled={isPending}
            className="
              inline-flex items-center justify-center gap-2
              rounded-lg bg-rose-950
              px-5 py-2.5
              text-sm font-semibold text-white
              transition-colors
              hover:bg-rose-900
              disabled:cursor-not-allowed
              disabled:opacity-50
            "
          >
            <Search className="h-4 w-4" />
            Search
          </button>
        </div>
      </div>

      {/* Error */}
      {isError && (
        <div className="rounded-xl border border-red-200 bg-red-50 p-4 text-sm text-red-700">
          Failed to load teachers.
        </div>
      )}

      {/* Table */}
      <TeacherTable
        teachers={data?.results ?? []}
        isLoading={isPending}
        onEdit={(teacher) => {
          navigate(`/teachers/${teacher.id}/edit`);
        }}
        onView={(teacher) => {
          navigate(`/teachers/${teacher.id}`);
        }}
        onDelete={(teacher) => {
          const confirmed = window.confirm(
            `Are you sure you want to delete ${teacher.firstName} ${teacher.lastName}?`,
          );

          if (!confirmed) {
            return;
          }

          deleteTeacher(teacher.id);
        }}
      />

      {/* Pagination */}
      {data && data.totalPages > 1 && (
        <div className="flex items-center justify-between">
          <p className="text-sm text-slate-500">
            Page {data.pageNumber} of {data.totalPages}
          </p>

          <div className="flex gap-2">
            <button
              type="button"
              disabled={data.pageNumber <= 1 || isPending}
              onClick={() => handlePageChange(data.pageNumber - 1)}
              className="
                rounded-lg border border-slate-300
                px-3 py-2
                text-sm font-medium text-slate-700
                hover:bg-slate-50
                disabled:cursor-not-allowed
                disabled:opacity-50
              "
            >
              Previous
            </button>

            <button
              type="button"
              disabled={data.pageNumber >= data.totalPages || isPending}
              onClick={() => handlePageChange(data.pageNumber + 1)}
              className="
                rounded-lg border border-slate-300
                px-3 py-2
                text-sm font-medium text-slate-700
                hover:bg-slate-50
                disabled:cursor-not-allowed
                disabled:opacity-50
              "
            >
              Next
            </button>
          </div>
        </div>
      )}
    </div>
  );
}
