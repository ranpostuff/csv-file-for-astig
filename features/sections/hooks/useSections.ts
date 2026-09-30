import { useQuery } from "@tanstack/react-query";
import { sectionService } from "../services/sectionService";
import { sectionKeys } from "./sectionKeys";
import type { SectionListParams } from "../types/section";

export function useSections(params: SectionListParams, enabled = true) {
  return useQuery({
    queryKey: sectionKeys.list(params),
    queryFn: () => sectionService.getList(params),
    enabled,
  });
}
