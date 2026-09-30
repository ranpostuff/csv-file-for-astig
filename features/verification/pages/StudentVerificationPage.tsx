import { Clock3, Keyboard, ShieldCheck, X } from "lucide-react";
import { useCallback, useEffect, useRef, useState } from "react";
import { useNavigate } from "react-router";

import { ConnectionStatus } from "../components/ConnectionStatus";
import { SchoolLogoBackground } from "../components/SchoolLogoBackground";
import { VerificationResult } from "../components/VerificationResult";
import { useVerificationSignalR } from "../hooks/useVerificationSignalR";

import type {
  VerificationResponse,
  VerificationSignalRResponse,
  VerificationState,
} from "../types/verification";

export function StudentVerificationPage() {
  const navigate = useNavigate();

  const [state, setState] = useState<VerificationState>("idle");

  const [student, setStudent] = useState<VerificationResponse | null>(null);

  const [message, setMessage] = useState("");

  const [currentTime, setCurrentTime] = useState(new Date());

  const scannerBuffer = useRef("");

  const scannerTimer = useRef<ReturnType<typeof setTimeout> | null>(null);

  const resultTimer = useRef<ReturnType<typeof setTimeout> | null>(null);

  /*
   * Handle the response coming from:
   *
   * connection.on("VerificationResult", ...)
   */
  const handleVerificationResult = useCallback(
    (response: VerificationSignalRResponse) => {
      setMessage(response.message);
      setStudent(response.result);

      /*
       * Clear an existing result timer.
       *
       * This is useful if another result arrives before
       * the previous five-second timer finishes.
       */
      if (resultTimer.current) {
        clearTimeout(resultTimer.current);
      }

      if (response.result) {
        setState("success");

        /*
         * Keep the student's information visible for
         * five seconds.
         */
        resultTimer.current = setTimeout(() => {
          setStudent(null);
          setMessage("");
          setState("idle");
        }, 5000);

        return;
      }

      /*
       * Backend responded but there is no student result.
       */
      setState("error");

      resultTimer.current = setTimeout(() => {
        setStudent(null);
        setMessage("");
        setState("idle");
      }, 5000);
    },
    [],
  );

  const { connectionState, isVerifying, verify } = useVerificationSignalR(
    handleVerificationResult,
  );

  /*
   * Live clock
   */
  useEffect(() => {
    const timer = setInterval(() => {
      setCurrentTime(new Date());
    }, 1000);

    return () => {
      clearInterval(timer);
    };
  }, []);

  /*
   * HID barcode scanner
   *
   * Most barcode scanners operating in keyboard/HID mode
   * behave roughly like:
   *
   * 123456789012
   * Enter
   *
   * We keep the scanned characters in a ref so that each
   * character doesn't cause a React render.
   */
  useEffect(() => {
    const handleKeyDown = async (event: KeyboardEvent) => {
      /*
       * Escape exits the verification terminal.
       */
      if (event.key === "Escape") {
        event.preventDefault();

        navigate("/");
        return;
      }

      /*
       * While waiting for SignalR, completely ignore
       * additional scanner input.
       */
      if (isVerifying) {
        return;
      }

      /*
       * Ignore browser/system shortcuts.
       */
      if (event.ctrlKey || event.altKey || event.metaKey) {
        return;
      }

      /*
       * Barcode scanners normally send Enter after
       * the barcode.
       */
      if (event.key === "Enter") {
        event.preventDefault();

        const lrn = scannerBuffer.current.trim();

        scannerBuffer.current = "";

        if (!lrn) {
          return;
        }

        /*
         * Lock the kiosk immediately.
         *
         * We don't wait for SignalR before changing
         * the visual state.
         */
        setState("verifying");
        setStudent(null);
        setMessage("");

        const result = await verify(lrn);

        /*
         * The invoke itself failed.
         *
         * This is different from a backend verification
         * failure. In that case SignalR will call
         * VerificationResult and handleVerificationResult()
         * will process it.
         */
        if (!result.success) {
          setState("error");

          setMessage(
            result.reason === "not-connected"
              ? "The verification service is currently unavailable."
              : "Unable to send the verification request.",
          );

          /*
           * Give the guard five seconds to see the error,
           * then return to the ready state.
           */
          if (resultTimer.current) {
            clearTimeout(resultTimer.current);
          }

          resultTimer.current = setTimeout(() => {
            setStudent(null);
            setMessage("");
            setState("idle");
          }, 5000);
        }

        return;
      }

      /*
       * Ignore non-character keys.
       *
       * This prevents keys such as Shift, Tab, F1, etc.
       * from being added to the scanner buffer.
       */
      if (event.key.length !== 1) {
        return;
      }

      scannerBuffer.current += event.key;

      /*
       * Barcode scanners send their characters very quickly.
       *
       * If we don't receive another character within 100ms,
       * assume the current buffer was stale and clear it.
       */
      if (scannerTimer.current) {
        clearTimeout(scannerTimer.current);
      }

      scannerTimer.current = setTimeout(() => {
        scannerBuffer.current = "";
      }, 100);
    };

    window.addEventListener("keydown", handleKeyDown);

    return () => {
      window.removeEventListener("keydown", handleKeyDown);

      if (scannerTimer.current) {
        clearTimeout(scannerTimer.current);
      }
    };
  }, [isVerifying, navigate, verify]);

  /*
   * Cleanup result timer.
   */
  useEffect(() => {
    return () => {
      if (resultTimer.current) {
        clearTimeout(resultTimer.current);
      }
    };
  }, []);

  const time = new Intl.DateTimeFormat("en-PH", {
    hour: "numeric",
    minute: "2-digit",
    second: "2-digit",
    hour12: true,
  }).format(currentTime);

  const date = new Intl.DateTimeFormat("en-PH", {
    weekday: "long",
    month: "long",
    day: "numeric",
    year: "numeric",
  }).format(currentTime);

  return (
    <main className="relative min-h-screen overflow-hidden bg-gradient-to-br from-rose-950 via-rose-900 to-pink-900">
      <SchoolLogoBackground />

      <div className="relative z-10 flex min-h-screen flex-col">
        {/* Header */}
        <header className="flex items-center justify-between border-b border-white/10 bg-black/10 px-5 py-4 backdrop-blur-md sm:px-8">
          {/* Branding */}
          <div className="flex items-center gap-3">
            <div className="flex h-10 w-10 shrink-0 items-center justify-center rounded-xl bg-white text-lg font-black text-rose-950 shadow-lg">
              A
            </div>

            <div>
              <p className="font-bold tracking-wide text-white">ASTIG</p>

              <p className="hidden text-xs text-rose-200 sm:block">
                Student Verification
              </p>
            </div>
          </div>

          {/* Header information */}
          <div className="flex items-center gap-3">
            <ConnectionStatus state={connectionState} />

            <div className="hidden items-center gap-2 text-right text-white sm:flex">
              <Clock3 className="h-4 w-4 text-rose-200" />

              <div>
                <p className="text-sm font-semibold">{time}</p>

                <p className="text-xs text-rose-200">{date}</p>
              </div>
            </div>
          </div>
        </header>

        {/* Main verification area */}
        <section className="flex flex-1 items-center justify-center px-4 py-8 sm:px-8">
          {/* SUCCESS */}
          {state === "success" && student ? (
            <VerificationResult student={student} />
          ) : (
            <div className="flex w-full max-w-2xl flex-col items-center text-center text-white">
              {/* ERROR */}
              {state === "error" ? (
                <>
                  <div className="flex h-20 w-20 items-center justify-center rounded-full bg-white/10 ring-1 ring-white/20">
                    <X className="h-10 w-10 text-rose-200" />
                  </div>

                  <h1 className="mt-6 text-3xl font-bold sm:text-4xl">
                    Verification Failed
                  </h1>

                  <p className="mt-3 max-w-md text-rose-100">
                    {message || "The student could not be verified."}
                  </p>

                  <p className="mt-8 text-sm text-rose-200">
                    Ready for the next scan
                  </p>
                </>
              ) : /* VERIFYING */ state === "verifying" ? (
                <>
                  <div className="flex h-20 w-20 items-center justify-center rounded-full bg-white/10 ring-1 ring-white/20">
                    <ShieldCheck className="h-10 w-10 animate-pulse text-rose-100" />
                  </div>

                  <h1 className="mt-6 text-3xl font-bold sm:text-4xl">
                    Verifying Student
                  </h1>

                  <p className="mt-3 text-rose-100">
                    Please wait while the student is verified.
                  </p>

                  <div className="mt-6 flex items-center gap-2 rounded-full bg-black/10 px-4 py-2 text-sm text-rose-100">
                    <Keyboard className="h-4 w-4" />

                    <span>Scanner locked</span>
                  </div>
                </>
              ) : (
                /* IDLE */
                <>
                  <div className="flex h-24 w-24 items-center justify-center rounded-3xl bg-white text-4xl font-black text-rose-950 shadow-2xl">
                    A
                  </div>

                  <p className="mt-8 text-sm font-semibold uppercase tracking-[0.3em] text-rose-200">
                    Student Verification
                  </p>

                  <h1 className="mt-3 text-4xl font-bold tracking-tight sm:text-5xl">
                    Ready to Scan
                  </h1>

                  <p className="mt-4 max-w-md text-lg text-rose-100">
                    Present the student's ID to the barcode scanner.
                  </p>

                  <div className="mt-10 flex items-center gap-3 rounded-2xl border border-white/10 bg-white/10 px-6 py-4 shadow-xl backdrop-blur-md">
                    <Keyboard className="h-5 w-5 text-rose-200" />

                    <span className="text-sm font-medium text-white">
                      Scanner ready
                    </span>

                    <span className="h-2 w-2 rounded-full bg-emerald-400" />
                  </div>
                </>
              )}
            </div>
          )}
        </section>

        {/* Footer */}
        <footer className="flex items-center justify-between border-t border-white/10 bg-black/10 px-5 py-3 text-xs text-rose-200 backdrop-blur-md sm:px-8">
          <span className="hidden sm:block">
            Student entrance verification terminal
          </span>

          <button
            type="button"
            onClick={() => navigate("/")}
            className="ml-auto flex items-center gap-2 rounded-lg px-3 py-2 transition-colors hover:bg-white/10 hover:text-white"
          >
            <X className="h-4 w-4" />

            <span>Exit</span>

            <kbd className="hidden rounded border border-white/20 px-1.5 py-0.5 sm:inline">
              Esc
            </kbd>
          </button>
        </footer>
      </div>
    </main>
  );
}
