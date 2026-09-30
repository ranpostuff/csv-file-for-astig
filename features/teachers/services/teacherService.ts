import { api } from "../../../lib/api";
import type {
  CreateTeacherRequest,
  Teacher,
  TeacherListParams,
  TeacherListResponse,
  UpdateTeacherRequest,
} from "../types/teacher";

export const teacherService = {
  async getList(params: TeacherListParams): Promise<TeacherListResponse> {
    const response = await api.get<TeacherListResponse>("/Teacher", {
      params,
    });

    return response.data;
  },

  async getById(id: string): Promise<Teacher> {
    const response = await api.get<Teacher>(`/Teacher/${id}`);

    return response.data;
  },

  async create(request: CreateTeacherRequest): Promise<Teacher> {
    const response = await api.post<Teacher>("/Teacher", request);

    return response.data;
  },

  async delete(id: string): Promise<void> {
    await api.delete(`/Teacher/${id}`);
  },

  async update(id: string, request: UpdateTeacherRequest): Promise<Teacher> {
    const response = await api.put(`/Teacher/${id}`, request);

    return response.data;
  },
};
