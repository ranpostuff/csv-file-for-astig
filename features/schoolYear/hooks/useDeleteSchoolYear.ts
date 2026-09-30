import { useMutation, useQueryClient } from "@tanstack/react-query";

import { toastService } from "../../../app/services/toastService";

import { schoolYearService } from "../services/schoolYearService";
import { schoolYearKeys } from "./useSchoolYears";

export function useDeleteSchoolYear() {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: (id: number) => schoolYearService.deleteSchoolYear(id),

    onSuccess: (response) => {
      queryClient.invalidateQueries({
        queryKey: schoolYearKeys.all,
      });

      toastService.success(
        response.message || "School year deleted successfully.",
      );
    },

    onError: (error) => {
      toastService.error(error);
    },
  });
}
