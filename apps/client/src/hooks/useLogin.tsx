import { useState } from "react";
import z from "zod";
import axios from "axios";
import { loginFormSchema } from "@chat-app/validators";
import { useAuthContext } from "@/context/AuthContext";
import { axiosErrorHandler } from "@/utils/axiosErrorHandler";

type LoginInput = z.infer<typeof loginFormSchema>;

export const useLogin = () => {
  const [isLoading, setIsLoading] = useState<boolean>(false);
  const [error, setError] = useState<string | null>(null);
  const { setAuthUser } = useAuthContext();
  const login = async (input: LoginInput) => {
    setIsLoading(true);
    setError(null);
    try {
      const res = await axios.post("/api/auth/login", input);
      const data = res.data;

      setAuthUser(data);
    } catch (error) {
      const errorMessage = axiosErrorHandler(error);
      setError(errorMessage);
      throw new Error(errorMessage);
    } finally {
      setIsLoading(false);
    }
  };
  return { login, isLoading, error };
};

export default useLogin;
