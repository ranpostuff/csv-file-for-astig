import { useQuery } from "@tanstack/react-query";
import axios from "axios";

import { schoolYearService } from "../services/schoolYearService";
import { schoolYearKeys } from "./useSchoolYears";

export function useActiveSchoolYear() {
  return useQuery({
    queryKey: schoolYearKeys.active(),

    queryFn: async () => {
      try {
        return await schoolYearService.getActiveSchoolYear();
      } catch (error) {
        if (axios.isAxiosError(error) && error.response?.status === 404) {
          return null;
        }

        throw error;
      }
    },
  });
}
