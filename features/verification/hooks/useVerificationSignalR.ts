import { useCallback, useEffect, useRef, useState } from "react";
import {
  HubConnection,
  HubConnectionBuilder,
  HubConnectionState,
  LogLevel,
} from "@microsoft/signalr";

import { authStorage } from "../../auth/utils/authStorage";
import type {
  ConnectionState,
  VerificationSignalRResponse,
} from "../types/verification";

const HUB_URL = `${import.meta.env.VITE_API_BASE_URL}/hubs/verification`;

export type VerificationInvokeResult =
  | {
      success: true;
    }
  | {
      success: false;
      reason: "not-connected" | "failed";
    };

function getConnectionState(state: HubConnectionState): ConnectionState {
  switch (state) {
    case HubConnectionState.Connecting:
      return "connecting";

    case HubConnectionState.Connected:
      return "connected";

    case HubConnectionState.Reconnecting:
      return "reconnecting";

    default:
      return "disconnected";
  }
}

export function useVerificationSignalR(
  onResult: (response: VerificationSignalRResponse) => void,
) {
  const connectionRef = useRef<HubConnection | null>(null);

  const [connectionState, setConnectionState] =
    useState<ConnectionState>("connecting");

  const [isVerifying, setIsVerifying] = useState(false);

  useEffect(() => {
    const connection = new HubConnectionBuilder()
      .withUrl(HUB_URL, {
        accessTokenFactory: () => {
          return authStorage.getToken() ?? "";
        },
      })
      .withAutomaticReconnect()
      .configureLogging(LogLevel.Information)
      .build();

    connectionRef.current = connection;

    const handleResult = (response: VerificationSignalRResponse) => {
      setIsVerifying(false);
      onResult(response);
    };

    connection.on("VerificationResult", handleResult);

    connection.onreconnecting(() => {
      setConnectionState("reconnecting");
    });

    connection.onreconnected(() => {
      setConnectionState("connected");
    });

    connection.onclose(() => {
      setConnectionState("disconnected");
      setIsVerifying(false);
    });

    const startConnection = async () => {
      try {
        setConnectionState("connecting");

        await connection.start();

        setConnectionState(getConnectionState(connection.state));
      } catch {
        setConnectionState("disconnected");
      }
    };

    void startConnection();

    return () => {
      connection.off("VerificationResult", handleResult);

      void connection.stop();

      connectionRef.current = null;
    };
  }, [onResult]);

  const verify = useCallback(
    async (lrn: string): Promise<VerificationInvokeResult> => {
      const connection = connectionRef.current;

      if (!connection) {
        return {
          success: false,
          reason: "not-connected",
        };
      }

      if (connection.state !== HubConnectionState.Connected) {
        return {
          success: false,
          reason: "not-connected",
        };
      }

      if (isVerifying) {
        return {
          success: false,
          reason: "failed",
        };
      }

      try {
        setIsVerifying(true);

        await connection.invoke("VerifyStudent", lrn);

        return {
          success: true,
        };
      } catch {
        setIsVerifying(false);

        return {
          success: false,
          reason: "failed",
        };
      }
    },
    [isVerifying],
  );

  return {
    connectionState,
    isVerifying,
    verify,
  };
}
