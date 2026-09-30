export const teacherKeys = {
  all: ["teachers"] as const,

  lists: () => [...teacherKeys.all, "list"] as const,

  list: (params: object) => [...teacherKeys.lists(), params] as const,

  details: () => [...teacherKeys.all, "detail"] as const,

  detail: (id: string) => [...teacherKeys.details(), id] as const,
};
