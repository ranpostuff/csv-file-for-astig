import { ArrowLeft } from "lucide-react";
import { useNavigate, useParams } from "react-router";
import { useTeacher } from "../hooks/useTeacher";
import { useUpdateTeacher } from "../hooks/useUpdateTeacher";
import { EditTeacherForm } from "../components/EditTeacherForm";

export default function EditTeacherPage() {
  const navigate = useNavigate();
  const { id } = useParams();

  const { data: teacher, isPending, isError } = useTeacher(id ?? "");
  const { updateTeacher, isPending: isUpdating } = useUpdateTeacher();

  if (!id) {
    return (
      <div className="rounded-xl border border-red-200 bg-red-50 p-4 text-sm text-red-700">
        Invalid teacher ID.
      </div>
    );
  }

  if (isPending) {
    return (
      <div className="flex min-h-64 items-center justify-center">
        <p className="text-sm text-slate-500">Loading teacher...</p>
      </div>
    );
  }

  if (isError || !teacher) {
    return (
      <div className="rounded-xl border border-red-200 bg-red-50 p-4 text-sm text-red-700">
        Failed to load teacher.
      </div>
    );
  }

  const handleSubmit = (
    request: Parameters<typeof updateTeacher>[0]["request"],
  ) => {
    updateTeacher(
      {
        id,
        request,
      },
      {
        onSuccess: () => {
          navigate("/teachers");
        },
      },
    );
  };

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex items-start gap-3">
        <button
          type="button"
          onClick={() => navigate("/teachers")}
          className="
            mt-1 rounded-lg p-2
            text-slate-600
            transition-colors
            hover:bg-slate-100
          "
          aria-label="Back to teachers"
        >
          <ArrowLeft className="h-5 w-5" />
        </button>

        <div>
          <h1 className="text-2xl font-bold text-rose-950">Edit Teacher</h1>

          <p className="mt-1 text-sm text-slate-500">
            Update the teacher's information.
          </p>
        </div>
      </div>

      <EditTeacherForm
        teacher={teacher}
        onSubmit={handleSubmit}
        isPending={isUpdating}
        onCancel={() => navigate("/teachers")}
      />
    </div>
  );
}
