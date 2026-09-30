import { useMutation, useQueryClient } from "@tanstack/react-query";
import { teacherService } from "../services/teacherService";
import { toastService } from "../../../app/services/toastService";
import type { UpdateTeacherRequest } from "../types/teacher";

export function useUpdateTeacher() {
  const queryClient = useQueryClient();

  const mutation = useMutation({
    mutationFn: ({
      id,
      request,
    }: {
      id: string;
      request: UpdateTeacherRequest;
    }) => teacherService.update(id, request),

    onSuccess: (_, variables) => {
      queryClient.invalidateQueries({
        queryKey: ["teachers"],
      });

      queryClient.invalidateQueries({
        queryKey: ["teachers", variables.id],
      });

      toastService.success("Teacher updated successfully.");
    },

    onError: (error) => {
      console.error(error);
      toastService.error("Failed to update teacher.");
    },
  });

  return {
    updateTeacher: mutation.mutate,
    isPending: mutation.isPending,
  };
}
