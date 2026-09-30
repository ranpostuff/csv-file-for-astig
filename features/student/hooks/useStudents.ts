import { useQuery } from "@tanstack/react-query";

import { studentService } from "../services/studentService";
import { studentKeys } from "./studentKeys";

import type { StudentListParams } from "../types/student";

export function useStudents(params: StudentListParams) {
  return useQuery({
    queryKey: studentKeys.list(params),
    queryFn: () => studentService.getList(params),
  });
}
