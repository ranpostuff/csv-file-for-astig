import { useMutation, useQueryClient } from "@tanstack/react-query";
import { toastService } from "../../../app/services/toastService";
import { gradeService } from "../services/gradeService";
import { gradeKeys } from "./useGrades";

export function useDeleteGrade() {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: (id: number) => gradeService.deleteGrade(id),

    onSuccess: () => {
      queryClient.invalidateQueries({
        queryKey: gradeKeys.all,
      });

      toastService.success("Grade deleted successfully.");
    },

    onError: (error) => {
      toastService.error(error);
    },
  });
}
