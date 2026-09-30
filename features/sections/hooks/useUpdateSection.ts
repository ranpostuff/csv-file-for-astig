import { useMutation, useQueryClient } from "@tanstack/react-query";
import { sectionService } from "../services/sectionService";
import { sectionKeys } from "./sectionKeys";
import type { UpdateSectionRequest } from "../types/section";

interface UpdateSectionVariables {
  id: number;
  request: UpdateSectionRequest;
}

export function useUpdateSection() {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: ({ id, request }: UpdateSectionVariables) =>
      sectionService.update(id, request),

    onSuccess: (_, variables) => {
      queryClient.invalidateQueries({
        queryKey: sectionKeys.all,
      });

      queryClient.invalidateQueries({
        queryKey: sectionKeys.detail(variables.id),
      });
    },
  });
}
