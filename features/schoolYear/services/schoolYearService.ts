import { api } from "../../../lib/api";
import type { BaseResponse } from "../../../types/baseResponse";

import type {
  CreateSchoolYearRequest,
  GetSchoolYearsParams,
  PaginatedSchoolYearResponse,
  SchoolYearResponse,
} from "../types/schoolYear";

export const schoolYearService = {
  async getSchoolYears(
    params: GetSchoolYearsParams,
  ): Promise<PaginatedSchoolYearResponse> {
    const response = await api.get<PaginatedSchoolYearResponse>("/SchoolYr", {
      params,
    });

    return response.data;
  },

  async getSchoolYear(id: number): Promise<SchoolYearResponse> {
    const response = await api.get<SchoolYearResponse>(`/SchoolYr/${id}`);

    return response.data;
  },

  async getActiveSchoolYear(): Promise<SchoolYearResponse> {
    const response = await api.get<SchoolYearResponse>("/SchoolYr/active");

    return response.data;
  },

  async createSchoolYear(
    request: CreateSchoolYearRequest,
  ): Promise<SchoolYearResponse> {
    const response = await api.post<SchoolYearResponse>("/SchoolYr", request);

    return response.data;
  },

  async activateSchoolYear(id: number): Promise<BaseResponse> {
    const response = await api.post<BaseResponse>(`/SchoolYr/${id}/activate`);

    return response.data;
  },

  async deleteSchoolYear(id: number): Promise<BaseResponse> {
    const response = await api.delete<BaseResponse>(`/SchoolYr/${id}`);

    return response.data;
  },
};
