import {
  createContext,
  useState,
  useEffect,
  useContext,
  type ReactNode,
  useRef,
} from "react";
import { useAuthContext } from "./AuthContext";
import io, { Socket } from "socket.io-client";

interface ISocketContext {
  socket: Socket | null;
  onlineUsers: string[];
}
const SocketContext = createContext<ISocketContext | undefined>(undefined);

const socketURL =
  import.meta.env.VITE_SOCKET_URL ||
  import.meta.env.VITE_API_BASE_URL ||
  window.location.origin;

// const socketURL = import.meta.env.DEV ? "http://localhost:3001" : "/";

export const SocketContextProvider = ({
  children,
}: {
  children: ReactNode;
}) => {
  const socketRef = useRef<Socket | null>(null);
  const [onlineUsers, setOnlineUsers] = useState<string[]>([]);
  const { authUser, isLoading } = useAuthContext();
  useEffect(() => {
    if (isLoading || !authUser) return;

    if (authUser && !isLoading) {
      const socket = io(socketURL, {
        transports: ["websocket", "polling"],
        withCredentials: true,
      });
      socketRef.current = socket;
      socket.on("onlineUsers", (users: string[]) => {
        setOnlineUsers(users);
      });
      socket.on("connect_error", (e) =>
        console.error("connect_error:", e.message)
      );

      return () => {
        socket.close();
        socketRef.current = null;
      };
    } else if (!authUser && !isLoading) {
      if (socketRef.current) {
        socketRef.current.disconnect();
        socketRef.current = null;
      }
    }
  }, [authUser, isLoading]);

  return (
    <SocketContext.Provider value={{ socket: socketRef.current, onlineUsers }}>
      {children}
    </SocketContext.Provider>
  );
};

export const useSocketContext = (): ISocketContext => {
  const context = useContext(SocketContext);
  if (context === undefined) {
    throw new Error(
      "useSocketContext must be used within SocketContextProvider"
    );
  }
  return context;
};
