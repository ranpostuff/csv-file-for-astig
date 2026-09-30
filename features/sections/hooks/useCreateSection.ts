import { useMutation, useQueryClient } from "@tanstack/react-query";
import { sectionService } from "../services/sectionService";
import { sectionKeys } from "./sectionKeys";
import type { CreateSectionRequest } from "../types/section";

export function useCreateSection() {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: (request: CreateSectionRequest) =>
      sectionService.create(request),

    onSuccess: () => {
      queryClient.invalidateQueries({
        queryKey: sectionKeys.all,
      });
    },
  });
}
