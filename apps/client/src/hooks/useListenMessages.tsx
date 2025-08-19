import { useEffect } from "react";
import { useSocketContext } from "@/context/SocketContext";
import { useConversationStore } from "@/zustand/useConversationStore";
import { type MessageType } from "@chat-app/validators";
import { useAuthContext } from "@/context/AuthContext";
import notificationSound from "../../public/sounds/notification.mp3";

export const useListenMessages = () => {
  const { socket } = useSocketContext();
  const { authUser } = useAuthContext();
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

      const notificationAudio = new Audio(notificationSound);
      notificationAudio.play();
      setMessages(cid, [...prev, message]);
    };

    socket.on("message:new", onNew);
    return () => {
      socket.off("message:new", onNew); // cleanup 返回 void
    };
  }, [socket]);
};
