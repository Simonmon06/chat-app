import { useState } from "react";

import axios from "axios";
import { useAuthContext } from "@/context/AuthContext";
import { axiosErrorHandler } from "@/utils/axiosErrorHandler";

export const useLogout = () => {
  const [isLoading, setIsLoading] = useState<boolean>(false);
  const [error, setError] = useState<string | null>(null);
  const { setAuthUser } = useAuthContext();

  const logout = async () => {
    setIsLoading(true);
    setError(null);
    try {
      const res = await axios.post("/api/auth/logout");
      console.log(res.data);
      setAuthUser(null);
    } catch (error) {
      const errorMessage = axiosErrorHandler(error);
      console.log(errorMessage);
      setError(errorMessage);
      throw new Error(errorMessage);
    } finally {
      setIsLoading(false);
    }
  };

  return { logout, isLoading, error };
};

export default useLogout;
