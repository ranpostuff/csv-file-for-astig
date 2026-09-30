import { useMutation, useQueryClient } from "@tanstack/react-query";
import { teacherService } from "../services/teacherService";
import { toastService } from "../../../app/services/toastService";

export function useDeleteTeacher() {
  const queryClient = useQueryClient();

  const mutation = useMutation({
    mutationFn: (id: string) => teacherService.delete(id),

    onSuccess: () => {
      queryClient.invalidateQueries({
        queryKey: ["teachers"],
      });

      toastService.success("Teacher deleted successfully.");
    },

    onError: (error) => {
      console.error(error);
      toastService.error("Failed to delete teacher.");
    },
  });

  return {
    deleteTeacher: mutation.mutate,
    isPending: mutation.isPending,
  };
}
