import { ArrowLeft, Plus } from "lucide-react";
import { useState } from "react";
import { useNavigate } from "react-router";

import SchoolYearFormModal from "../components/SchoolYearFormModal";
import SchoolYearTable from "../components/SchoolYearTable";

export default function SchoolYearConfigPage() {
  const navigate = useNavigate();

  const [isCreateModalOpen, setIsCreateModalOpen] = useState(false);

  return (
    <main className="min-h-screen bg-stone-50 p-8">
      {/* Header */}
      <div className="mb-8">
        <button
          type="button"
          onClick={() => navigate("/")}
          className="
            mb-4
            inline-flex items-center gap-1.5
            rounded-lg
            px-3 py-2
            text-sm font-medium
            text-rose-700
            transition-colors
            hover:bg-rose-100
            cursor-pointer
          "
        >
          <ArrowLeft className="h-4 w-4" />
          Back to Dashboard
        </button>

        <div className="flex flex-col gap-4 sm:flex-row sm:items-end sm:justify-between">
          <div>
            <h1 className="text-3xl font-bold text-rose-900">
              School Year Configurations
            </h1>

            <p className="mt-2 text-stone-600">
              Manage school year and set the active school year.
            </p>
          </div>

          <button
            type="button"
            onClick={() => setIsCreateModalOpen(true)}
            className="
              inline-flex items-center justify-center gap-1.5
              rounded-lg
              bg-rose-900
              px-4 py-2.5
              text-sm font-medium
              text-white
              shadow-sm
              transition-colors
              hover:bg-rose-800
              cursor-pointer
            "
          >
            <Plus className="h-4 w-4" />
            Create School Year
          </button>
        </div>
      </div>

      {/* School Year Table */}
      <SchoolYearTable />

      {/* Create Modal */}
      <SchoolYearFormModal
        isOpen={isCreateModalOpen}
        onClose={() => setIsCreateModalOpen(false)}
      />
    </main>
  );
}
