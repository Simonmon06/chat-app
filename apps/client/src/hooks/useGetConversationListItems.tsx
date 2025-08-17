import { useState, useEffect, useCallback } from "react";
import axios from "axios";
import { axiosErrorHandler } from "@/utils/axiosErrorHandler";
import { useConversationStore } from "@/zustand/useConversationStore";
import { useAuthContext } from "@/context/AuthContext";
export const useGetConversationListItem = () => {
  const [isLoading, setIsLoading] = useState<boolean>(false);
  const [error, setError] = useState<string | null>(null);
  const { authUser } = useAuthContext();
  const { setConversationListItems } = useConversationStore.getState();
  const refresh = useCallback(
    async (signal: AbortSignal) => {
      setConversationListItems(null);
      setIsLoading(true);
      setError(null);
      try {
        const res = await axios.get("/api/messages/conversations", { signal });

        setConversationListItems(res.data ?? []);
      } catch (error: unknown) {
        if ((error as any)?.name === "CanceledError") {
          console.log("cancel error");
          return;
        }
        const errorMessage = axiosErrorHandler(error);
        setError(errorMessage);
        setConversationListItems([]);
      } finally {
        setIsLoading(false);
      }
    },
    [setConversationListItems]
  );

  useEffect(() => {
    if (!authUser) {
      setConversationListItems(null);
      return;
    }
    const ctrl = new AbortController();
    refresh(ctrl.signal);
    return () => ctrl.abort();
  }, [authUser?.id, refresh, setConversationListItems]);

  return { isLoading, error, refresh };
};
