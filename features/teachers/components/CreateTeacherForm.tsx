import { useRef, useState } from "react";
import { useForm, type UseFormRegisterReturn } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { ImagePlus, X } from "lucide-react";

import type { CreateTeacherRequest } from "../types/teacher";
import {
  createTeacherSchema,
  type CreateTeacherFormValues,
} from "../schema/teacherSchema";

type CreateTeacherFormProps = {
  onSubmit: (request: CreateTeacherRequest) => void;
  onCancel?: () => void;
  isPending?: boolean;
};

const MAX_FILE_SIZE = 10 * 1024 * 1024;

export function CreateTeacherForm({
  onSubmit,
  onCancel,
  isPending = false,
}: CreateTeacherFormProps) {
  const {
    register,
    handleSubmit,
    formState: { errors },
  } = useForm<CreateTeacherFormValues>({
    resolver: zodResolver(createTeacherSchema),
    defaultValues: {
      email: "",
      password: "",
      firstName: "",
      middleName: "",
      lastName: "",
      extension: "",
      address: "",
      dateOfBirth: "",
      profilePictureUrl: null,
    },
  });

  const fileInputRef = useRef<HTMLInputElement>(null);

  const [profilePreview, setProfilePreview] = useState<string | null>(null);
  const [profileFile, setProfileFile] = useState<File | null>(null);
  const [fileError, setFileError] = useState<string | null>(null);

  const handleProfilePictureChange = (
    event: React.ChangeEvent<HTMLInputElement>,
  ) => {
    const file = event.target.files?.[0];

    if (!file) {
      return;
    }

    setFileError(null);

    if (file.size > MAX_FILE_SIZE) {
      setFileError("Profile picture must not exceed 10 MB.");
      event.target.value = "";
      return;
    }

    if (!file.type.startsWith("image/")) {
      setFileError("Please select a valid image.");
      event.target.value = "";
      return;
    }

    if (profilePreview) {
      URL.revokeObjectURL(profilePreview);
    }

    setProfileFile(file);

    const previewUrl = URL.createObjectURL(file);
    setProfilePreview(previewUrl);
  };

  const removeProfilePicture = () => {
    if (profilePreview) {
      URL.revokeObjectURL(profilePreview);
    }

    setProfilePreview(null);
    setProfileFile(null);
    setFileError(null);

    if (fileInputRef.current) {
      fileInputRef.current.value = "";
    }
  };

  const handleFormSubmit = (values: CreateTeacherFormValues) => {
    const request: CreateTeacherRequest = {
      ...values,
      middleName: values.middleName || null,
      extension: values.extension || null,
      profilePictureUrl: values.profilePictureUrl || null,
    };

    // Intentionally not sending the file yet.
    console.log("Selected profile picture:", profileFile);

    onSubmit(request);
  };

  return (
    <form onSubmit={handleSubmit(handleFormSubmit)} className="space-y-6">
      {/* Profile Picture */}
      <section className="rounded-xl border border-slate-200 bg-white p-6 shadow-sm">
        <h2 className="text-lg font-semibold text-rose-950">Profile Picture</h2>

        <p className="mt-1 text-sm text-slate-500">
          Optional. Maximum file size is 10 MB.
        </p>

        <div className="mt-4 flex flex-col gap-4 sm:flex-row sm:items-center">
          <div className="relative flex h-24 w-24 shrink-0 items-center justify-center overflow-hidden rounded-full bg-rose-100">
            {profilePreview ? (
              <img
                src={profilePreview}
                alt="Profile preview"
                className="h-full w-full object-cover"
              />
            ) : (
              <ImagePlus className="h-8 w-8 text-rose-400" />
            )}

            {profilePreview && (
              <button
                type="button"
                onClick={removeProfilePicture}
                disabled={isPending}
                className="
                  absolute right-0 top-0
                  rounded-full bg-red-600 p-1
                  text-white shadow
                  hover:bg-red-700
                  disabled:cursor-not-allowed
                  disabled:opacity-50
                "
                aria-label="Remove profile picture"
              >
                <X className="h-3.5 w-3.5" />
              </button>
            )}
          </div>

          <div>
            <input
              ref={fileInputRef}
              type="file"
              accept="image/*"
              onChange={handleProfilePictureChange}
              disabled={isPending}
              className="hidden"
            />

            <button
              type="button"
              disabled={isPending}
              onClick={() => fileInputRef.current?.click()}
              className="
                inline-flex items-center gap-2
                rounded-lg border border-rose-200
                bg-rose-50
                px-4 py-2.5
                text-sm font-semibold text-rose-800
                transition-colors
                hover:bg-rose-100
                disabled:cursor-not-allowed
                disabled:opacity-50
              "
            >
              <ImagePlus className="h-4 w-4" />
              Choose Photo
            </button>

            {fileError && (
              <p className="mt-2 text-sm text-red-600">{fileError}</p>
            )}
          </div>
        </div>
      </section>

      {/* Account Information */}
      <section className="rounded-xl border border-slate-200 bg-white p-6 shadow-sm">
        <h2 className="text-lg font-semibold text-rose-950">
          Account Information
        </h2>

        <div className="mt-4 grid gap-4 md:grid-cols-2">
          <FormField
            label="Email"
            type="email"
            registration={register("email")}
            error={errors.email?.message}
            disabled={isPending}
          />

          <FormField
            label="Password"
            type="password"
            registration={register("password")}
            error={errors.password?.message}
            disabled={isPending}
          />
        </div>
      </section>

      {/* Personal Information */}
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
          disabled={isPending}
          onClick={onCancel}
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
          {isPending ? "Creating..." : "Create Teacher"}
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
