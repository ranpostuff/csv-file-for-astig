import { useMutation, useQueryClient } from "@tanstack/react-query";

import { toastService } from "../../../app/services/toastService";

import { schoolYearService } from "../services/schoolYearService";
import { schoolYearKeys } from "./useSchoolYears";

export function useActivateSchoolYear() {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: (id: number) => schoolYearService.activateSchoolYear(id),

    onSuccess: (response) => {
      queryClient.invalidateQueries({
        queryKey: schoolYearKeys.all,
      });

      toastService.success(
        response.message || "School year activated successfully.",
      );
    },

    onError: (error) => {
      toastService.error(error);
    },
  });
}
