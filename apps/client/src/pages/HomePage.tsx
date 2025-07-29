import ActionSidebar from "@/components/ActionSidebar"; // 1. 新建一个 ActionSidebar
import ConversationSidebar from "@/components/ConversationSidebar"; // 2. 把原来的 Sidebar 改名
import { ChatWindow } from "@/components/ChatWindow";

function HomePage() {
  return (
    <div className="flex h-screen w-screen p-4 gap-4">
      {/* flex-shrink-0 no shrink */}
      <div className="flex-shrink-0">
        <ActionSidebar />
      </div>

      {/* user list */}
      <div className="hidden sm:flex sm:w-1/3 flex-col rounded-lg border bg-card text-card-foreground">
        <ConversationSidebar />
      </div>

      {/* chat window */}
      <div className="flex-1 flex-col rounded-lg border bg-card text-card-foreground">
        <ChatWindow />
      </div>
    </div>
  );
}

export default HomePage;
