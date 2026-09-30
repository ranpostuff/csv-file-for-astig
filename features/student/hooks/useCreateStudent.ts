import { useMutation, useQueryClient } from "@tanstack/react-query";

import { studentService } from "../services/studentService";
import { studentKeys } from "./studentKeys";

import type { CreateStudentRequest } from "../types/student";

export function useCreateStudent() {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: (request: CreateStudentRequest) =>
      studentService.create(request),

    onSuccess: () => {
      queryClient.invalidateQueries({
        queryKey: studentKeys.lists(),
      });
    },
  });
}
