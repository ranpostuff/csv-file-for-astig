import { useMutation, useQueryClient } from "@tanstack/react-query";
import { teacherService } from "../services/teacherService";
import { toastService } from "../../../app/services/toastService";
import type { CreateTeacherRequest } from "../types/teacher";

export function useCreateTeacher() {
  const queryClient = useQueryClient();

  const mutation = useMutation({
    mutationFn: (request: CreateTeacherRequest) =>
      teacherService.create(request),

    onSuccess: () => {
      queryClient.invalidateQueries({
        queryKey: ["teachers"],
      });

      toastService.success("Teacher created successfully.");
    },

    onError: (error) => {
      toastService.error(error);
    },
  });

  return {
    createTeacher: mutation.mutate,
    isPending: mutation.isPending,
  };
}
