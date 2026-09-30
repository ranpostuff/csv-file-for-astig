/** One row read from the uploaded file, before any validation. */
export interface StudentImportRawRow {
  /** Row number as it appears in the file (header is row 1). */
  rowNumber: number;
  lrn: string;
  firstName: string;
  middleName: string;
  lastName: string;
  extension: string;
  parentMobileNo: string;
  parentEmail: string;
  gradeName: string;
  sectionName: string;
}

/** A raw row after validation. `errors` is empty when the row is ready to import. */
export interface StudentImportRow extends StudentImportRawRow {
  errors: string[];
  /** Resolved from grade + section name. Null when sections could not be checked. */
  sectionId: number | null;
}

export interface ParsedStudentImportFile {
  rows: StudentImportRawRow[];
}

export interface StudentImportOutcome {
  rowNumber: number;
  lrn: string;
  name: string;
  status: "success" | "failed";
  message?: string;
}
