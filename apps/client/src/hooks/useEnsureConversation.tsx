import { useCallback, useRef, useState } from "react";
import axios from "axios";
import { useConversationStore } from "@/zustand/useConversationStore";
import { axiosErrorHandler } from "@/utils/axiosErrorHandler";
import type { ConversationListItemType } from "@chat-app/validators";

const ENSURE_DM_URL = (receiverId: string) =>
  `/api/messages/users/${receiverId}/conversation`;

export const useEnsureConversation = () => {
  const [isStarting, setIsStarting] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const abortRef = useRef<AbortController | null>(null);

  const { setConversationListItems, setSelectedConversationId, setReceiverId } =
    useConversationStore.getState();

  const ensureConversation = useCallback(async (receiverId: string) => {
    console.log("useEnsureConversation:", receiverId);
    if (!receiverId) return null;

    abortRef.current?.abort();
    const ctrl = new AbortController();
    abortRef.current = ctrl;

    setIsStarting(true);
    setError(null);

    try {
      const { data } = await axios.post<ConversationListItemType>(
        ENSURE_DM_URL(receiverId),
        {},
        { signal: ctrl.signal }
      );

      const item = data; // Sidebar 需要的形状
      const prev = useConversationStore.getState().conversationListItems ?? [];
      // 去重并置顶
      const next = [item, ...prev.filter((x) => x.id !== item.id)];
      setConversationListItems(next);

      setSelectedConversationId(item.id);
      setReceiverId(receiverId);

      return item;
    } catch (err: any) {
      if (err?.name === "CanceledError") return null;
      setError(axiosErrorHandler(err));
      return null;
    } finally {
      setIsStarting(false);
    }
  }, []);

  const cancel = useCallback(() => abortRef.current?.abort(), []);

  return { ensureConversation, isStarting, error, cancel };
};
