import { useQuery } from "@tanstack/react-query";

import { studentService } from "../services/studentService";
import { studentKeys } from "./studentKeys";

export function useStudent(id: number) {
  return useQuery({
    queryKey: studentKeys.detail(id),
    queryFn: () => studentService.getById(id),
    enabled: id > 0,
  });
}
