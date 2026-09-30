import { useState } from "react";

import { useQueryClient } from "@tanstack/react-query";

import { getErrorMessage } from "../../../utils/getErrorMessage";
import { studentService } from "../services/studentService";
import { studentKeys } from "./studentKeys";

import type {
  StudentImportOutcome,
  StudentImportRow,
} from "../types/studentImport";

/**
 * FRONT-END DEMO SWITCH
 * true  -> nothing is sent to the API; each row is "imported" locally so you
 *          can see the whole flow working without a backend.
 * false -> every valid row is sent to POST /Student (one request per row).
 */
export const SIMULATE_IMPORT = true;

function wait(ms: number) {
  return new Promise((resolve) => setTimeout(resolve, ms));
}

function fullName(row: StudentImportRow) {
  return [row.firstName, row.middleName, row.lastName, row.extension]
    .filter(Boolean)
    .join(" ");
}

export function useImportStudents() {
  const queryClient = useQueryClient();

  const [isImporting, setIsImporting] = useState(false);
  const [progress, setProgress] = useState({ done: 0, total: 0 });

  async function importStudents(
    rows: StudentImportRow[],
  ): Promise<StudentImportOutcome[]> {
    const outcomes: StudentImportOutcome[] = [];

    setIsImporting(true);
    setProgress({ done: 0, total: rows.length });

    for (const row of rows) {
      const base = {
        rowNumber: row.rowNumber,
        lrn: row.lrn,
        name: fullName(row),
      };

      try {
        if (SIMULATE_IMPORT) {
          await wait(120);
        } else {
          if (row.sectionId === null) {
            throw new Error("Section could not be matched.");
          }

          await studentService.create({
            lrn: row.lrn,
            firstName: row.firstName,
            middleName: row.middleName || null,
            lastName: row.lastName,
            extension: row.extension || null,
            parentMobileNo: row.parentMobileNo,
            parentEmail: row.parentEmail || null,
            studentPicUrl: null,
            sectionId: row.sectionId,
          });
        }

        outcomes.push({ ...base, status: "success" });
      } catch (error) {
        outcomes.push({
          ...base,
          status: "failed",
          message: getErrorMessage(error),
        });
      }

      setProgress((current) => ({ ...current, done: current.done + 1 }));
    }

    if (!SIMULATE_IMPORT) {
      await queryClient.invalidateQueries({ queryKey: studentKeys.lists() });
    }

    setIsImporting(false);

    return outcomes;
  }

  return { importStudents, isImporting, progress };
}
