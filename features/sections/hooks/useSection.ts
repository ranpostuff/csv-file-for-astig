import { useQuery } from "@tanstack/react-query";
import { sectionService } from "../services/sectionService";
import { sectionKeys } from "./sectionKeys";

export function useSection(id: number | null) {
  return useQuery({
    queryKey: sectionKeys.detail(id ?? 0),
    queryFn: () => sectionService.getById(id!),
    enabled: id !== null,
  });
}
