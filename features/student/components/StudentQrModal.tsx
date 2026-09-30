import { useEffect, useState } from "react";

import { Download, Loader2, X } from "lucide-react";
import QRCode from "qrcode";

import type { StudentDetails } from "../types/student";

interface StudentQrModalProps {
  isOpen: boolean;
  student?: StudentDetails | null;
  onClose: () => void;
}

function createFileName(student: StudentDetails) {
  const name = [
    student.firstName,
    student.middleName,
    student.lastName,
    student.extension,
  ]
    .filter((value) => value && value.trim())
    .map((value) =>
      value!
        .trim()
        .replace(/\s+/g, "-")
        .replace(/[^a-zA-Z0-9-]/g, ""),
    )
    .join("-");

  return `${name}.jpg`;
}

export function StudentQrModal({
  isOpen,
  student,
  onClose,
}: StudentQrModalProps) {
  const [qrDataUrl, setQrDataUrl] = useState<string | null>(null);
  const [isGenerating, setIsGenerating] = useState(false);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    if (!isOpen || !student) {
      setQrDataUrl(null);
      setError(null);
      setIsGenerating(false);
      return;
    }

    const currentStudent = student;
    let cancelled = false;

    async function generateQr() {
      setIsGenerating(true);
      setError(null);
      setQrDataUrl(null);

      try {
        const canvas = document.createElement("canvas");

        await QRCode.toCanvas(canvas, currentStudent.lrn, {
          width: 500,
          margin: 2,
          errorCorrectionLevel: "H",
        });

        if (cancelled) {
          return;
        }

        const dataUrl = canvas.toDataURL("image/jpeg", 0.95);

        setQrDataUrl(dataUrl);
      } catch (error) {
        console.error("Failed to generate student QR code:", error);

        if (!cancelled) {
          setError("Unable to generate the QR code.");
        }
      } finally {
        if (!cancelled) {
          setIsGenerating(false);
        }
      }
    }

    generateQr();

    return () => {
      cancelled = true;
    };
  }, [isOpen, student]);

  if (!isOpen) {
    return null;
  }

  function handleDownload() {
    if (!qrDataUrl || !student) {
      return;
    }

    const link = document.createElement("a");

    link.href = qrDataUrl;
    link.download = createFileName(student);

    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
  }

  const studentName = student
    ? [
        student.firstName,
        student.middleName,
        student.lastName,
        student.extension,
      ]
        .filter((value) => value && value.trim())
        .join(" ")
    : "";

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/50 p-4">
      <div className="w-full max-w-md rounded-xl bg-white shadow-xl">
        {/* Header */}
        <div className="flex items-center justify-between border-b border-slate-200 px-6 py-4">
          <div>
            <h2 className="text-lg font-semibold text-slate-900">
              Student QR Code
            </h2>

            <p className="mt-1 text-sm text-slate-500">
              QR code generated from the student's LRN.
            </p>
          </div>

          <button
            type="button"
            onClick={onClose}
            className="rounded-lg p-2 text-slate-500 transition hover:bg-slate-100 hover:text-slate-700"
          >
            <X className="h-5 w-5" />
          </button>
        </div>

        {/* Content */}
        <div className="p-6">
          {!student ? (
            <div className="py-10 text-center text-sm text-slate-500">
              Student information could not be loaded.
            </div>
          ) : (
            <div className="space-y-5">
              {/* Student */}
              <div className="text-center">
                <p className="text-sm font-semibold text-slate-900">
                  {studentName}
                </p>

                <p className="mt-1 text-sm text-slate-500">
                  LRN: {student.lrn}
                </p>
              </div>

              {/* QR */}
              <div className="flex min-h-[300px] items-center justify-center rounded-xl border border-slate-200 bg-slate-50 p-6">
                {isGenerating ? (
                  <div className="flex flex-col items-center gap-3">
                    <Loader2 className="h-7 w-7 animate-spin text-rose-900" />

                    <p className="text-sm text-slate-500">
                      Generating QR code...
                    </p>
                  </div>
                ) : error ? (
                  <div className="text-center">
                    <p className="text-sm font-medium text-red-600">{error}</p>

                    <p className="mt-1 text-xs text-slate-500">
                      Please close the modal and try again.
                    </p>
                  </div>
                ) : qrDataUrl ? (
                  <div className="rounded-xl bg-white p-4 shadow-sm">
                    <img
                      src={qrDataUrl}
                      alt={`QR code for ${studentName}`}
                      className="h-64 w-64"
                    />
                  </div>
                ) : (
                  <p className="text-sm text-slate-500">
                    QR code is unavailable.
                  </p>
                )}
              </div>
            </div>
          )}
        </div>

        {/* Footer */}
        <div className="flex justify-end gap-3 border-t border-slate-200 px-6 py-4">
          <button
            type="button"
            onClick={onClose}
            className="rounded-lg border border-slate-300 px-4 py-2.5 text-sm font-medium text-slate-700 transition hover:bg-slate-50"
          >
            Close
          </button>

          <button
            type="button"
            onClick={handleDownload}
            disabled={!qrDataUrl || isGenerating || !student}
            className="inline-flex items-center gap-2 rounded-lg bg-rose-950 px-4 py-2.5 text-sm font-medium text-white transition hover:bg-rose-900 disabled:cursor-not-allowed disabled:opacity-50"
          >
            {isGenerating ? (
              <Loader2 className="h-4 w-4 animate-spin" />
            ) : (
              <Download className="h-4 w-4" />
            )}
            Download QR
          </button>
        </div>
      </div>
    </div>
  );
}
