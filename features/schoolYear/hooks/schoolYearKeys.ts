import type { GetSchoolYearsParams } from "../types/schoolYear";

export const schoolYearKeys = {
  all: ["schoolYears"] as const,

  lists: () => [...schoolYearKeys.all, "list"] as const,

  list: (params: GetSchoolYearsParams) =>
    [...schoolYearKeys.lists(), params] as const,

  details: () => [...schoolYearKeys.all, "detail"] as const,

  detail: (id: number) => [...schoolYearKeys.details(), id] as const,

  active: () => [...schoolYearKeys.all, "active"] as const,
};
