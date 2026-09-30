import axios from "axios";
import type { ProblemDetails } from "../types/problemDetails";

export function getErrorMessage(error: unknown): string {
  if (axios.isAxiosError(error)) {
    // console.log(error);
    const problem = error.response?.data as ProblemDetails | undefined;

    if (problem?.detail) {
      return problem.detail;
    }

    if (problem?.title) {
      return problem.title;
    }

    return error.message;
  }

  if (error instanceof Error) {
    return error.message;
  }

  return "An unexpected error occurred.";
}
