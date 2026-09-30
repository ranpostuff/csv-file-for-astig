import { useQuery } from "@tanstack/react-query";
import { teacherService } from "../services/teacherService";
import { teacherKeys } from "./teacherKeys";

export function useTeacher(id: string) {
  return useQuery({
    queryKey: ["teachers", id],
    queryFn: () => teacherService.getById(id),
    enabled: Boolean(id),
  });
}
