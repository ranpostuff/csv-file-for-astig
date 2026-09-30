import type {
  ParsedStudentImportFile,
  StudentImportRawRow,
} from "../types/studentImport";

export const MAX_IMPORT_FILE_SIZE_MB = 5;
export const MAX_IMPORT_ROWS = 1000;

/** An error whose message is safe and helpful to show to the user as-is. */
export class ImportFileError extends Error {}

type FieldKey = Exclude<keyof StudentImportRawRow, "rowNumber">;

/** Column headers we accept for each field (compared after normalizing). */
const HEADER_ALIASES: Record<FieldKey, string[]> = {
  lrn: ["lrn", "learnerreferencenumber", "learnerreferenceno"],
  firstName: ["firstname", "first", "givenname"],
  middleName: ["middlename", "middle", "middleinitial"],
  lastName: ["lastname", "last", "surname", "familyname"],
  extension: ["extension", "ext", "suffix", "extensionname"],
  parentMobileNo: [
    "parentmobileno",
    "parentmobilenumber",
    "parentmobile",
    "parentcontactnumber",
    "parentcontactno",
    "parentcontact",
    "mobileno",
    "mobilenumber",
    "contactnumber",
    "contactno",
  ],
  parentEmail: ["parentemail", "parentemailaddress", "email", "emailaddress"],
  gradeName: ["grade", "gradelevel", "gradename"],
  sectionName: ["section", "sectionname"],
};

const REQUIRED_FIELDS: { key: FieldKey; label: string }[] = [
  { key: "lrn", label: "LRN" },
  { key: "firstName", label: "First Name" },
  { key: "lastName", label: "Last Name" },
  { key: "parentMobileNo", label: "Parent Mobile No" },
  { key: "gradeName", label: "Grade" },
  { key: "sectionName", label: "Section" },
];

/** Columns for the downloadable template. */
export const IMPORT_TEMPLATE_HEADERS = [
  "LRN",
  "First Name",
  "Middle Name",
  "Last Name",
  "Extension",
  "Parent Mobile No",
  "Parent Email",
  "Grade",
  "Section",
];

export const IMPORT_REQUIRED_LABELS = REQUIRED_FIELDS.map((f) => f.label);

function normalizeHeader(value: string) {
  return value.toLowerCase().replace(/[^a-z0-9]/g, "");
}

function detectDelimiter(text: string) {
  const firstLine = text.split(/\r?\n/, 1)[0] ?? "";

  const candidates = [",", ";", "\t"];
  let best = ",";
  let bestCount = 0;

  for (const candidate of candidates) {
    const count = firstLine.split(candidate).length - 1;

    if (count > bestCount) {
      best = candidate;
      bestCount = count;
    }
  }

  return best;
}

/** Small RFC-4180 style CSV parser (handles quotes, escaped quotes, CRLF, BOM). */
export function parseCsv(rawText: string): string[][] {
  const text = rawText.replace(/^\uFEFF/, "");
  const delimiter = detectDelimiter(text);

  const rows: string[][] = [];
  let row: string[] = [];
  let field = "";
  let inQuotes = false;

  for (let i = 0; i < text.length; i++) {
    const char = text[i];

    if (inQuotes) {
      if (char === '"') {
        if (text[i + 1] === '"') {
          field += '"';
          i++;
        } else {
          inQuotes = false;
        }
      } else {
        field += char;
      }
      continue;
    }

    if (char === '"') {
      inQuotes = true;
    } else if (char === delimiter) {
      row.push(field);
      field = "";
    } else if (char === "\n" || char === "\r") {
      if (char === "\r" && text[i + 1] === "\n") {
        i++;
      }
      row.push(field);
      rows.push(row);
      row = [];
      field = "";
    } else {
      field += char;
    }
  }

  row.push(field);
  rows.push(row);

  return rows;
}

function cellToString(value: unknown): string {
  if (value === null || value === undefined) {
    return "";
  }

  if (value instanceof Date) {
    return value.toISOString().slice(0, 10);
  }

  return String(value).trim();
}

/**
 * Excel and CSV round-trips often drop the leading zero of Philippine
 * mobile numbers (0917... becomes 917...). Put it back.
 */
function fixMobileNumber(value: string) {
  return /^9\d{9}$/.test(value) ? `0${value}` : value;
}

async function readRows(file: File): Promise<unknown[][]> {
  const name = file.name.toLowerCase();

  if (name.endsWith(".csv")) {
    return parseCsv(await file.text());
  }

  if (name.endsWith(".xlsx")) {
    // Loaded only when an Excel file is picked so it stays out of the main bundle.
    const { default: readXlsxFile } = await import("read-excel-file");
    return (await readXlsxFile(file)) as unknown[][];
  }

  if (name.endsWith(".xls")) {
    throw new ImportFileError(
      "Old .xls files aren't supported. Please save the file as .xlsx or .csv and try again.",
    );
  }

  throw new ImportFileError(
    "Unsupported file type. Please upload a .csv or .xlsx file.",
  );
}

export async function parseStudentImportFile(
  file: File,
): Promise<ParsedStudentImportFile> {
  if (file.size > MAX_IMPORT_FILE_SIZE_MB * 1024 * 1024) {
    throw new ImportFileError(
      `File is too large. The limit is ${MAX_IMPORT_FILE_SIZE_MB} MB.`,
    );
  }

  let allRows: unknown[][];

  try {
    allRows = await readRows(file);
  } catch (error) {
    if (error instanceof ImportFileError) {
      throw error;
    }

    throw new ImportFileError(
      "Couldn't read that file. Make sure it isn't corrupted or password protected.",
    );
  }

  const headerIndex = allRows.findIndex((row) =>
    row.some((cell) => cellToString(cell) !== ""),
  );

  if (headerIndex === -1) {
    throw new ImportFileError("The file is empty.");
  }

  // Map each field to the column it lives in.
  const columnByField = new Map<FieldKey, number>();

  allRows[headerIndex].forEach((cell, columnIndex) => {
    const header = normalizeHeader(cellToString(cell));

    if (!header) {
      return;
    }

    (Object.keys(HEADER_ALIASES) as FieldKey[]).forEach((field) => {
      if (!columnByField.has(field) && HEADER_ALIASES[field].includes(header)) {
        columnByField.set(field, columnIndex);
      }
    });
  });

  const missing = REQUIRED_FIELDS.filter((f) => !columnByField.has(f.key));

  if (missing.length > 0) {
    throw new ImportFileError(
      `Missing required column${missing.length > 1 ? "s" : ""}: ${missing
        .map((f) => f.label)
        .join(", ")}.`,
    );
  }

  const rows: StudentImportRawRow[] = [];

  for (let i = headerIndex + 1; i < allRows.length; i++) {
    const cells = allRows[i];

    if (cells.every((cell) => cellToString(cell) === "")) {
      continue;
    }

    const read = (field: FieldKey) => {
      const column = columnByField.get(field);
      return column === undefined ? "" : cellToString(cells[column]);
    };

    rows.push({
      rowNumber: i + 1,
      lrn: read("lrn"),
      firstName: read("firstName"),
      middleName: read("middleName"),
      lastName: read("lastName"),
      extension: read("extension"),
      parentMobileNo: fixMobileNumber(read("parentMobileNo")),
      parentEmail: read("parentEmail"),
      gradeName: read("gradeName"),
      sectionName: read("sectionName"),
    });
  }

  if (rows.length === 0) {
    throw new ImportFileError("No student rows found below the header row.");
  }

  if (rows.length > MAX_IMPORT_ROWS) {
    throw new ImportFileError(
      `That file has ${rows.length} students. Please import at most ${MAX_IMPORT_ROWS} at a time.`,
    );
  }

  return { rows };
}
