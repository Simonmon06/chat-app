import { useState, useCallback } from "react";
import axios from "axios";
import { useAuthContext } from "@/context/AuthContext";
import { axiosErrorHandler } from "@/utils/axiosErrorHandler";

export const useLogout = () => {
  const [isLoading, setIsLoading] = useState<boolean>(false);
  const [error, setError] = useState<string | null>(null);
  const { setAuthUser } = useAuthContext();

  const logout = useCallback(async () => {
    setIsLoading(true);
    setError(null);
    try {
      await axios.post("/api/auth/logout");
      setAuthUser(null);
      return true;
    } catch (err: unknown) {
      // 如果 401（比如 token 已过期），也当做logout
      if (axios.isAxiosError(err) && err.response?.status === 401) {
        setAuthUser(null);
        return true;
      }
      const msg = axiosErrorHandler(err);
      setError(msg);
      return false;
    } finally {
      setIsLoading(false);
    }
  }, [setAuthUser]);

  return { logout, isLoading, error };
};

export default useLogout;
