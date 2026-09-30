export interface Teacher {
  id: string;
  email: string;
  firstName: string;
  middleName: string | null;
  lastName: string;
  extension: string | null;
  address: string;
  dateOfBirth: string;
  profilePictureUrl: string | null;
}

export interface CreateTeacherRequest {
  email: string;
  password: string;
  firstName: string;
  middleName: string | null;
  lastName: string;
  extension: string | null;
  address: string;
  dateOfBirth: string;
  profilePictureUrl: string | null;
}

export interface TeacherListParams {
  name?: string;
  address?: string;
  pageNumber: number;
  pageSize: number;
}

export interface TeacherListResponse {
  results: Teacher[];
  pageNumber: number;
  pageSize: number;
  totalCount: number;
  totalPages: number;
  message: string;
}

export interface UpdateTeacherRequest {
  firstName: string;
  middleName: string | null;
  lastName: string;
  extension: string | null;
  address: string;
  dateOfBirth: string;
  profilePictureUrl: string | null;
}
