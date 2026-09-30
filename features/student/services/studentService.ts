import { api } from "../../../lib/api";

import type {
  CreateStudentRequest,
  StudentDetails,
  StudentListParams,
  StudentListResponse,
  UpdateStudentRequest,
} from "../types/student";

export const studentService = {
  async getList(params: StudentListParams) {
    const response = await api.get<StudentListResponse>("/Student", {
      params,
    });

    return response.data;
  },

  async getById(id: number) {
    const response = await api.get<StudentDetails>(`/Student/${id}`);

    return response.data;
  },

  async create(request: CreateStudentRequest) {
    const response = await api.post<StudentDetails>("/Student", request);

    return response.data;
  },

  async update(id: number, request: UpdateStudentRequest) {
    const response = await api.put<StudentDetails>(`/Student/${id}`, request);

    return response.data;
  },

  async delete(id: number) {
    const response = await api.delete(`/Student/${id}`);

    return response.data;
  },
};
