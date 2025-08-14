import axios from "axios";
import {
  useState,
  createContext,
  useEffect,
  useContext,
  useMemo,
  useCallback,
  type Dispatch,
  type ReactNode,
  type SetStateAction,
} from "react";
import { getDisplayName } from "@/lib/defaultName";
import { logAxiosError } from "@/utils/axiosErrorHandler";

axios.defaults.withCredentials = true;

export type AuthUserType = {
  id: string;
  username: string;
  nickname: string | null;
  profilePic: string | null;
  email?: string;
};

type AuthContextType = {
  authUser: AuthUserType | null;
  setAuthUser: Dispatch<SetStateAction<AuthUserType | null>>;
  isLoading: boolean;
  refresh: () => Promise<void>;
  displayName: string;
};

const AuthContext = createContext<AuthContextType | undefined>(undefined);

export const AuthContextProvider = ({ children }: { children: ReactNode }) => {
  const [authUser, setAuthUser] = useState<AuthUserType | null>(null);
  const [isLoading, setIsLoading] = useState<boolean>(true);

  // useMemo caches value by reference；只有 [authUser, isLoading, fetchAuthUser] 任何一个变了，才会 recompute 并让 consumers re-render。
  // useEffect([]) runs on provider mount（dev + StrictMode 会 double-run；prod 只一次）。
  // 日常brose不会再次 hit /api/auth/me；需要时手动调用 refresh().
  const fetchAuthUser = useCallback(async () => {
    setIsLoading(true);
    try {
      const res = await axios.get<AuthUserType>("/api/auth/me");
      setAuthUser(res.data);
    } catch (e) {
      logAxiosError(e);
      setAuthUser(null);
    } finally {
      setIsLoading(false);
    }
  }, []);

  useEffect(() => {
    fetchAuthUser();
  }, []);

  const value = useMemo<AuthContextType>(
    () => ({
      authUser,
      setAuthUser,
      isLoading,
      refresh: fetchAuthUser,
      displayName: getDisplayName(authUser),
    }),
    [authUser, isLoading, fetchAuthUser]
  );

  return <AuthContext.Provider value={value}>{children}</AuthContext.Provider>;
};

export const useAuthContext = () => {
  const context = useContext(AuthContext);
  if (!context)
    throw new Error("useAuthContext must be used within AuthContextProvider");
  return context;
};
