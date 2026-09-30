export interface CreateSchoolYearRequest {
  name: string;
  startDate: string;
  endDate: string;
}

export interface GetSchoolYearsParams {
  pageNumber: number;
  pageSize: number;
  name?: string;
  isActive?: boolean;
}

export interface SchoolYearResponse {
  id: number;
  name: string;
  startDate: string;
  endDate: string;
  isActive: boolean;
  createdBy?: string;
  createdDate: string;
  updatedBy?: string;
  updatedDate: string;
}

export interface PaginatedSchoolYearResponse {
  results: SchoolYearResponse[];
  pageNumber: number;
  pageSize: number;
  totalCount: number;
  totalPages: number;
}
