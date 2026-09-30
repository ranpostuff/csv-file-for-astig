import { useEffect } from "react";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { X, Loader2 } from "lucide-react";

import { gradeSchema, type GradeFormValues } from "../schema/gradeSchema";
import type { GradeResponse } from "../types/grade";

interface GradeFormModalProps {
  isOpen: boolean;
  mode: "create" | "edit";
  grade?: GradeResponse | null;
  isSubmitting: boolean;
  onClose: () => void;
  onSubmit: (data: GradeFormValues) => void;
}

export function GradeFormModal({
  isOpen,
  mode,
  grade,
  isSubmitting,
  onClose,
  onSubmit,
}: GradeFormModalProps) {
  const {
    register,
    handleSubmit,
    reset,
    formState: { errors },
  } = useForm<GradeFormValues>({
    resolver: zodResolver(gradeSchema),
    defaultValues: {
      name: "",
      description: "",
    },
  });

  useEffect(() => {
    if (!isOpen) {
      return;
    }

    if (mode === "edit" && grade) {
      reset({
        name: grade.name,
        description: grade.description ?? "",
      });
    } else {
      reset({
        name: "",
        description: "",
      });
    }
  }, [isOpen, mode, grade, reset]);

  if (!isOpen) {
    return null;
  }

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/50 p-4">
      <div className="w-full max-w-lg rounded-xl bg-white shadow-xl">
        {/* Header */}
        <div className="flex items-center justify-between border-b border-slate-200 px-6 py-4">
          <div>
            <h2 className="text-lg font-semibold text-slate-900">
              {mode === "create" ? "Create Grade" : "Edit Grade"}
            </h2>

            <p className="mt-1 text-sm text-slate-500">
              {mode === "create"
                ? "Add a new grade."
                : "Update the grade information."}
            </p>
          </div>

          <button
            type="button"
            onClick={onClose}
            disabled={isSubmitting}
            className="rounded-lg p-2 text-slate-500 transition hover:bg-slate-100 hover:text-slate-700 disabled:cursor-not-allowed disabled:opacity-50"
          >
            <X className="h-5 w-5" />
          </button>
        </div>

        {/* Form */}
        <form onSubmit={handleSubmit(onSubmit)} className="space-y-5 p-6">
          {/* Name */}
          <div>
            <label
              htmlFor="grade-name"
              className="mb-1.5 block text-sm font-medium text-slate-700"
            >
              Name
            </label>

            <input
              id="grade-name"
              type="text"
              placeholder="e.g. Grade 7"
              {...register("name")}
              disabled={isSubmitting}
              className={`w-full rounded-lg border px-3 py-2.5 text-sm outline-none transition ${
                errors.name
                  ? "border-red-400 focus:border-red-500"
                  : "border-slate-300 focus:border-rose-700"
              } disabled:cursor-not-allowed disabled:bg-slate-100`}
            />

            {errors.name && (
              <p className="mt-1 text-sm text-red-600">{errors.name.message}</p>
            )}
          </div>

          {/* Description */}
          <div>
            <label
              htmlFor="grade-description"
              className="mb-1.5 block text-sm font-medium text-slate-700"
            >
              Description
            </label>

            <textarea
              id="grade-description"
              rows={4}
              placeholder="Enter a description..."
              {...register("description")}
              disabled={isSubmitting}
              className={`w-full resize-none rounded-lg border px-3 py-2.5 text-sm outline-none transition ${
                errors.description
                  ? "border-red-400 focus:border-red-500"
                  : "border-slate-300 focus:border-rose-700"
              } disabled:cursor-not-allowed disabled:bg-slate-100`}
            />

            {errors.description && (
              <p className="mt-1 text-sm text-red-600">
                {errors.description.message}
              </p>
            )}
          </div>

          {/* Actions */}
          <div className="flex justify-end gap-3 border-t border-slate-200 pt-5">
            <button
              type="button"
              onClick={onClose}
              disabled={isSubmitting}
              className="rounded-lg border border-slate-300 px-4 py-2.5 text-sm font-medium text-slate-700 transition hover:bg-slate-50 disabled:cursor-not-allowed disabled:opacity-50"
            >
              Cancel
            </button>

            <button
              type="submit"
              disabled={isSubmitting}
              className="inline-flex items-center justify-center gap-2 rounded-lg bg-rose-950 px-4 py-2.5 text-sm font-medium text-white transition hover:bg-rose-900 disabled:cursor-not-allowed disabled:opacity-70"
            >
              {isSubmitting && <Loader2 className="h-4 w-4 animate-spin" />}

              {mode === "create" ? "Create Grade" : "Save Changes"}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}
