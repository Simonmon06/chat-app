import { useEffect } from "react";
import { useSocketContext } from "@/context/SocketContext";
import { usePickFrom } from "@/hooks/z-generic";
import { useConversationStore } from "@/zustand/useConversationStore";

export function useConversationRoom() {
  const { socket } = useSocketContext();
  const { selectedConversationId } = usePickFrom(
    useConversationStore,
    "selectedConversationId"
  );

  useEffect(() => {
    if (!socket || !selectedConversationId) return;

    socket.emit(
      "conversation:join",
      { conversationId: selectedConversationId },
      (ack?: {
        ok: boolean;
        conversationId?: string;
        size?: number;
        reason?: string;
      }) => {
        console.log("[client] join ack:", ack);
      }
    );
    return () => {
      socket.emit("conversation:leave", {
        conversationId: selectedConversationId,
      });
    };
  }, [socket, selectedConversationId]);
}
