import { ChatHeader } from "./ChatHeader";
import { MessageList } from "./MessageList";
import { MessageInput } from "./MessageInput";

// Dummy data for the header
const conversationPartner = {
  username: "Simon Gu",
  avatarUrl: "https://github.com/shadcn.png",
};

export function ChatWindow() {
  return (
    // This is the main layout container for the chat window
    <div className="flex flex-col h-full">
      <ChatHeader
        username={conversationPartner.username}
        avatarUrl={conversationPartner.avatarUrl}
      />
      <div className="flex-1 overflow-y-auto">
        <MessageList />
      </div>
      <MessageInput />
    </div>
  );
}
