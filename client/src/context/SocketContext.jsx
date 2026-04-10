import { createContext, useContext, useMemo } from "react";
import { io } from "socket.io-client";

const SocketContext = createContext(null);

export function SocketProvider({ children }) {
  const socket = useMemo(
    () => io(import.meta.env.VITE_SOCKET_URL || "http://localhost:5000", { autoConnect: true }),
    []
  );
  return <SocketContext.Provider value={socket}>{children}</SocketContext.Provider>;
}

export const useSocketContext = () => useContext(SocketContext);
