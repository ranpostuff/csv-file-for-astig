import { Spinner } from "./Spinner";

export function LoadingScreen() {
  return (
    <div className="flex min-h-screen items-center justify-center bg-rose-50">
      <div className="flex flex-col items-center gap-4">
        <div className="flex h-14 w-14 items-center justify-center rounded-2xl bg-rose-950 text-white shadow-lg">
          <Spinner size="md" />
        </div>

        <div className="text-center">
          <p className="font-semibold text-rose-950">ASTIG</p>

          <p className="text-sm text-slate-500">Loading...</p>
        </div>
      </div>
    </div>
  );
}
