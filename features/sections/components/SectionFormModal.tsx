import { zodResolver } from "@hookform/resolvers/zod";
import { Loader2, Search, X } from "lucide-react";
import { useEffect, useState } from "react";
import { useForm } from "react-hook-form";
import { z } from "zod";

import { toastService } from "../../../app/services/toastService";

import { useTeachers } from "../../teachers/hooks/useTeachers";
import { useGrades } from "../../grades/hooks/useGrades";

import { useCreateSection } from "../hooks/useCreateSection";
import { useUpdateSection } from "../hooks/useUpdateSection";
import { sectionSchema } from "../schema/sectionSchema";
import type { SectionDetails } from "../types/section";

interface SectionFormModalProps {
  isOpen: boolean;
  section: SectionDetails | null;
  onClose: () => void;
}

export function SectionFormModal({
  isOpen,
  section,
  onClose,
}: SectionFormModalProps) {
  const isEdit = Boolean(section);

  const [teacherSearch, setTeacherSearch] = useState("");
  const [teacherSearchTriggered, setTeacherSearchTriggered] = useState("");

  const [selectedTeacherName, setSelectedTeacherName] = useState("");

  const { data: teacherData, isFetching: isSearchingTeachers } = useTeachers(
    {
      name: teacherSearchTriggered || undefined,
      pageNumber: 1,
      pageSize: 10,
    },
    Boolean(teacherSearchTriggered),
  );

  const { data: gradesData, isLoading: isLoadingGrades } = useGrades({
    pageNumber: 1,
    pageSize: 100,
  });

  const createSection = useCreateSection();
  const updateSection = useUpdateSection();

  const {
    register,
    handleSubmit,
    setValue,
    reset,
    formState: { errors },
  } = useForm<z.infer<typeof sectionSchema>>({
    resolver: zodResolver(sectionSchema),
    defaultValues: {
      name: "",
      assignedTeacherId: "",
      gradeId: 0,
    },
  });

  useEffect(() => {
    if (!isOpen) {
      return;
    }

    if (section) {
      reset({
        name: section.name,
        assignedTeacherId: section.assignedTeacherId,
        gradeId: section.gradeId,
      });

      setSelectedTeacherName(section.assignedTeacherName);
    } else {
      reset({
        name: "",
        assignedTeacherId: "",
        gradeId: 0,
      });

      setSelectedTeacherName("");
    }

    setTeacherSearch("");
    setTeacherSearchTriggered("");
  }, [isOpen, section, reset]);

  const handleTeacherSearch = () => {
    const search = teacherSearch.trim();

    if (!search) {
      toastService.error(new Error("Please enter a teacher name to search."));

      return;
    }

    setTeacherSearchTriggered(search);
  };

  const handleTeacherSelect = (id: string, name: string) => {
    setValue("assignedTeacherId", id, {
      shouldValidate: true,
      shouldDirty: true,
    });

    setSelectedTeacherName(name);

    // Clear the search results after selecting.
    setTeacherSearchTriggered("");
    setTeacherSearch("");
  };

  const onSubmit = async (values: z.infer<typeof sectionSchema>) => {
    try {
      if (section) {
        await updateSection.mutateAsync({
          id: section.id,
          request: values,
        });

        toastService.success("Section updated successfully.");
      } else {
        await createSection.mutateAsync(values);

        toastService.success("Section created successfully.");
      }

      onClose();
    } catch (error) {
      toastService.error(error);
    }
  };

  if (!isOpen) {
    return null;
  }

  const isSubmitting = createSection.isPending || updateSection.isPending;

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/40 p-4">
      <div className="max-h-[90vh] w-full max-w-2xl overflow-y-auto rounded-2xl bg-white shadow-xl">
        {/* Header */}
        <div className="flex items-center justify-between border-b border-slate-200 px-6 py-4">
          <h2 className="text-lg font-semibold text-slate-900">
            {isEdit ? "Edit Section" : "Create Section"}
          </h2>

          <button
            type="button"
            onClick={onClose}
            disabled={isSubmitting}
            className="rounded-lg p-2 text-slate-500 hover:bg-slate-100 disabled:opacity-50"
          >
            <X size={20} />
          </button>
        </div>

        <form onSubmit={handleSubmit(onSubmit)}>
          <div className="space-y-6 p-6">
            {/* Section Name */}
            <div>
              <label className="mb-2 block text-sm font-medium text-slate-700">
                Section Name
              </label>

              <input
                {...register("name")}
                type="text"
                placeholder="Enter section name"
                className="w-full rounded-lg border border-slate-300 px-3 py-2 text-sm outline-none focus:border-rose-700 focus:ring-1 focus:ring-rose-700"
              />

              {errors.name && (
                <p className="mt-1 text-xs text-red-600">
                  {errors.name.message}
                </p>
              )}
            </div>

            {/* Grade */}
            <div>
              <label className="mb-2 block text-sm font-medium text-slate-700">
                Grade
              </label>

              <select
                {...register("gradeId", {
                  valueAsNumber: true,
                })}
                disabled={isLoadingGrades}
                className="w-full rounded-lg border border-slate-300 px-3 py-2 text-sm outline-none focus:border-rose-700 focus:ring-1 focus:ring-rose-700 disabled:bg-slate-100"
              >
                <option value={0}>Select a grade</option>

                {gradesData?.results.map((grade) => (
                  <option key={grade.id} value={grade.id}>
                    {grade.name}
                  </option>
                ))}
              </select>

              {errors.gradeId && (
                <p className="mt-1 text-xs text-red-600">
                  {errors.gradeId.message}
                </p>
              )}
            </div>

            {/* Assigned Teacher */}
            <div>
              <label className="mb-2 block text-sm font-medium text-slate-700">
                Assigned Teacher
              </label>

              <div className="flex gap-2">
                <input
                  type="text"
                  value={teacherSearch}
                  onChange={(event) => setTeacherSearch(event.target.value)}
                  onKeyDown={(event) => {
                    if (event.key === "Enter") {
                      event.preventDefault();
                      handleTeacherSearch();
                    }
                  }}
                  placeholder={
                    selectedTeacherName
                      ? selectedTeacherName
                      : "Search teacher..."
                  }
                  className="min-w-0 flex-1 rounded-lg border border-slate-300 px-3 py-2 text-sm outline-none focus:border-rose-700 focus:ring-1 focus:ring-rose-700"
                />

                <button
                  type="button"
                  onClick={handleTeacherSearch}
                  disabled={isSearchingTeachers}
                  className="flex items-center gap-2 rounded-lg bg-rose-950 px-4 py-2 text-sm font-medium text-white hover:bg-rose-900 disabled:cursor-not-allowed disabled:opacity-50"
                >
                  {isSearchingTeachers ? (
                    <Loader2 size={17} className="animate-spin" />
                  ) : (
                    <Search size={17} />
                  )}
                  Search
                </button>
              </div>

              {/* Selected teacher */}
              {selectedTeacherName && (
                <div className="mt-3 rounded-lg border border-rose-200 bg-rose-50 px-4 py-3">
                  <p className="text-xs font-medium text-rose-700">
                    Selected Teacher
                  </p>

                  <p className="mt-1 text-sm font-semibold text-rose-950">
                    {selectedTeacherName}
                  </p>
                </div>
              )}

              {errors.assignedTeacherId && (
                <p className="mt-1 text-xs text-red-600">
                  {errors.assignedTeacherId.message}
                </p>
              )}

              {/* Search results */}
              {teacherSearchTriggered && (
                <div className="mt-3 overflow-hidden rounded-lg border border-slate-200">
                  {teacherData?.results.length === 0 && (
                    <p className="p-4 text-sm text-slate-500">
                      No teachers found.
                    </p>
                  )}

                  {teacherData?.results.map((teacher) => {
                    const fullName = [
                      teacher.firstName,
                      teacher.middleName,
                      teacher.lastName,
                      teacher.extension,
                    ]
                      .filter(Boolean)
                      .join(" ");

                    return (
                      <button
                        key={teacher.id}
                        type="button"
                        onClick={() =>
                          handleTeacherSelect(teacher.id, fullName)
                        }
                        className="block w-full border-b border-slate-200 px-4 py-3 text-left last:border-b-0 hover:bg-slate-50"
                      >
                        <p className="text-sm font-medium text-slate-900">
                          {fullName}
                        </p>

                        <p className="text-xs text-slate-500">
                          {teacher.email}
                        </p>
                      </button>
                    );
                  })}
                </div>
              )}
            </div>
          </div>

          {/* Footer */}
          <div className="flex justify-end gap-3 border-t border-slate-200 px-6 py-4">
            <button
              type="button"
              onClick={onClose}
              disabled={isSubmitting}
              className="rounded-lg border border-slate-300 px-4 py-2 text-sm font-medium text-slate-700 hover:bg-slate-50 disabled:opacity-50"
            >
              Cancel
            </button>

            <button
              type="submit"
              disabled={isSubmitting}
              className="flex items-center gap-2 rounded-lg bg-rose-950 px-4 py-2 text-sm font-medium text-white hover:bg-rose-900 disabled:cursor-not-allowed disabled:opacity-50"
            >
              {isSubmitting && <Loader2 size={16} className="animate-spin" />}

              {isEdit ? "Save Changes" : "Create Section"}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}
