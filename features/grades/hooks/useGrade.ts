import { useQuery } from "@tanstack/react-query";
import { gradeService } from "../services/gradeService";
import { gradeKeys } from "./useGrades";

export function useGrade(id: number) {
  return useQuery({
    queryKey: gradeKeys.detail(id),
    queryFn: () => gradeService.getGrade(id),
    enabled: Number.isInteger(id) && id > 0,
  });
}
