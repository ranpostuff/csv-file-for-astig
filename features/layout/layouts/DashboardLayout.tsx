import { useState } from "react";
import { Outlet } from "react-router";
import { AppSidebar } from "../../layout/components/AppSidebar";
import { AppHeader } from "../../layout/components/AppHeader";

export default function DashboardLayout() {
  const [collapsed, setCollapsed] = useState(false);

  return (
    <div className="min-h-screen bg-rose-50/30">
      <AppSidebar
        collapsed={collapsed}
        onToggle={() => setCollapsed((value) => !value)}
      />

      <div
        className={`
          transition-all duration-300
          ${collapsed ? "lg:pl-20" : "lg:pl-64"}
        `}
      >
        <AppHeader />

        <main className="min-w-0 p-4 sm:p-4 lg:p-6">
          <Outlet />
        </main>
      </div>
    </div>
  );
}
