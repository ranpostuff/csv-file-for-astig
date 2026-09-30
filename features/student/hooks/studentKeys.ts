import type { StudentListParams } from "../types/student";

export const studentKeys = {
  all: ["students"] as const,

  lists: () => [...studentKeys.all, "list"] as const,

  list: (params: StudentListParams) =>
    [...studentKeys.lists(), params] as const,

  details: () => [...studentKeys.all, "detail"] as const,

  detail: (id: number) => [...studentKeys.details(), id] as const,
};
