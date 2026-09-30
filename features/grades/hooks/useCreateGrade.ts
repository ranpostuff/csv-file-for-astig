import { useMutation, useQueryClient } from "@tanstack/react-query";
import { toastService } from "../../../app/services/toastService";
import { gradeService } from "../services/gradeService";
import { gradeKeys } from "./useGrades";
import type { CreateGradeRequest } from "../types/grade";

export function useCreateGrade() {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: (request: CreateGradeRequest) =>
      gradeService.createGrade(request),

    onSuccess: (response) => {
      queryClient.invalidateQueries({
        queryKey: gradeKeys.all,
      });

      toastService.success(response.message || "Grade created successfully.");
    },

    onError: (error) => {
      toastService.error(error);
    },
  });
}
