import { useQuery } from "@tanstack/react-query";
import { teacherService } from "../services/teacherService";
import type { TeacherListParams } from "../types/teacher";
import { teacherKeys } from "./teacherKeys";

export function useTeachers(params: TeacherListParams, enabled = true) {
  return useQuery({
    queryKey: teacherKeys.list(params),
    queryFn: () => teacherService.getList(params),
    enabled,
  });
}
