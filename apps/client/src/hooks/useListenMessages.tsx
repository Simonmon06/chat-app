import { useEffect } from "react";
import { useSocketContext } from "@/context/SocketContext";
import { useConversationStore } from "@/zustand/useConversationStore";
import {
  type MessageType,
  type ConversationListItemType,
} from "@chat-app/validators";
import { useAuthContext } from "@/context/AuthContext";
import notificationSound from "../assets/sounds/notification.mp3";
export const useListenMessages = () => {
  const { socket } = useSocketContext();
  const { authUser } = useAuthContext();
  const ringAudio = new Audio(notificationSound);

  console.log("useListenMessages");
  useEffect(() => {
    if (!socket) return;

    const onNew = ({ message }: { message: MessageType }) => {
      if (!message?.id || !message?.conversationId) return;
      const cid = message.conversationId;
      // avoid duplicated message
      if (message.sender?.id === authUser?.id) return;
      // use the newest state
      const { messages, setMessages } = useConversationStore.getState();
      const prev = messages[cid] ?? [];
      if (prev.some((m) => m.id === message.id)) return; // double check de-dup

      setMessages(cid, [...prev, message]);
    };
    // 会话列表 upsert（from server user-room）
    const onUpsert = ({ item }: { item: ConversationListItemType }) => {
      if (!item) return;
      const { upsertConversationListItem } = useConversationStore.getState();
      upsertConversationListItem(item);
    };

    const onRing = () => {
      // if (p.senderId === authUser?.id) return;
      ringAudio.play().catch(() => {});
    };
    socket.on("message:new", onNew);
    socket.on("conversation:upsert", onUpsert);
    socket.on("notify:ring", onRing);
    return () => {
      socket.off("message:new", onNew); // cleanup 返回 void
      socket.off("conversation:upsert", onUpsert);
      socket.off("notify:ring", onRing);
    };
  }, [socket, authUser?.id]);
};
