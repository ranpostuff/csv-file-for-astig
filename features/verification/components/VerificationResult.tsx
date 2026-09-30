import { CheckCircle2, LogIn, LogOut } from "lucide-react";

import type { VerificationResponse } from "../types/verification";
import { StudentAvatar } from "./StudentAvatar";

type VerificationResultProps = {
  student: VerificationResponse;
};

function formatVerifiedAt(value: string) {
  return new Intl.DateTimeFormat("en-PH", {
    hour: "numeric",
    minute: "2-digit",
    second: "2-digit",
    hour12: true,
  }).format(new Date(value));
}

export function VerificationResult({ student }: VerificationResultProps) {
  const isEntry = student.isEntry;

  return (
    <div className="relative flex w-full max-w-2xl flex-col items-center rounded-[2rem] border border-white/60 bg-white/90 px-8 py-10 text-center shadow-2xl backdrop-blur-xl sm:px-12">
      <div className="mb-5 flex items-center gap-2 rounded-full bg-rose-100 px-4 py-2 text-sm font-semibold text-rose-900">
        <CheckCircle2 className="h-5 w-5" />

        <span>VERIFIED</span>
      </div>

      <div
        className={`mb-6 flex items-center gap-2 text-sm font-bold uppercase tracking-[0.2em] ${
          isEntry ? "text-rose-700" : "text-slate-700"
        }`}
      >
        {isEntry ? (
          <LogIn className="h-4 w-4" />
        ) : (
          <LogOut className="h-4 w-4" />
        )}

        {isEntry ? "Entry" : "Exit"}
      </div>

      <StudentAvatar
        firstName={student.firstName}
        lastName={student.lastName}
        profilePicture={student.studentProfilePic}
      />

      <div className="mt-6">
        <h2 className="text-3xl font-bold tracking-tight text-slate-900 sm:text-4xl">
          {student.firstName}{" "}
          {student.middleName ? `${student.middleName} ` : ""}
          {student.lastName}
          {student.extension ? ` ${student.extension}` : ""}
        </h2>

        <p className="mt-2 text-lg font-medium text-slate-600">
          {student.gradeName} <span className="text-rose-500">•</span>{" "}
          {student.sectionName}
        </p>
      </div>

      <div className="mt-8 border-t border-slate-200 pt-5 text-sm text-slate-500">
        Verified at{" "}
        <span className="font-semibold text-slate-700">
          {formatVerifiedAt(student.verifiedAt)}
        </span>
      </div>
    </div>
  );
}
