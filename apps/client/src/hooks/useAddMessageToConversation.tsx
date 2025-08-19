// apps/client/src/hooks/useAddMessageToConversation.tsx
import { useCallback, useRef, useState } from "react";
import axios from "axios";
import { useConversationStore } from "@/zustand/useConversationStore";
import { axiosErrorHandler } from "@/utils/axiosErrorHandler";
import type { MessageType } from "@chat-app/validators";

const SEND_IN_CONVO_URL = (conversationId: string) =>
  `/api/messages/conversations/add/${conversationId}`;

export function useAddMessageToConversation() {
  const [isSending, setIsSending] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const abortRef = useRef<AbortController | null>(null);

  const { setMessages } = useConversationStore.getState();

  const addMessageToConversation = useCallback(
    async (conversationId: string, content: string) => {
      if (!conversationId || !content.trim()) return null;

      // 取消上一次未完成的请求，防止连点
      abortRef.current?.abort();
      const ctrl = new AbortController();
      abortRef.current = ctrl;

      setIsSending(true);
      setError(null);

      try {
        const { data } = await axios.post<MessageType>(
          SEND_IN_CONVO_URL(conversationId),
          { content },
          { signal: ctrl.signal }
        );

        // add to current message
        const prev =
          useConversationStore.getState().messages[conversationId] ?? [];

        // remove duplicate
        if (!prev.some((m) => m.id === data.id)) {
          setMessages(conversationId, [...prev, data]);
        }

        return data;
      } catch (err: any) {
        if (err?.name === "CanceledError") return null;
        const msg = axiosErrorHandler(err);
        setError(msg);
        return null;
      } finally {
        setIsSending(false);
      }
    },
    []
  );

  const cancel = useCallback(() => abortRef.current?.abort(), []);

  return { addMessageToConversation, isSending, error, cancel };
}
