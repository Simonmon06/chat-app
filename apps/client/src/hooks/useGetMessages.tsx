import { useState, useEffect } from "react";
import axios from "axios";
import { useConversationStore } from "@/zustand/useConversationStore";
import { axiosErrorHandler } from "@/utils/axiosErrorHandler";

export const useGetMessages = () => {
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const { setMessages, selectedConversationId } = useConversationStore();

  useEffect(() => {
    const getMessages = async () => {
      if (!selectedConversationId) return;

      setIsLoading(true);
      setError(null);
      try {
        const res = await axios.get(
          `/api/messages/conversation/${selectedConversationId}`
        );
        setMessages(selectedConversationId, res.data);
      } catch (error) {
        const errorMessage = axiosErrorHandler(error);
        setError(errorMessage);
      } finally {
        setIsLoading(false);
      }
    };

    getMessages();
  }, [selectedConversationId, setMessages]);

  return { isLoading, error };
};
