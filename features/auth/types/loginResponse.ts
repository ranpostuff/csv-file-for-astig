export interface LoginResponse {
  id: string;
  username: string;
  firstName: string;
  lastName: string;
  middleName: string | null;
  extension: string | null;
  dateOfBirth: string;
  jwtToken: string;
  roles: string[];
  message: string;
}
