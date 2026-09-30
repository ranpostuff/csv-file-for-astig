import schoolLogo from "../../../assets/mcnhs-logo.png";

// const schoolLogo: string | null = null;

export function SchoolLogoBackground() {
  if (!schoolLogo) {
    return (
      <div
        aria-hidden="true"
        className="pointer-events-none absolute inset-0 overflow-hidden"
      >
        <div className="absolute left-1/2 top-1/2 h-[38rem] w-[38rem] -translate-x-1/2 -translate-y-1/2 rounded-full bg-rose-900/10 blur-3xl" />
      </div>
    );
  }

  return (
    <div
      aria-hidden="true"
      className="pointer-events-none absolute inset-0 flex items-center justify-center overflow-hidden"
    >
      <img
        src={schoolLogo}
        alt=""
        className="h-[min(65vw,42rem)] w-[min(65vw,42rem)] object-contain opacity-[0.035]"
      />
    </div>
  );
}
