import type { ConnectionState } from "../types/verification";

type ConnectionStatusProps = {
  state: ConnectionState;
};

const statusConfig: Record<
  ConnectionState,
  {
    label: string;
    className: string;
  }
> = {
  connecting: {
    label: "Connecting",
    className: "bg-amber-400",
  },
  connected: {
    label: "Connected",
    className: "bg-emerald-400",
  },
  reconnecting: {
    label: "Reconnecting",
    className: "bg-amber-400",
  },
  disconnected: {
    label: "Disconnected",
    className: "bg-red-400",
  },
};

export function ConnectionStatus({ state }: ConnectionStatusProps) {
  const config = statusConfig[state];

  return (
    <div className="flex items-center gap-2 rounded-full bg-white/10 px-3 py-1.5 text-sm text-white backdrop-blur-sm">
      <span
        className={`h-2 w-2 rounded-full ${config.className} ${
          state === "connecting" || state === "reconnecting"
            ? "animate-pulse"
            : ""
        }`}
      />

      <span>{config.label}</span>
    </div>
  );
}
