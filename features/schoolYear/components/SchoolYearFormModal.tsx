import { X } from "lucide-react";
import { useState } from "react";

import { useCreateSchoolYear } from "../hooks/useCreateSchoolYear";

interface SchoolYearFormModalProps {
  isOpen: boolean;
  onClose: () => void;
}

export default function SchoolYearFormModal({
  isOpen,
  onClose,
}: SchoolYearFormModalProps) {
  const createSchoolYear = useCreateSchoolYear();

  const [name, setName] = useState("");
  const [startDate, setStartDate] = useState("");
  const [endDate, setEndDate] = useState("");

  if (!isOpen) {
    return null;
  }

  const handleSubmit = (event: React.FormEvent<HTMLFormElement>) => {
    event.preventDefault();

    createSchoolYear.mutate(
      {
        name,
        startDate,
        endDate,
      },
      {
        onSuccess: () => {
          setName("");
          setStartDate("");
          setEndDate("");
          onClose();
        },
      },
    );
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/40 p-4">
      <div className="w-full max-w-lg rounded-2xl bg-white shadow-xl">
        {/* Header */}
        <div className="flex items-center justify-between border-b border-stone-100 p-6">
          <div>
            <h2 className="text-xl font-semibold text-rose-900">
              Create School Year
            </h2>

            <p className="mt-1 text-sm text-stone-500">
              Add a new school year configuration.
            </p>
          </div>

          <button
            type="button"
            onClick={onClose}
            className="rounded-lg p-2 text-stone-400 transition hover:bg-stone-100 hover:text-stone-600"
          >
            <X size={20} />
          </button>
        </div>

        {/* Form */}
        <form onSubmit={handleSubmit} className="space-y-5 p-6">
          <div>
            <label
              htmlFor="schoolYearName"
              className="mb-2 block text-sm font-medium text-stone-700"
            >
              School Year
            </label>

            <input
              id="schoolYearName"
              type="text"
              value={name}
              onChange={(event) => setName(event.target.value)}
              placeholder="e.g. 2026-2027"
              required
              className="w-full rounded-xl border border-stone-200 px-4 py-2.5 text-sm outline-none transition focus:border-rose-500 focus:ring-2 focus:ring-rose-100"
            />
          </div>

          <div>
            <label
              htmlFor="schoolYearStartDate"
              className="mb-2 block text-sm font-medium text-stone-700"
            >
              Start Date
            </label>

            <input
              id="schoolYearStartDate"
              type="date"
              value={startDate}
              onChange={(event) => setStartDate(event.target.value)}
              required
              className="w-full rounded-xl border border-stone-200 px-4 py-2.5 text-sm outline-none transition focus:border-rose-500 focus:ring-2 focus:ring-rose-100"
            />
          </div>

          <div>
            <label
              htmlFor="schoolYearEndDate"
              className="mb-2 block text-sm font-medium text-stone-700"
            >
              End Date
            </label>

            <input
              id="schoolYearEndDate"
              type="date"
              value={endDate}
              onChange={(event) => setEndDate(event.target.value)}
              required
              className="w-full rounded-xl border border-stone-200 px-4 py-2.5 text-sm outline-none transition focus:border-rose-500 focus:ring-2 focus:ring-rose-100"
            />
          </div>

          <div className="flex justify-end gap-3 pt-2">
            <button
              type="button"
              onClick={onClose}
              className="rounded-xl border border-stone-200 px-4 py-2.5 text-sm font-medium text-stone-600 transition hover:bg-stone-50"
            >
              Cancel
            </button>

            <button
              type="submit"
              disabled={createSchoolYear.isPending}
              className="rounded-xl bg-rose-900 px-5 py-2.5 text-sm font-medium text-white transition hover:bg-rose-800 disabled:cursor-not-allowed disabled:opacity-50"
            >
              {createSchoolYear.isPending
                ? "Creating..."
                : "Create School Year"}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}
