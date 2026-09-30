export interface Section {
  id: number;
  name: string;
  assignedTeacher: string;
  gradeName: string;
}

export interface SectionDetails {
  id: number;
  name: string;
  assignedTeacherId: string;
  assignedTeacherName: string;
  gradeName: string;
  gradeId: number;
}

export interface CreateSectionRequest {
  name: string;
  assignedTeacherId: string;
  gradeId: number;
}

export interface UpdateSectionRequest {
  name: string;
  assignedTeacherId: string;
  gradeId: number;
}

export interface SectionListParams {
  name?: string;
  assignedTeacherName?: string;
  gradeName?: string;
  pageNumber: number;
  pageSize: number;
}

export interface SectionListResponse {
  results: Section[];
  pageNumber: number;
  pageSize: number;
  totalCount: number;
  totalPages: number;
  message: string;
}

export interface BaseResponse {
  message: string;
}
