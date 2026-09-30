import { useMutation, useQueryClient } from "@tanstack/react-query";

import { studentService } from "../services/studentService";
import { studentKeys } from "./studentKeys";

export function useDeleteStudent() {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: (id: number) => studentService.delete(id),

    onSuccess: (_, id) => {
      queryClient.invalidateQueries({
        queryKey: studentKeys.lists(),
      });

      queryClient.removeQueries({
        queryKey: studentKeys.detail(id),
      });
    },
  });
}
