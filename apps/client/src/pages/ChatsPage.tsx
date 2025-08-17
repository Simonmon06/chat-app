import ConversationSidebar from "@/components/ConversationSidebar";
import { ChatWindow } from "@/components/ChatWindow";

export default function ChatsPage() {
  return (
    <>
      <div className="hidden sm:flex sm:w-1/3 flex-col rounded-lg border bg-card text-card-foreground">
        <ConversationSidebar />
      </div>
      <div className="flex-1 flex-col rounded-lg border bg-card text-card-foreground">
        <ChatWindow />
      </div>
    </>
  );
}
