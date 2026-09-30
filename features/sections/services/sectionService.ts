import { api } from "../../../lib/api";
import type {
  BaseResponse,
  CreateSectionRequest,
  SectionDetails,
  SectionListParams,
  SectionListResponse,
  UpdateSectionRequest,
} from "../types/section";

export const sectionService = {
  async getList(params: SectionListParams): Promise<SectionListResponse> {
    const response = await api.get<SectionListResponse>("/Section", {
      params,
    });

    return response.data;
  },

  async getById(id: number): Promise<SectionDetails> {
    const response = await api.get<SectionDetails>(`/Section/${id}`);

    return response.data;
  },

  async create(request: CreateSectionRequest): Promise<SectionDetails> {
    const response = await api.post<SectionDetails>("/Section", request);

    return response.data;
  },

  async update(
    id: number,
    request: UpdateSectionRequest,
  ): Promise<SectionDetails> {
    const response = await api.put<SectionDetails>(`/Section/${id}`, request);

    return response.data;
  },

  async delete(id: number): Promise<BaseResponse> {
    const response = await api.delete<BaseResponse>(`/Section/${id}`);

    return response.data;
  },
};
