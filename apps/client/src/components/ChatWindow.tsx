//  file: apps/client/src/components/ChatWindow.tsx

import { ChatHeader } from "./ChatHeader";
import { MessageList } from "./MessageList";
import { MessageInput } from "./MessageInput";
import { WelcomeMessage } from "./WelcomeMessage";
import { useConversationStore } from "@/zustand/useConversationStore";
import { useGetMessages } from "@/hooks/useGetMessages";
export function ChatWindow() {
  const { conversationListItems, selectedConversationId } =
    useConversationStore();
  console.log("selectedConversationId in ChatWindow: ", selectedConversationId);
  console.log("conversationListItems in ChatWindow: ", conversationListItems);
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
  return (
    <div className="flex flex-col h-full">
      {selectedConversation ? (
        <>
          <ChatHeader
            username={selectedConversation.participants[0].fullName}
            avatarUrl={selectedConversation.participants[0].profilePic}
          />
          <div className="flex-1 overflow-y-auto">
            <MessageList isLoading={isLoading} />
          </div>
          <MessageInput />
        </>
      ) : (
        <WelcomeMessage />
      )}
    </div>
  );
}
