import { Bell } from "lucide-react";
import { useAuth } from "../../auth/hooks/useAuth";

export function AppHeader() {
  const { auth } = useAuth();

  const fullName = [auth?.firstName, auth?.lastName].filter(Boolean).join(" ");

  return (
    <header className="sticky top-0 z-30 flex h-16 items-center justify-between border-b border-stone-200 bg-white px-4 sm:px-6">
      <div className="pl-10 lg:pl-0">
        <p className="text-sm text-stone-500">Welcome back,</p>
        <p className="font-semibold text-stone-900">{fullName || "User"}</p>
      </div>

      <button
        type="button"
        className="rounded-lg p-2 text-stone-500 hover:bg-stone-100 hover:text-stone-900"
        aria-label="Notifications"
      >
        <Bell className="h-5 w-5" />
      </button>
    </header>
  );
}
