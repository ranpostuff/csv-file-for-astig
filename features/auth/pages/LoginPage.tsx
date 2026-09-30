import { LoginForm } from "../components/LoginForm";
import { useLogin } from "../hooks/useLogin";

export default function LoginPage() {
  const { login, isPending } = useLogin();

  return (
    <main className="min-h-screen bg-stone-50">
      <div className="flex min-h-screen flex-col lg:flex-row">
        {/* Branding Section */}
        <section className="relative flex min-h-[240px] flex-1 items-center justify-center overflow-hidden bg-rose-900 px-6 py-12 text-white lg:min-h-screen lg:px-12">
          {/* Decorative shapes */}
          <div className="absolute -right-24 -top-24 h-64 w-64 rounded-full bg-rose-800 opacity-60" />
          <div className="absolute -bottom-32 -left-20 h-72 w-72 rounded-full bg-rose-950 opacity-50" />

          <div className="relative z-10 max-w-lg text-center lg:text-left">
            <div className="mb-6 flex items-center justify-center gap-3 lg:justify-start">
              <div className="flex h-12 w-12 items-center justify-center rounded-xl bg-white/10 text-xl font-bold ring-1 ring-white/20">
                A
              </div>

              <span className="text-2xl font-bold tracking-wide">ASTIG</span>
            </div>

            <h1 className="text-3xl font-bold tracking-tight sm:text-4xl lg:text-5xl">
              Academic Student Tracking & Information Gateway
            </h1>

            <p className="mt-5 text-sm leading-6 text-rose-100 sm:text-base">
              A centralized platform for managing students, teachers, grades,
              sections, and academic information.
            </p>
          </div>
        </section>

        {/* Login Section  */}
        <section className="flex flex-1 items-center justify-center px-5 py-10 sm:px-8 lg:px-12">
          <div className="w-full max-w-md">
            <div className="rounded-2xl border border-stone-200 bg-white p-6 shadow-sm sm:p-8">
              <div className="mb-8">
                <p className="text-sm font-semibold text-rose-700">
                  Welcome back
                </p>

                <h2 className="mt-1 text-2xl font-bold tracking-tight text-stone-900 sm:text-3xl">
                  Sign in to ASTIG
                </h2>

                <p className="mt-2 text-sm text-stone-500">
                  Enter your credentials to access the system.
                </p>
              </div>

              <LoginForm onSubmit={login} isPending={isPending} />
            </div>

            <p className="mt-6 text-center text-xs text-stone-400">
              ASTIG · Academic Student Tracking & Information Gateway
            </p>
          </div>
        </section>
      </div>
    </main>
  );
}
