import { useState, useEffect } from "react";
import axios from "axios";
import { axiosErrorHandler } from "@/utils/axiosErrorHandler";
import { useConversationStore } from "@/zustand/useConversationStore";

export const useGetConversationListItem = () => {
  const [isLoading, setIsLoading] = useState<boolean>(false);
  const [error, setError] = useState<string | null>(null);
  // set listItem to the store
  const { setConversationListItems } = useConversationStore();
  useEffect(() => {
    const getConversation = async () => {
      setIsLoading(true);
      setError(null);
      try {
        const res = await axios.get("/api/messages/conversations");

        setConversationListItems(res.data);
      } catch (error) {
        const errorMessage = axiosErrorHandler(error);
        setError(errorMessage);
      } finally {
        setIsLoading(false);
      }
    };
    getConversation();
  }, []);

  return { isLoading, error };
};
