import { useMutation, useQueryClient } from "@tanstack/react-query";
import { sectionService } from "../services/sectionService";
import { sectionKeys } from "./sectionKeys";

export function useDeleteSection() {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: (id: number) => sectionService.delete(id),

    onSuccess: () => {
      queryClient.invalidateQueries({
        queryKey: sectionKeys.all,
      });
    },
  });
}
