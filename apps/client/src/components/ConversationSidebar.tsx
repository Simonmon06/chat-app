import { SidebarSearch } from "./SidebarSearch";
import { Separator } from "@/components/ui/separator";
import Conversation from "./ConversationItem";
import { useGetConversationListItem } from "@/hooks/useGetConversationListItems";
import { Skeleton } from "@/components/ui/skeleton";
import { useConversationStore } from "@/zustand/useConversationStore";
import { usePickFrom } from "@/hooks/z-generic";
import { useAuthContext } from "@/context/AuthContext";

function ConversationSidebar() {
  const { authUser: me } = useAuthContext();
  const { conversationListItems } = usePickFrom(
    useConversationStore,
    "conversationListItems"
  );

  const { error, isLoading } = useGetConversationListItem();
  let content: React.ReactNode;
  const isFetching = isLoading || conversationListItems === null;
  console.log("isFetching", isFetching);
  if (isFetching) {
    console.log("loading loading ?");
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
    const items = conversationListItems ?? [];
    if (items.length === 0) {
      content = (
        <div className="flex-1 p-6 text-center text-muted-foreground">
          <p className="font-medium">No conversations yet</p>
          <p className="text-sm mt-1">Start a chat from the search bar.</p>
        </div>
      );
    } else {
      content = (
        <div className="flex-1 p-2 overflow-y-auto">
          {items?.map((item) => {
            // need to consider sending message to myself
            const peerUser = item.participants?.[0]?.user;
            const isSelfDM = !item.isGroup && !peerUser;

            const displayUser = isSelfDM ? me : peerUser;
            const displayName = isSelfDM
              ? "Saved messages"
              : displayUser?.nickname ?? displayUser?.username ?? "Unknown";

            const avatarUrl = displayUser?.profilePic ?? "";

            const receiverId = displayUser?.id ?? me?.id ?? "";
            const lastMessage = item.messages?.[0]?.content ?? "";

            return (
              <Conversation
                key={item.id}
                id={item.id}
                receiverId={receiverId}
                avatarUrl={avatarUrl}
                nickname={displayName}
                lastMessage={lastMessage}
              ></Conversation>
            );
          })}
        </div>
      );
    }
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
