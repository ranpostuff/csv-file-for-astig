import { useQuery } from "@tanstack/react-query";
import { gradeService } from "../services/gradeService";
import type { GetGradesParams } from "../types/grade";

export const gradeKeys = {
  all: ["grades"] as const,
  lists: () => [...gradeKeys.all, "list"] as const,
  list: (params: GetGradesParams) => [...gradeKeys.lists(), params] as const,
  details: () => [...gradeKeys.all, "detail"] as const,
  detail: (id: number) => [...gradeKeys.details(), id] as const,
};

export function useGrades(params: GetGradesParams) {
  return useQuery({
    queryKey: gradeKeys.list(params),
    queryFn: () => gradeService.getGrades(params),
  });
}
