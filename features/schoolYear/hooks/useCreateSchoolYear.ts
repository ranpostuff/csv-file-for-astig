import { useMutation, useQueryClient } from "@tanstack/react-query";

import { toastService } from "../../../app/services/toastService";

import { schoolYearService } from "../services/schoolYearService";
import { schoolYearKeys } from "./useSchoolYears";

import type { CreateSchoolYearRequest } from "../types/schoolYear";

export function useCreateSchoolYear() {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: (request: CreateSchoolYearRequest) =>
      schoolYearService.createSchoolYear(request),

    onSuccess: (response) => {
      queryClient.invalidateQueries({
        queryKey: schoolYearKeys.all,
      });

      toastService.success(
        // response. || "School year created successfully.",
        "School year created successfully.",
      );
    },

    onError: (error) => {
      toastService.error(error);
    },
  });
}
