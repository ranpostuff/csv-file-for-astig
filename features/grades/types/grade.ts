export interface Grade {
  id: number;
  name: string;
  description: string | null;
  createdBy: string | null;
  createdAt: string;
  message: string;
}

export interface GradeResponse {
  id: number;
  name: string;
  description: string | null;
  createdBy: string | null;
  createdAt: string;
  message: string;
}

export interface GetGradesParams {
  pageNumber: number;
  pageSize: number;
  name?: string;
}

export interface PaginatedGradeResponse {
  results: Grade[];
  pageNumber: number;
  pageSize: number;
  totalCount: number;
  totalPages: number;
  message: string;
}

export interface CreateGradeRequest {
  name: string;
  description?: string | null;
}
