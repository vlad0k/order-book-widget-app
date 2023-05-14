import React, {
  createContext,
  FC,
  ReactNode,
  useCallback,
  useEffect,
  useMemo,
  useState,
} from "react";

interface IPublicWsContext {
  ws?: WebSocket | null;
  sendMessage: (message: Record<string, any>) => void;
  reconnectWs: () => void;
  isOnline: boolean;
}

export const PublicWsContext = createContext<IPublicWsContext>({
  sendMessage: () => {},
  reconnectWs: () => {},
  isOnline: false,
});

export const PublicWsContextProvider: FC<{ children?: ReactNode }> = ({
  children,
}) => {
  const [ws, setWs] = useState<WebSocket | null>(null);

  const isOnline = useMemo(
    () => ws?.readyState === WebSocket.OPEN,
    [ws?.readyState]
  );

  const reconnectWs = useCallback(() => {
    ws?.close();

    const newWs = new WebSocket(
      process.env.REACT_APP_BITFINEX_PUBLIC_WS_URL || ""
    );

    newWs.addEventListener("open", () => {
      console.log("WS open");
      setWs(newWs);
    });

    newWs.addEventListener("close", () => {
      console.log("Ws closed");
      setWs(null);
    });

    newWs.addEventListener("error", () => {
      console.log("Ws error");
      setWs(null);
    });
  }, [ws]);

  const sendMessage = useCallback(
    (message: Record<string, any>) => {
      if (ws?.readyState === WebSocket.OPEN) {
        ws.send(JSON.stringify(message));
      }
    },
    [ws]
  );

  useEffect(() => {
    const offlineListener = () => {
      ws?.close();
    };

    const onlineListener = () => {
      reconnectWs();
    };

    window.addEventListener("offline", offlineListener);
    window.addEventListener("online", onlineListener);

    return () => {
      window.removeEventListener("offline", offlineListener);
      window.removeEventListener("online", onlineListener);
    };
  }, [ws, reconnectWs]);

  useEffect(() => {
    reconnectWs();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  return (
    <PublicWsContext.Provider
      value={{ ws, sendMessage, reconnectWs, isOnline }}
    >
      {children}
    </PublicWsContext.Provider>
  );
};
