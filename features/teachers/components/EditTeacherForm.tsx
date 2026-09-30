import { useForm, type UseFormRegisterReturn } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";

import type { Teacher, UpdateTeacherRequest } from "../types/teacher";
import {
  updateTeacherSchema,
  type UpdateTeacherFormValues,
} from "../schema/teacherSchema";

type EditTeacherFormProps = {
  teacher: Teacher;
  onSubmit: (request: UpdateTeacherRequest) => void;
  onCancel: () => void;
  isPending?: boolean;
};

export function EditTeacherForm({
  teacher,
  onSubmit,
  onCancel,
  isPending = false,
}: EditTeacherFormProps) {
  const {
    register,
    handleSubmit,
    formState: { errors },
  } = useForm<UpdateTeacherFormValues>({
    resolver: zodResolver(updateTeacherSchema),

    defaultValues: {
      firstName: teacher.firstName,
      middleName: teacher.middleName ?? "",
      lastName: teacher.lastName,
      extension: teacher.extension ?? "",
      address: teacher.address,
      dateOfBirth: teacher.dateOfBirth
        ? teacher.dateOfBirth.substring(0, 10)
        : "",
      profilePictureUrl: teacher.profilePictureUrl,
    },
  });

  const handleFormSubmit = (values: UpdateTeacherFormValues) => {
    const request: UpdateTeacherRequest = {
      firstName: values.firstName,
      middleName: values.middleName || null,
      lastName: values.lastName,
      extension: values.extension || null,
      address: values.address,
      dateOfBirth: values.dateOfBirth,
      profilePictureUrl: teacher.profilePictureUrl,
    };

    onSubmit(request);
  };

  return (
    <form onSubmit={handleSubmit(handleFormSubmit)} className="space-y-6">
      {/* Account information */}
      <section className="rounded-xl border border-slate-200 bg-white p-6 shadow-sm">
        <h2 className="text-lg font-semibold text-rose-950">
          Account Information
        </h2>

        <p className="mt-1 text-sm text-slate-500">Email cannot be changed.</p>

        <div className="mt-4">
          <label className="mb-1.5 block text-sm font-medium text-slate-700">
            Email
          </label>

          <input
            type="email"
            value={teacher.email}
            disabled
            className="
              w-full rounded-lg
              border border-slate-300
              bg-slate-100
              px-3 py-2.5
              text-sm text-slate-500
              outline-none
              disabled:cursor-not-allowed
            "
          />
        </div>
      </section>

      {/* Personal information */}
      <section className="rounded-xl border border-slate-200 bg-white p-6 shadow-sm">
        <h2 className="text-lg font-semibold text-rose-950">
          Personal Information
        </h2>

        <div className="mt-4 grid gap-4 md:grid-cols-2">
          <FormField
            label="First Name"
            registration={register("firstName")}
            error={errors.firstName?.message}
            disabled={isPending}
          />

          <FormField
            label="Middle Name"
            registration={register("middleName")}
            error={errors.middleName?.message}
            disabled={isPending}
          />

          <FormField
            label="Last Name"
            registration={register("lastName")}
            error={errors.lastName?.message}
            disabled={isPending}
          />

          <FormField
            label="Extension"
            placeholder="Jr., Sr., III..."
            registration={register("extension")}
            error={errors.extension?.message}
            disabled={isPending}
          />

          <FormField
            label="Date of Birth"
            type="date"
            registration={register("dateOfBirth")}
            error={errors.dateOfBirth?.message}
            disabled={isPending}
          />

          <FormField
            label="Address"
            registration={register("address")}
            error={errors.address?.message}
            disabled={isPending}
          />
        </div>
      </section>

      {/* Actions */}
      <div className="flex justify-end gap-3">
        <button
          type="button"
          onClick={onCancel}
          disabled={isPending}
          className="
            rounded-lg border border-slate-300
            px-4 py-2.5
            text-sm font-semibold text-slate-700
            hover:bg-slate-50
            disabled:cursor-not-allowed
            disabled:opacity-50
          "
        >
          Cancel
        </button>

        <button
          type="submit"
          disabled={isPending}
          className="
            rounded-lg bg-rose-950
            px-5 py-2.5
            text-sm font-semibold text-white
            shadow-sm
            transition-colors
            hover:bg-rose-900
            disabled:cursor-not-allowed
            disabled:opacity-50
          "
        >
          {isPending ? "Saving..." : "Save Changes"}
        </button>
      </div>
    </form>
  );
}

type FormFieldProps = {
  label: string;
  registration: UseFormRegisterReturn;
  error?: string;
  type?: string;
  placeholder?: string;
  disabled?: boolean;
};

function FormField({
  label,
  registration,
  error,
  type = "text",
  placeholder,
  disabled,
}: FormFieldProps) {
  return (
    <div>
      <label className="mb-1.5 block text-sm font-medium text-slate-700">
        {label}
      </label>

      <input
        type={type}
        placeholder={placeholder}
        disabled={disabled}
        {...registration}
        className={`
          w-full rounded-lg
          border
          bg-white px-3 py-2.5
          text-sm text-slate-900
          outline-none
          transition
          placeholder:text-slate-400
          focus:ring-2 focus:ring-rose-500/20
          disabled:cursor-not-allowed
          disabled:bg-slate-100
          ${
            error
              ? "border-red-500 focus:border-red-500"
              : "border-slate-300 focus:border-rose-500"
          }
        `}
      />

      {error && <p className="mt-1 text-sm text-red-600">{error}</p>}
    </div>
  );
}
