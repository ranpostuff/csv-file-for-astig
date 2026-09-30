import { useNavigate } from "react-router";
import { CreateTeacherForm } from "../components/CreateTeacherForm";
import { useCreateTeacher } from "../hooks/useCreateTeacher";
import type { CreateTeacherRequest } from "../types/teacher";

export default function CreateTeacherPage() {
  const navigate = useNavigate();

  const { createTeacher, isPending } = useCreateTeacher();

  const handleSubmit = (request: CreateTeacherRequest) => {
    createTeacher(request, {
      onSuccess: () => {
        navigate("/teachers");
      },
    });
  };

  return (
    <div className="mx-auto max-w-4xl">
      <div className="mb-6">
        <h1 className="text-2xl font-bold text-slate-900">Create Teacher</h1>

        <p className="mt-1 text-sm text-slate-500">
          Add a new teacher to the system.
        </p>
      </div>

      <CreateTeacherForm
        onSubmit={handleSubmit}
        onCancel={() => navigate("/teachers")}
        isPending={isPending}
      />
    </div>
  );
}
