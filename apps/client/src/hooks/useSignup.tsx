import { useState } from "react";
import z from "zod";
import axios from "axios";
import { signupFormSchema } from "@chat-app/validators";
import { useAuthContext } from "@/context/AuthContext";
import { axiosErrorHandler } from "@/utils/axiosErrorHandler";

type SignupInput = z.infer<typeof signupFormSchema>;

export const useSignup = () => {
  const [isLoading, setIsLoading] = useState<boolean>(false);
  const [error, setError] = useState<string | null>(null);
  const { setAuthUser } = useAuthContext();
  const signup = async (input: SignupInput) => {
    setIsLoading(true);
    setError(null);
    try {
      const res = await axios.post("/api/auth/signup", input);
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
  return { signup, isLoading, error };
};

export default useSignup;
