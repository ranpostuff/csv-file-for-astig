import { useMutation, useQueryClient } from "@tanstack/react-query";

import { studentService } from "../services/studentService";
import { studentKeys } from "./studentKeys";

import type { UpdateStudentRequest } from "../types/student";

interface UpdateStudentVariables {
  id: number;
  request: UpdateStudentRequest;
}

export function useUpdateStudent() {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: ({ id, request }: UpdateStudentVariables) =>
      studentService.update(id, request),

    onSuccess: (_, variables) => {
      queryClient.invalidateQueries({
        queryKey: studentKeys.lists(),
      });

      queryClient.invalidateQueries({
        queryKey: studentKeys.detail(variables.id),
      });
    },
  });
}
