import type { Section } from "../../sections/types/section";
import { studentSchema } from "../schema/studentSchema";
import type {
  StudentImportRawRow,
  StudentImportRow,
} from "../types/studentImport";

// Reuse the same rules as the Create Student form (minus the section dropdown).
const importRowSchema = studentSchema.omit({ sectionId: true });

const EMAIL_PATTERN = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;

function normalize(value: string) {
  return value.toLowerCase().replace(/[^a-z0-9]/g, "");
}

/** "Grade 7", "grade7" and a bare "7" all match a grade named "Grade 7". */
function gradeMatches(gradeName: string, input: string) {
  if (normalize(gradeName) === normalize(input)) {
    return true;
  }

  if (/^\d+$/.test(input.trim())) {
    const wanted = Number(input.trim());
    return (gradeName.match(/\d+/g) ?? []).some((n) => Number(n) === wanted);
  }

  return false;
}

/**
 * Validates every row. Pass `sections` to also check that each
 * grade + section exists; pass null when sections couldn't be loaded.
 */
export function validateStudentImportRows(
  rawRows: StudentImportRawRow[],
  sections: Section[] | null,
): StudentImportRow[] {
  const firstRowByLrn = new Map<string, number>();

  return rawRows.map((raw) => {
    const errors: string[] = [];
    let sectionId: number | null = null;

    const parsed = importRowSchema.safeParse({
      lrn: raw.lrn,
      firstName: raw.firstName,
      middleName: raw.middleName,
      lastName: raw.lastName,
      extension: raw.extension,
      parentMobileNo: raw.parentMobileNo,
      parentEmail: raw.parentEmail,
      studentPicUrl: "",
    });

    if (!parsed.success) {
      for (const issue of parsed.error.issues) {
        if (!errors.includes(issue.message)) {
          errors.push(issue.message);
        }
      }
    }

    if (raw.parentEmail && !EMAIL_PATTERN.test(raw.parentEmail)) {
      errors.push("Parent email is not a valid email address.");
    }

    if (!raw.gradeName) {
      errors.push("Grade is required.");
    }

    if (!raw.sectionName) {
      errors.push("Section is required.");
    }

    if (raw.lrn) {
      const firstRow = firstRowByLrn.get(raw.lrn);

      if (firstRow !== undefined) {
        errors.push(`Duplicate LRN (already used on row ${firstRow}).`);
      } else {
        firstRowByLrn.set(raw.lrn, raw.rowNumber);
      }
    }

    if (sections && raw.gradeName && raw.sectionName) {
      const inGrade = sections.filter((section) =>
        gradeMatches(section.gradeName, raw.gradeName),
      );

      if (inGrade.length === 0) {
        errors.push(`Grade "${raw.gradeName}" was not found.`);
      } else {
        const match = inGrade.find(
          (section) => normalize(section.name) === normalize(raw.sectionName),
        );

        if (match) {
          sectionId = match.id;
        } else {
          errors.push(
            `Section "${raw.sectionName}" was not found in ${inGrade[0].gradeName}.`,
          );
        }
      }
    }

    return { ...raw, errors, sectionId };
  });
}
