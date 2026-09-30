import { useQuery } from "@tanstack/react-query";

import { schoolYearService } from "../services/schoolYearService";
import { schoolYearKeys } from "./useSchoolYears";

export function useSchoolYear(id: number) {
  return useQuery({
    queryKey: schoolYearKeys.detail(id),
    queryFn: () => schoolYearService.getSchoolYear(id),
    enabled: Number.isInteger(id) && id > 0,
  });
}
