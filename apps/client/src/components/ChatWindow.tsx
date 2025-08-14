import { ChatHeader } from "./ChatHeader";
import { MessageList } from "./MessageList";
import { MessageInput } from "./MessageInput";
import { WelcomeMessage } from "./WelcomeMessage";
import { useConversationStore } from "@/zustand/useConversationStore";
import { useGetMessages } from "@/hooks/useGetMessages";
import { useAuthContext } from "@/context/AuthContext";
export function ChatWindow() {
  const { authUser: me } = useAuthContext();

  const conversationListItems = useConversationStore(
    (state) => state.conversationListItems
  );
  const selectedConversationId = useConversationStore(
    (state) => state.selectedConversationId
  );
  const { isLoading, error } = useGetMessages();
  const selectedConversation = conversationListItems?.find(
    (c) => c.id === selectedConversationId
  );

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
