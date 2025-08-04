import { SidebarSearch } from "./SidebarSearch";
import { Separator } from "@/components/ui/separator";
import Conversation from "./Conversation";
import { useGetConversationListItem } from "@/hooks/useGetConversationListItems";
import { Skeleton } from "@/components/ui/skeleton";
import { useConversationStore } from "@/zustand/useConversationStore";
function ConversationSidebar() {
  const { conversationListItems } = useConversationStore();
  const { error, isLoading } = useGetConversationListItem();

  let content;

  if (isLoading) {
    content = (
      <div className="space-y-2 pt-2">
        {[...Array(5)].map((_, i) => (
          <div key={i} className="flex items-center space-x-4 p-2">
            <Skeleton className="h-12 w-12 rounded-full" />
            <div className="space-y-2 flex-1">
              <Skeleton className="h-4 w-1/2" />
              <Skeleton className="h-4 w-3/4" />
            </div>
          </div>
        ))}
      </div>
    );
  } else if (error) {
    content = (
      <div className="flex-1 p-4 text-center text-destructive">
        <p>Error loading conversations:</p>
        <p className="text-sm">{error}</p>
      </div>
    );
  } else {
    content = (
      <div className="flex-1 p-2 overflow-y-auto">
        {conversationListItems?.map((item) => (
          <Conversation
            key={item.id}
            id={item.id}
            avatarUrl={item.participants[0].profilePic}
            username={item.participants[0].username}
            lastMessage={item.messages[0].body}
          />
        ))}
      </div>
    );
  }
  return (
    <div className="flex flex-col h-full w-full">
      <div className="p-4">
        <SidebarSearch />
      </div>
      <Separator />
      {content}
    </div>
  );
}

export default ConversationSidebar;
