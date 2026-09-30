import { useEffect, useRef, useState } from "react";

import { zodResolver } from "@hookform/resolvers/zod";
import { ImagePlus, Loader2, X } from "lucide-react";
import { useForm } from "react-hook-form";

import { useGrades } from "../../grades/hooks/useGrades";
import { useSections } from "../../sections/hooks/useSections";

import { studentSchema, type StudentFormValues } from "../schema/studentSchema";

import { useCreateStudent } from "../hooks/useCreateStudent";
import { useUpdateStudent } from "../hooks/useUpdateStudent";

import type { StudentDetails } from "../types/student";

import { toastService } from "~/services/toastService";

interface StudentFormModalProps {
  isOpen: boolean;
  mode: "create" | "edit";
  student?: StudentDetails | null;
  onClose: () => void;
  onCreated?: (student: StudentDetails) => void;
  onUpdated?: () => void;
}

const LOOKUP_PAGE_SIZE = 100;

export function StudentFormModal({
  isOpen,
  mode,
  student,
  onClose,
  onCreated,
  onUpdated,
}: StudentFormModalProps) {
  const createStudent = useCreateStudent();
  const updateStudent = useUpdateStudent();

  const isSubmitting = createStudent.isPending || updateStudent.isPending;

  const [selectedGrade, setSelectedGrade] = useState("");

  const [selectedPicture, setSelectedPicture] = useState<File | null>(null);
  const [picturePreview, setPicturePreview] = useState<string | null>(null);

  const pictureInputRef = useRef<HTMLInputElement>(null);

  const {
    register,
    handleSubmit,
    reset,
    formState: { errors },
  } = useForm<StudentFormValues>({
    resolver: zodResolver(studentSchema),
    defaultValues: {
      lrn: "",
      firstName: "",
      middleName: "",
      lastName: "",
      extension: "",
      parentMobileNo: "",
      parentEmail: "",
      studentPicUrl: "",
      sectionId: 0,
    },
  });

  const { data: gradesData, isLoading: isGradesLoading } = useGrades({
    pageNumber: 1,
    pageSize: LOOKUP_PAGE_SIZE,
  });

  const { data: sectionsData, isLoading: isSectionsLoading } = useSections({
    pageNumber: 1,
    pageSize: LOOKUP_PAGE_SIZE,
    ...(selectedGrade ? { gradeName: selectedGrade } : {}),
  });

  const grades = gradesData?.results ?? [];
  const sections = sectionsData?.results ?? [];

  useEffect(() => {
    if (!isOpen) {
      return;
    }

    if (mode === "edit" && student) {
      setSelectedGrade(student.gradeName);

      reset({
        lrn: student.lrn,
        firstName: student.firstName,
        middleName: student.middleName ?? "",
        lastName: student.lastName,
        extension: student.extension ?? "",
        parentMobileNo: student.parentMobileNo,
        parentEmail: student.parentEmail ?? "",
        studentPicUrl: student.studentPicUrl ?? "",
        sectionId: student.sectionId,
      });

      setSelectedPicture(null);
      setPicturePreview(student.studentPicUrl || null);
    } else {
      setSelectedGrade("");

      reset({
        lrn: "",
        firstName: "",
        middleName: "",
        lastName: "",
        extension: "",
        parentMobileNo: "",
        parentEmail: "",
        studentPicUrl: "",
        sectionId: 0,
      });

      setSelectedPicture(null);
      setPicturePreview(null);
    }
  }, [isOpen, mode, student, reset]);

  useEffect(() => {
    if (!isOpen || !selectedGrade) {
      return;
    }

    if (mode === "create") {
      reset(
        (currentValues) => ({
          ...currentValues,
          sectionId: 0,
        }),
        {
          keepErrors: true,
        },
      );
    }
  }, [selectedGrade, isOpen, mode, reset]);

  function handlePictureChange(event: React.ChangeEvent<HTMLInputElement>) {
    const file = event.target.files?.[0];

    if (!file) {
      return;
    }

    if (!file.type.startsWith("image/")) {
      return;
    }

    setSelectedPicture(file);

    if (picturePreview?.startsWith("blob:")) {
      URL.revokeObjectURL(picturePreview);
    }

    setPicturePreview(URL.createObjectURL(file));
  }

  function handleRemovePicture() {
    if (picturePreview?.startsWith("blob:")) {
      URL.revokeObjectURL(picturePreview);
    }

    setSelectedPicture(null);
    setPicturePreview(null);

    if (pictureInputRef.current) {
      pictureInputRef.current.value = "";
    }
  }

  async function onSubmit(data: StudentFormValues) {
    try {
      if (mode === "create") {
        const createdStudent = await createStudent.mutateAsync({
          lrn: data.lrn,
          firstName: data.firstName,
          middleName: data.middleName || null,
          lastName: data.lastName,
          extension: data.extension || null,
          parentMobileNo: data.parentMobileNo,
          parentEmail: data.parentEmail || null,
          studentPicUrl: data.studentPicUrl || null,
          sectionId: data.sectionId,
        });

        toastService.success("Student created successfully.");

        onCreated?.(createdStudent);
        return;
      }

      if (!student) {
        return;
      }

      await updateStudent.mutateAsync({
        id: student.id,
        request: {
          lrn: data.lrn,
          firstName: data.firstName,
          middleName: data.middleName || null,
          lastName: data.lastName,
          extension: data.extension || null,
          parentMobileNo: data.parentMobileNo,
          parentEmail: data.parentEmail || null,
          studentPicUrl: data.studentPicUrl || null,
          sectionId: data.sectionId,
        },
      });

      toastService.success("Student updated successfully.");

      onUpdated?.();
    } catch (error) {
      toastService.error(error);
    }
  }

  if (!isOpen) {
    return null;
  }

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/50 p-4">
      <div className="max-h-[90vh] w-full max-w-2xl overflow-y-auto rounded-xl bg-white shadow-xl">
        {/* Header */}
        <div className="flex items-center justify-between border-b border-slate-200 px-6 py-4">
          <div>
            <h2 className="text-lg font-semibold text-slate-900">
              {mode === "create" ? "Create Student" : "Edit Student"}
            </h2>

            <p className="mt-1 text-sm text-slate-500">
              {mode === "create"
                ? "Add a new student."
                : "Update the student information."}
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
        <form onSubmit={handleSubmit(onSubmit)} className="space-y-6 p-6">
          {/* Student Information */}
          <div>
            <h3 className="text-sm font-semibold text-slate-900">
              Student Information
            </h3>

            <p className="mt-1 text-sm text-slate-500">
              Enter the student's basic information.
            </p>
          </div>

          {/* LRN */}
          <div>
            <label
              htmlFor="student-lrn"
              className="mb-1.5 block text-sm font-medium text-slate-700"
            >
              LRN
            </label>

            <input
              id="student-lrn"
              type="text"
              placeholder="Enter learner reference number"
              {...register("lrn")}
              disabled={isSubmitting}
              className={`w-full rounded-lg border px-3 py-2.5 text-sm outline-none transition ${
                errors.lrn
                  ? "border-red-400 focus:border-red-500"
                  : "border-slate-300 focus:border-rose-700"
              } disabled:cursor-not-allowed disabled:bg-slate-100`}
            />

            {errors.lrn && (
              <p className="mt-1 text-sm text-red-600">{errors.lrn.message}</p>
            )}
          </div>

          {/* Name */}
          <div className="grid gap-4 sm:grid-cols-2">
            {/* First Name */}
            <div>
              <label
                htmlFor="student-first-name"
                className="mb-1.5 block text-sm font-medium text-slate-700"
              >
                First Name
              </label>

              <input
                id="student-first-name"
                type="text"
                placeholder="e.g. Juan"
                {...register("firstName")}
                disabled={isSubmitting}
                className={`w-full rounded-lg border px-3 py-2.5 text-sm outline-none transition ${
                  errors.firstName
                    ? "border-red-400 focus:border-red-500"
                    : "border-slate-300 focus:border-rose-700"
                } disabled:cursor-not-allowed disabled:bg-slate-100`}
              />

              {errors.firstName && (
                <p className="mt-1 text-sm text-red-600">
                  {errors.firstName.message}
                </p>
              )}
            </div>

            {/* Middle Name */}
            <div>
              <label
                htmlFor="student-middle-name"
                className="mb-1.5 block text-sm font-medium text-slate-700"
              >
                Middle Name
              </label>

              <input
                id="student-middle-name"
                type="text"
                placeholder="Optional"
                {...register("middleName")}
                disabled={isSubmitting}
                className={`w-full rounded-lg border px-3 py-2.5 text-sm outline-none transition ${
                  errors.middleName
                    ? "border-red-400 focus:border-red-500"
                    : "border-slate-300 focus:border-rose-700"
                } disabled:cursor-not-allowed disabled:bg-slate-100`}
              />

              {errors.middleName && (
                <p className="mt-1 text-sm text-red-600">
                  {errors.middleName.message}
                </p>
              )}
            </div>

            {/* Last Name */}
            <div>
              <label
                htmlFor="student-last-name"
                className="mb-1.5 block text-sm font-medium text-slate-700"
              >
                Last Name
              </label>

              <input
                id="student-last-name"
                type="text"
                placeholder="e.g. Dela Cruz"
                {...register("lastName")}
                disabled={isSubmitting}
                className={`w-full rounded-lg border px-3 py-2.5 text-sm outline-none transition ${
                  errors.lastName
                    ? "border-red-400 focus:border-red-500"
                    : "border-slate-300 focus:border-rose-700"
                } disabled:cursor-not-allowed disabled:bg-slate-100`}
              />

              {errors.lastName && (
                <p className="mt-1 text-sm text-red-600">
                  {errors.lastName.message}
                </p>
              )}
            </div>

            {/* Extension */}
            <div>
              <label
                htmlFor="student-extension"
                className="mb-1.5 block text-sm font-medium text-slate-700"
              >
                Extension
              </label>

              <input
                id="student-extension"
                type="text"
                placeholder="e.g. Jr."
                {...register("extension")}
                disabled={isSubmitting}
                className={`w-full rounded-lg border px-3 py-2.5 text-sm outline-none transition ${
                  errors.extension
                    ? "border-red-400 focus:border-red-500"
                    : "border-slate-300 focus:border-rose-700"
                } disabled:cursor-not-allowed disabled:bg-slate-100`}
              />

              {errors.extension && (
                <p className="mt-1 text-sm text-red-600">
                  {errors.extension.message}
                </p>
              )}
            </div>
          </div>

          {/* Parent Information */}
          <div className="border-t border-slate-200 pt-6">
            <h3 className="text-sm font-semibold text-slate-900">
              Parent / Guardian Information
            </h3>

            <p className="mt-1 text-sm text-slate-500">
              Enter the parent or guardian's contact information.
            </p>
          </div>

          <div className="grid gap-4 sm:grid-cols-2">
            {/* Parent Mobile */}
            <div>
              <label
                htmlFor="student-parent-mobile"
                className="mb-1.5 block text-sm font-medium text-slate-700"
              >
                Parent Mobile Number
              </label>

              <input
                id="student-parent-mobile"
                type="tel"
                placeholder="e.g. 09171234567"
                {...register("parentMobileNo")}
                disabled={isSubmitting}
                className={`w-full rounded-lg border px-3 py-2.5 text-sm outline-none transition ${
                  errors.parentMobileNo
                    ? "border-red-400 focus:border-red-500"
                    : "border-slate-300 focus:border-rose-700"
                } disabled:cursor-not-allowed disabled:bg-slate-100`}
              />

              {errors.parentMobileNo && (
                <p className="mt-1 text-sm text-red-600">
                  {errors.parentMobileNo.message}
                </p>
              )}
            </div>

            {/* Parent Email */}
            <div>
              <label
                htmlFor="student-parent-email"
                className="mb-1.5 block text-sm font-medium text-slate-700"
              >
                Parent Email
              </label>

              <input
                id="student-parent-email"
                type="email"
                placeholder="e.g. parent@example.com | optional"
                {...register("parentEmail")}
                disabled={isSubmitting}
                className={`w-full rounded-lg border px-3 py-2.5 text-sm outline-none transition ${
                  errors.parentEmail
                    ? "border-red-400 focus:border-red-500"
                    : "border-slate-300 focus:border-rose-700"
                } disabled:cursor-not-allowed disabled:bg-slate-100`}
              />

              {errors.parentEmail && (
                <p className="mt-1 text-sm text-red-600">
                  {errors.parentEmail.message}
                </p>
              )}
            </div>
          </div>

          {/* Student Picture */}
          <div className="rounded-xl border border-slate-200 bg-white p-6 shadow-sm">
            <div>
              <h3 className="text-base font-semibold text-rose-950">
                Profile Picture
              </h3>

              <p className="mt-1 text-sm text-slate-500">
                Optional. Maximum file size is 10 MB.
              </p>
            </div>

            <div className="mt-5 flex items-center gap-4">
              <div className="flex h-24 w-24 shrink-0 items-center justify-center overflow-hidden rounded-full bg-rose-100">
                {picturePreview ? (
                  <img
                    src={picturePreview}
                    alt="Student preview"
                    className="h-full w-full object-cover"
                  />
                ) : (
                  <ImagePlus className="h-9 w-9 text-rose-400" />
                )}
              </div>

              <div>
                <input
                  ref={pictureInputRef}
                  type="file"
                  accept="image/*"
                  onChange={handlePictureChange}
                  disabled={isSubmitting}
                  className="hidden"
                />

                <button
                  type="button"
                  onClick={() => pictureInputRef.current?.click()}
                  disabled={isSubmitting}
                  className="inline-flex items-center gap-2 rounded-lg border border-rose-300 bg-rose-50 px-4 py-2.5 text-sm font-medium text-rose-900 transition hover:bg-rose-100 disabled:cursor-not-allowed disabled:opacity-50"
                >
                  <ImagePlus className="h-4 w-4" />
                  {picturePreview ? "Change Photo" : "Choose Photo"}
                </button>

                {picturePreview && (
                  <button
                    type="button"
                    onClick={handleRemovePicture}
                    disabled={isSubmitting}
                    className="ml-2 rounded-lg px-3 py-2.5 text-sm font-medium text-slate-500 transition hover:bg-red-50 hover:text-red-600 disabled:cursor-not-allowed disabled:opacity-50"
                  >
                    Remove
                  </button>
                )}
              </div>
            </div>

            {errors.studentPicUrl && (
              <p className="mt-2 text-sm text-red-600">
                {errors.studentPicUrl.message}
              </p>
            )}
          </div>

          {/* Section Assignment */}
          <div className="border-t border-slate-200 pt-6">
            <h3 className="text-sm font-semibold text-slate-900">
              Section Assignment
            </h3>

            <p className="mt-1 text-sm text-slate-500">
              Select the student's grade and section.
            </p>
          </div>

          <div className="grid gap-4 sm:grid-cols-2">
            {/* Grade */}
            <div>
              <label
                htmlFor="student-grade"
                className="mb-1.5 block text-sm font-medium text-slate-700"
              >
                Grade
              </label>

              <select
                id="student-grade"
                value={selectedGrade}
                onChange={(event) => setSelectedGrade(event.target.value)}
                disabled={isSubmitting || isGradesLoading}
                className="w-full rounded-lg border border-slate-300 bg-white px-3 py-2.5 text-sm outline-none transition focus:border-rose-700 disabled:cursor-not-allowed disabled:bg-slate-100"
              >
                <option value="">
                  {isGradesLoading ? "Loading grades..." : "Select a grade"}
                </option>

                {grades.map((grade) => (
                  <option key={grade.id} value={grade.name}>
                    {grade.name}
                  </option>
                ))}
              </select>
            </div>

            {/* Section */}
            <div>
              <label
                htmlFor="student-section"
                className="mb-1.5 block text-sm font-medium text-slate-700"
              >
                Section
              </label>

              <select
                id="student-section"
                {...register("sectionId", {
                  valueAsNumber: true,
                })}
                disabled={isSubmitting || isSectionsLoading || !selectedGrade}
                className={`w-full rounded-lg border px-3 py-2.5 text-sm outline-none transition ${
                  errors.sectionId
                    ? "border-red-400 focus:border-red-500"
                    : "border-slate-300 focus:border-rose-700"
                } disabled:cursor-not-allowed disabled:bg-slate-100`}
              >
                <option value={0}>
                  {isSectionsLoading
                    ? "Loading sections..."
                    : !selectedGrade
                      ? "Select a grade first"
                      : "Select a section"}
                </option>

                {sections.map((section) => (
                  <option key={section.id} value={section.id}>
                    {section.name}
                  </option>
                ))}
              </select>

              {errors.sectionId && (
                <p className="mt-1 text-sm text-red-600">
                  {errors.sectionId.message}
                </p>
              )}
            </div>
          </div>

          {/* Footer */}
          <div className="flex justify-end gap-3 border-t border-slate-200 pt-6">
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
              className="inline-flex items-center gap-2 rounded-lg bg-rose-950 px-4 py-2.5 text-sm font-medium text-white transition hover:bg-rose-900 disabled:cursor-not-allowed disabled:opacity-70"
            >
              {isSubmitting && <Loader2 className="h-4 w-4 animate-spin" />}

              {mode === "create" ? "Create Student" : "Save Changes"}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}
