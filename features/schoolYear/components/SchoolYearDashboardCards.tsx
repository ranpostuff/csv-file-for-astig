import { CalendarDays, Settings2 } from "lucide-react";
import { useNavigate } from "react-router";

import { useActiveSchoolYear } from "../hooks/useActiveSchoolYear";

export default function SchoolYearDashboardCards() {
  const navigate = useNavigate();

  const { data: schoolYear, isLoading } = useActiveSchoolYear();

  const formatDate = (date: string) =>
    new Date(date).toLocaleDateString("en-US", {
      month: "short",
      day: "numeric",
      year: "numeric",
    });

  const renderValue = (value: string) => {
    if (isLoading) {
      return <div className="h-7 w-32 animate-pulse rounded-md bg-stone-200" />;
    }

    return value;
  };

  return (
    <section className="mt-8">
      <h2 className="mb-4 text-lg font-semibold text-stone-800">School Year</h2>

      <div className="grid grid-cols-1 gap-4 sm:grid-cols-2 xl:grid-cols-4">
        {/* Current School Year */}
        <div className="rounded-2xl border border-rose-100 bg-white p-5 shadow-sm">
          <p className="text-sm font-medium text-stone-500">
            Current School Year
          </p>

          <div className="mt-3">
            {isLoading ? (
              <div className="h-7 w-32 animate-pulse rounded-md bg-stone-200" />
            ) : schoolYear ? (
              <>
                <p className="text-2xl font-bold text-rose-900">
                  {schoolYear.name}
                </p>

                <span className="mt-2 inline-flex rounded-full bg-rose-50 px-3 py-1 text-xs font-medium text-rose-700">
                  Active
                </span>
              </>
            ) : (
              <p className="text-2xl font-bold text-stone-400">N/A</p>
            )}
          </div>
        </div>

        {/* Start Date */}
        <div className="rounded-2xl border border-rose-100 bg-white p-5 shadow-sm">
          <div className="flex items-center gap-3">
            <div className="rounded-xl bg-rose-50 p-2 text-rose-700">
              <CalendarDays size={20} />
            </div>

            <p className="text-sm font-medium text-stone-500">Start Date</p>
          </div>

          <div className="mt-4">
            {isLoading ? (
              <div className="h-7 w-32 animate-pulse rounded-md bg-stone-200" />
            ) : (
              <p className="text-xl font-semibold text-stone-800">
                {schoolYear ? formatDate(schoolYear.startDate) : "N/A"}
              </p>
            )}
          </div>
        </div>

        {/* End Date */}
        <div className="rounded-2xl border border-rose-100 bg-white p-5 shadow-sm">
          <div className="flex items-center gap-3">
            <div className="rounded-xl bg-rose-50 p-2 text-rose-700">
              <CalendarDays size={20} />
            </div>

            <p className="text-sm font-medium text-stone-500">End Date</p>
          </div>

          <div className="mt-4">
            {isLoading ? (
              <div className="h-7 w-32 animate-pulse rounded-md bg-stone-200" />
            ) : (
              <p className="text-xl font-semibold text-stone-800">
                {schoolYear ? formatDate(schoolYear.endDate) : "N/A"}
              </p>
            )}
          </div>
        </div>

        {/* Configuration */}
        <button
          type="button"
          onClick={() => navigate("/admin/syconfigs")}
          className="group rounded-2xl border border-rose-200 bg-gradient-to-br from-rose-900 to-pink-800 p-5 text-left shadow-sm transition hover:-translate-y-0.5 hover:shadow-md cursor-pointer"
        >
          <div className="flex items-center justify-between">
            <div className="rounded-xl bg-white/10 p-2 text-white">
              <Settings2 size={20} />
            </div>

            <span className="text-white/70 transition group-hover:translate-x-1">
              →
            </span>
          </div>

          <p className="mt-5 text-sm font-medium text-white/80">
            SY Configurations
          </p>

          <p className="mt-1 text-lg font-semibold text-white">
            Manage School Year
          </p>
        </button>
      </div>
    </section>
  );
}
