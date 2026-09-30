export const sectionKeys = {
  all: ["sections"] as const,

  lists: () => [...sectionKeys.all, "list"] as const,

  list: (params: object) => [...sectionKeys.lists(), params] as const,

  details: () => [...sectionKeys.all, "detail"] as const,

  detail: (id: number) => [...sectionKeys.details(), id] as const,
};
