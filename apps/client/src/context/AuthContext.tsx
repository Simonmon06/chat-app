import axios from "axios";
import {
  useState,
  createContext,
  useEffect,
  useContext,
  type Dispatch,
  type ReactNode,
  type SetStateAction,
} from "react";
import { logAxiosError } from "@/utils/axiosErrorHandler";

type AuthUserType = {
  id: string;
  fullName: string;
  username: string;
  profilePic: string;
  gender: string;
};

type AuthContextType = {
  authUser: AuthUserType | null;
  setAuthUser: Dispatch<SetStateAction<AuthUserType | null>>;
  isLoading: boolean;
};

const AuthContext = createContext<AuthContextType | undefined>(undefined);

export const AuthContextProvider = ({ children }: { children: ReactNode }) => {
  const [authUser, setAuthUser] = useState<AuthUserType | null>(null);
  const [isLoading, setIsLoading] = useState<boolean>(true);

  useEffect(() => {
    const fetchAuthUser = async () => {
      setIsLoading(true);
      try {
        const res = await axios.get("/api/auth/me");
        setAuthUser(res.data);
      } catch (error: unknown) {
        logAxiosError(error);
        setAuthUser(null);
      } finally {
        setIsLoading(false);
      }
    };
    fetchAuthUser();
  }, []);

  const value: AuthContextType = {
    authUser,
    setAuthUser,
    isLoading,
  };

  return <AuthContext.Provider value={value}>{children}</AuthContext.Provider>;
};

export const useAuthContext = () => {
  const context = useContext(AuthContext);

  if (context === undefined) {
    throw new Error("useAuthContext must be used within AuthContextProvider");
  }
  return context;
};
