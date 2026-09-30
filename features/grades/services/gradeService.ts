import { api } from "../../../lib/api";
import type {
  CreateGradeRequest,
  GradeResponse,
  GetGradesParams,
  PaginatedGradeResponse,
} from "../types/grade";

export const gradeService = {
  async getGrades(params: GetGradesParams): Promise<PaginatedGradeResponse> {
    const response = await api.get<PaginatedGradeResponse>("/Grade", {
      params,
    });

    return response.data;
  },

  async getGrade(id: number): Promise<GradeResponse> {
    const response = await api.get<GradeResponse>(`/Grade/${id}`);

    return response.data;
  },

  async createGrade(request: CreateGradeRequest): Promise<GradeResponse> {
    const response = await api.post<GradeResponse>("/Grade", request);
    // console.log(response.data);
    return response.data;
  },

  async updateGrade(
    id: number,
    request: CreateGradeRequest,
  ): Promise<GradeResponse> {
    const response = await api.put<GradeResponse>(`/Grade/${id}`, request);

    return response.data;
  },

  async deleteGrade(id: number): Promise<void> {
    await api.delete(`/Grade/${id}`);
  },
};
