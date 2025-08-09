import { useState, useEffect } from "react";
import axios from "axios";
import { axiosErrorHandler } from "@/utils/axiosErrorHandler";
import { useConversationStore } from "@/zustand/useConversationStore";

export const useSendMessage = () => {
  const [isLoading, setIsLoading] = useState<boolean>(false);
  const [error, setError] = useState<string | null>(null);
  // set listItem to the store
  const { receiverId } = useConversationStore();

  const sendMessage = async (message: string) => {
    setIsLoading(true);
    setError(null);
    try {
      const res = await axios.post(`/api/messages/send/${receiverId}`);
    } catch (error) {
      const errorMessage = axiosErrorHandler(error);
      setError(errorMessage);
    } finally {
      setIsLoading(false);
    }
  };
  sendMessage();

  return { sendMessage, isLoading, error };
};
