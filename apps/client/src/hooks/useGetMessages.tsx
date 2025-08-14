import { useState, useEffect } from "react";
import axios from "axios";
import { useConversationStore } from "@/zustand/useConversationStore";
import { axiosErrorHandler } from "@/utils/axiosErrorHandler";
import { useRef } from "react";
export const useGetMessages = () => {
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const { setMessages, selectedConversationId } = useConversationStore();
  const reqRef = useRef(0);

  useEffect(() => {
    if (!selectedConversationId) return;
    const ctrl = new AbortController();
    const conversationId = selectedConversationId;

    const myReq = ++reqRef.current;

    axios
      .get(`/api/messages/conversations/${conversationId}`, {
        signal: ctrl.signal,
      })
      .then((res) => {
        if (reqRef.current !== myReq) return;
        setMessages(conversationId, res.data ?? []);
      })
      .catch((err: any) => {
        if (err?.name === "CanceledError") return;
        if (reqRef.current !== myReq) return;
        setError(axiosErrorHandler(err));
      })
      .finally(() => {
        if (reqRef.current !== myReq) return;
        setIsLoading(false);
      });

    return () => ctrl.abort();
  }, [selectedConversationId, setMessages]);

  return { isLoading, error };
};
