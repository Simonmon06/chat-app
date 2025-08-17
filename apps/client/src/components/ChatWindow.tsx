import { useEffect } from "react";
import { useParams } from "react-router-dom";
import { ChatHeader } from "./ChatHeader";
import { MessageList } from "./MessageList";
import { MessageInput } from "./MessageInput";
import { WelcomeMessage } from "./WelcomeMessage";
import { useConversationStore } from "@/zustand/useConversationStore";
import { useGetMessages } from "@/hooks/useGetMessages";
import { useAuthContext } from "@/context/AuthContext";
import { usePickFrom } from "@/hooks/z-generic";

export function ChatWindow() {
  const { conversationId } = useParams<{ conversationId: string }>();

  const { authUser: me } = useAuthContext();

  const { conversationListItems, selectedConversationId } = usePickFrom(
    useConversationStore,
    "conversationListItems",
    "selectedConversationId"
  );
  const { setSelectedConversationId } = useConversationStore.getState();

  const { isLoading, error } = useGetMessages();
  const selectedConversation = conversationListItems?.find(
    (c) => c.id === selectedConversationId
  );

  useEffect(() => {
    if (conversationId && conversationId !== selectedConversationId) {
      setSelectedConversationId(conversationId);
    }
    // 没有参数（/chats），清空选中，回到欢迎页
    if (!conversationId && selectedConversationId !== null) {
      setSelectedConversationId(null);
    }
  }, [conversationId, selectedConversationId, setSelectedConversationId]);

  if (error) {
    return (
      <div className="flex items-center justify-center h-full text-destructive">
        Error: {error}
      </div>
    );
  }
  if (!selectedConversation) {
    return <WelcomeMessage />;
  }

  const peerUser = selectedConversation.participants?.[0]?.user;
  const isSelfDM = !selectedConversation.isGroup && !peerUser;
  const displayUser = isSelfDM ? me : peerUser;
  const displayName = isSelfDM
    ? "Saved messages"
    : displayUser?.nickname ?? displayUser?.username ?? "Unknown";
  const avatarUrl = displayUser?.profilePic ?? "";

  return (
    <div className="flex flex-col h-full">
      <ChatHeader username={displayName} avatarUrl={avatarUrl} />
      <div className="flex-1 overflow-y-auto">
        <MessageList key={selectedConversationId} isLoading={isLoading} />
      </div>
      <MessageInput key={selectedConversationId} />
    </div>
  );
}
