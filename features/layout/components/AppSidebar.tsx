import { useState } from "react";
import {
  BookOpen,
  ChevronLeft,
  ChevronRight,
  GraduationCap,
  LayoutDashboard,
  School,
  Users,
  UserRound,
  X,
  LogOut,
  Verified,
} from "lucide-react";
import { NavLink } from "react-router";
import { useAuth } from "../../auth/hooks/useAuth";

type AppSidebarProps = {
  collapsed: boolean;
  onToggle: () => void;
};

const navigation = [
  {
    label: "Dashboard",
    to: "/",
    icon: LayoutDashboard,
  },
  {
    label: "Students",
    to: "/students",
    icon: Users,
  },
  {
    label: "Teachers",
    to: "/teachers",
    icon: UserRound,
  },
  {
    label: "Grades",
    to: "/grades",
    icon: GraduationCap,
  },
  {
    label: "Sections",
    to: "/sections",
    icon: School,
  },
  {
    label: "Verification",
    to: "/verification",
    icon: Verified,
  },
];

export function AppSidebar({ collapsed, onToggle }: AppSidebarProps) {
  const [mobileOpen, setMobileOpen] = useState(false);
  const { logout } = useAuth();

  return (
    <>
      {/* Mobile overlay */}
      {mobileOpen && (
        <button
          type="button"
          aria-label="Close sidebar"
          onClick={() => setMobileOpen(false)}
          className="fixed inset-0 z-40 bg-black/40 lg:hidden"
        />
      )}

      <aside
        className={`
          fixed inset-y-0 left-0 z-50
          flex flex-col
          bg-rose-950 text-white
          transition-all duration-300
          lg:z-40
          ${collapsed ? "lg:w-20" : "lg:w-64"}
          ${mobileOpen ? "translate-x-0" : "-translate-x-full"}
          lg:translate-x-0
        `}
      >
        {/* Logo */}
        <div className="flex h-16 items-center border-b border-white/10 px-4">
          <div className="flex min-w-0 items-center gap-3">
            <div className="flex h-9 w-9 shrink-0 items-center justify-center rounded-lg bg-white/10 font-bold">
              A
            </div>

            {!collapsed && (
              <div className="min-w-0">
                <p className="font-bold tracking-wide">ASTIG</p>
                <p className="truncate text-xs text-rose-200">
                  School Management
                </p>
              </div>
            )}
          </div>

          {/* Mobile close */}
          <button
            type="button"
            onClick={() => setMobileOpen(false)}
            className="ml-auto rounded-lg p-2 hover:bg-white/10 lg:hidden"
            aria-label="Close sidebar"
          >
            <X className="h-5 w-5" />
          </button>
        </div>

        {/* Navigation */}
        <nav className="flex-1 space-y-1 p-3">
          {navigation.map((item) => {
            const Icon = item.icon;

            return (
              <NavLink
                key={item.to}
                to={item.to}
                end={item.to === "/dashboard"}
                onClick={() => setMobileOpen(false)}
                title={collapsed ? item.label : undefined}
                className={({ isActive }) =>
                  `
                    flex items-center gap-3 rounded-lg
                    px-3 py-2.5
                    text-sm font-medium
                    transition-colors
                    ${
                      isActive
                        ? "bg-white text-rose-950"
                        : "text-rose-100 hover:bg-white/10"
                    }
                    ${collapsed ? "lg:justify-center" : ""}
                  `
                }
              >
                <Icon className="h-5 w-5 shrink-0" />

                {!collapsed && <span>{item.label}</span>}
              </NavLink>
            );
          })}
        </nav>

        <div className="border-t border-white/10 p-3">
          <button
            type="button"
            onClick={logout}
            title={collapsed ? "Logout" : undefined}
            className={`
              flex w-full items-center gap-3 rounded-lg
              px-3 py-2.5
              text-sm font-medium
              text-rose-100
              transition-colors
              hover:bg-white/10
              ${collapsed ? "lg:justify-center" : ""}
            `}
          >
            <LogOut className="h-5 w-5 shrink-0" />

            {!collapsed && <span>Logout</span>}
          </button>
        </div>

        {/* Collapse */}
        <div className="hidden border-t border-white/10 p-3 lg:block">
          <button
            type="button"
            onClick={onToggle}
            className="flex w-full items-center justify-center rounded-lg p-2 text-rose-100 hover:bg-white/10"
            aria-label={collapsed ? "Expand sidebar" : "Collapse sidebar"}
          >
            {collapsed ? (
              <ChevronRight className="h-5 w-5" />
            ) : (
              <ChevronLeft className="h-5 w-5" />
            )}
          </button>
        </div>
      </aside>

      {/* Mobile menu trigger */}
      <button
        type="button"
        onClick={() => setMobileOpen(true)}
        className="fixed left-4 top-4 z-30 rounded-lg bg-rose-900 p-2 text-white shadow-lg lg:hidden"
        aria-label="Open sidebar"
      >
        <BookOpen className="h-5 w-5" />
      </button>
    </>
  );
}
