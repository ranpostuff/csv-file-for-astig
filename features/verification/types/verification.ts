export type VerificationState = "idle" | "verifying" | "success" | "error";

export type ConnectionState =
  "connecting" | "connected" | "reconnecting" | "disconnected";

export interface VerificationResponse {
  id: number;
  verifiedAt: string;
  isEntry: boolean;
  firstName: string;
  middleName: string | null;
  lastName: string;
  studentProfilePic: string | null;
  extension: string | null;
  gradeName: string;
  sectionName: string;
  createdDate: string;
  createdBy: string | null;
}

export interface VerificationSignalRResponse {
  message: string;
  result: VerificationResponse | null;
}
