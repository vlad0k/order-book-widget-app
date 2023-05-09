import React, {
  createContext,
  FC,
  ReactNode,
  useCallback,
  useEffect,
  useState,
} from "react";

interface IPublicWsContext {
  ws?: WebSocket | null;
  sendMessage: (message: Record<string, any>) => void;
}

export const PublicWsContext = createContext<IPublicWsContext>({
  sendMessage: () => {},
});

export const PublicWsContextProvider: FC<{ children?: ReactNode }> = ({
  children,
}) => {
  const [ws, setWs] = useState<WebSocket | null>(
    new WebSocket(process.env.REACT_APP_BITFINEX_PUBLIC_WS_URL || "")
  );

  useEffect(() => {
    if (!ws && navigator.onLine) {
      setWs(new WebSocket(process.env.REACT_APP_BITFINEX_PUBLIC_WS_URL || ""));
    }
  }, [ws]);

  const sendMessage = useCallback(
    (message: Record<string, any>) => {
      console.log(message);

      if (ws?.OPEN) {
        ws.send(JSON.stringify(message));
      }
    },
    [ws]
  );

  useEffect(() => {
    ws?.addEventListener("open", () => {
      console.log("WS open");
    });

    ws?.addEventListener("close", () => {
      setWs(null);
      console.log("Ws closed");
    });

    ws?.addEventListener("error", () => {
      setWs(null);
      console.log("Ws error");
    });
  }, [ws]);

  useEffect(() => {
    window.addEventListener("offline", () => {
      ws?.close();
      setWs(null);
    });

    window.addEventListener("online", () => {
      setWs(new WebSocket(process.env.REACT_APP_BITFINEX_PUBLIC_WS_URL || ""));
    });
  });

  return (
    <PublicWsContext.Provider value={{ ws, sendMessage }}>
      {children}
    </PublicWsContext.Provider>
  );
};
