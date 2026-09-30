import { ArrowLeft, Mail, MapPin, User } from "lucide-react";
import { useNavigate, useParams } from "react-router";
import { useTeacher } from "../hooks/useTeacher";

export default function TeacherDetailsPage() {
  const navigate = useNavigate();
  const { id } = useParams();

  const { data: teacher, isPending, isError } = useTeacher(id ?? "");

  if (isPending) {
    return (
      <div className="flex min-h-100 items-center justify-center">
        <div className="h-8 w-8 animate-spin rounded-full border-4 border-rose-200 border-t-rose-950" />
      </div>
    );
  }

  if (isError || !teacher) {
    return (
      <div className="space-y-4">
        <button
          type="button"
          onClick={() => navigate("/teachers")}
          className="inline-flex items-center gap-2 text-sm font-medium text-rose-950 hover:text-rose-800"
        >
          <ArrowLeft className="h-4 w-4" />
          Back to Teachers
        </button>

        <div className="rounded-xl border border-red-200 bg-red-50 p-6 text-sm text-red-700">
          Failed to load teacher information.
        </div>
      </div>
    );
  }

  const fullName = [
    teacher.firstName,
    teacher.middleName,
    teacher.lastName,
    teacher.extension,
  ]
    .filter(Boolean)
    .join(" ");

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
        <div>
          <button
            type="button"
            onClick={() => navigate("/teachers")}
            className="mb-3 inline-flex items-center gap-2 text-sm font-medium text-rose-950 hover:text-rose-800"
          >
            <ArrowLeft className="h-4 w-4" />
            Back to Teachers
          </button>

          <h1 className="text-2xl font-bold text-slate-900">Teacher Details</h1>

          <p className="mt-1 text-sm text-slate-500">
            View teacher information.
          </p>
        </div>

        <button
          type="button"
          onClick={() => navigate(`/dashboard/teachers/${teacher.id}/edit`)}
          className="
            inline-flex items-center justify-center
            rounded-lg bg-rose-950
            px-4 py-2.5
            text-sm font-semibold text-white
            shadow-sm
            transition-colors
            hover:bg-rose-900
          "
        >
          Edit Teacher
        </button>
      </div>

      {/* Profile */}
      <section className="rounded-xl border border-slate-200 bg-white p-6 shadow-sm">
        <div className="flex flex-col items-center gap-4 sm:flex-row">
          <div className="flex h-28 w-28 shrink-0 items-center justify-center overflow-hidden rounded-full bg-rose-100">
            {teacher.profilePictureUrl ? (
              <img
                src={teacher.profilePictureUrl}
                alt={fullName}
                className="h-full w-full object-cover"
              />
            ) : (
              <User className="h-12 w-12 text-rose-400" />
            )}
          </div>

          <div className="text-center sm:text-left">
            <h2 className="text-xl font-bold text-slate-900">{fullName}</h2>

            <p className="mt-1 text-sm text-slate-500">Teacher</p>
          </div>
        </div>
      </section>

      {/* Account Information */}
      <section className="rounded-xl border border-slate-200 bg-white p-6 shadow-sm">
        <h2 className="text-lg font-semibold text-rose-950">
          Account Information
        </h2>

        <div className="mt-4 grid gap-4 md:grid-cols-2">
          <InfoField
            label="Email"
            value={teacher.email}
            icon={<Mail className="h-4 w-4" />}
          />

          <InfoField
            label="Address"
            value={teacher.address}
            icon={<MapPin className="h-4 w-4" />}
          />
        </div>
      </section>

      {/* Personal Information */}
      <section className="rounded-xl border border-slate-200 bg-white p-6 shadow-sm">
        <h2 className="text-lg font-semibold text-rose-950">
          Personal Information
        </h2>

        <div className="mt-4 grid gap-4 md:grid-cols-2">
          <InfoField label="First Name" value={teacher.firstName} />

          <InfoField label="Middle Name" value={teacher.middleName} />

          <InfoField label="Last Name" value={teacher.lastName} />

          <InfoField label="Extension" value={teacher.extension} />

          <InfoField
            label="Date of Birth"
            value={new Date(teacher.dateOfBirth).toLocaleDateString()}
          />

          <InfoField label="Address" value={teacher.address} />
        </div>
      </section>
    </div>
  );
}

type InfoFieldProps = {
  label: string;
  value: string | null | undefined;
  icon?: React.ReactNode;
};

function InfoField({ label, value, icon }: InfoFieldProps) {
  return (
    <div>
      <p className="mb-1.5 flex items-center gap-1.5 text-sm font-medium text-slate-500">
        {icon}
        {label}
      </p>

      <p className="text-sm font-medium text-slate-900">{value || "—"}</p>
    </div>
  );
}
