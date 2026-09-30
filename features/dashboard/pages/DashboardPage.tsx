import SchoolYearDashboardCards from "../../schoolYear/components/SchoolYearDashboardCards";

export default function DashboardPage() {
  return (
    <main className="min-h-screen bg-stone-50 p-8">
      <h1 className="text-3xl font-bold text-rose-900">ASTIG Dashboard</h1>

      <p className="mt-2 text-stone-600">Welcome to the ASTIG dashboard.</p>

      <SchoolYearDashboardCards />
    </main>
  );
}
