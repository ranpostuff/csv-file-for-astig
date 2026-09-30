import { useQuery } from "@tanstack/react-query";

import { schoolYearService } from "../services/schoolYearService";

import type { GetSchoolYearsParams } from "../types/schoolYear";
import { schoolYearKeys } from "./schoolYearKeys";

export function useSchoolYears(params: GetSchoolYearsParams) {
  return useQuery({
    queryKey: schoolYearKeys.list(params),
    queryFn: () => schoolYearService.getSchoolYears(params),
  });
}
export { schoolYearKeys };
