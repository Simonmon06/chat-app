import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { useConversationStore } from "@/zustand/useConversationStore";

type ConversationProps = {
  id: string;
  avatarUrl: string;
  username: string;
  lastMessage: string;
};

function Conversation({
  id,
  avatarUrl,
  username,
  lastMessage,
}: ConversationProps) {
  const { setSelectedConversationId } = useConversationStore();

  const handleSelectConversation = () => {
    setSelectedConversationId(id);
  };
  return (
    <>
      <div
        className="flex gap-4 items-center hover:bg-slate-200 dark:hover:bg-slate-700 rounded p-2 cursor-pointer"
        onClick={handleSelectConversation}
      >
        {/* avatar */}
        <Avatar className="w-12 h-12">
          <AvatarImage src={avatarUrl} />
          <AvatarFallback>{username.substring(0, 2)}</AvatarFallback>
        </Avatar>

        {/* min-w-0 allows the flebox to shrink, default is auto*/}
        <div className="flex flex-col flex-1 min-w-0">
          <div className="flex justify-between items-center">
            <p className="font-bold">{username}</p>
            {/* TODO: Maybe add timestramp */}
          </div>
          <p className="text-sm text-muted-foreground truncate">
            {lastMessage}
          </p>
        </div>
      </div>
    </>
  );
}

export default Conversation;
