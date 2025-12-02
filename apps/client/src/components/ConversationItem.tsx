import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { useSocketContext } from "@/context/SocketContext";
import { useConversationStore } from "@/zustand/useConversationStore";

import { cn } from "@/lib/utils";
import { useNavigate } from "react-router-dom";
type ConversationProps = {
  id: string;
  receiverId: string;
  avatarUrl: string;
  nickname: string;
  lastMessage: string;
};

const Conversation = ({
  id,
  receiverId,
  avatarUrl,
  nickname,
  lastMessage,
}: ConversationProps) => {
  const navigate = useNavigate();

  const { setSelectedConversationId, setReceiverId } =
    useConversationStore.getState();

  const isOnline = useSocketContext().onlineUsers.includes(receiverId);
  console.log(receiverId);
  console.log("useSocketContext().onlineUsers", useSocketContext().onlineUsers);
  const handleOnClick = () => {
    setSelectedConversationId(id);
    setReceiverId(receiverId);
    navigate(`/chats/${id}`);
    console.log("id", id);
    console.log("receiverId", receiverId);
  };

  function PresenceBadge({ online }: { online: boolean }) {
    return (
      <span
        className={cn(
          "absolute bottom-0 right-0 translate-x-1/4 translate-y-1/4",
          "h-3.5 w-3.5 rounded-full ring-2 ring-background",
          online
            ? "bg-gradient-to-br from-emerald-400 to-emerald-600 shadow-[0_0_0_2px_rgba(16,185,129,0.25)]"
            : "bg-zinc-400/80"
        )}
        aria-label={online ? "online" : "offline"}
      />
    );
  }

  return (
    <>
      <div
        className="flex gap-4 items-center hover:bg-slate-200 dark:hover:bg-slate-700 rounded p-2 cursor-pointer"
        onClick={handleOnClick}
      >
        {/* avatar */}
        <div className="relative">
          <Avatar className="w-12 h-12">
            <AvatarImage
              src={avatarUrl}
              referrerPolicy="no-referrer"
              onError={(e) => {
                e.currentTarget.src = "";
              }}
            />
            <AvatarFallback>{nickname.substring(0, 2)}</AvatarFallback>
          </Avatar>

          <PresenceBadge online={isOnline} />
        </div>

        {/* min-w-0 allows the flebox to shrink, default is auto*/}
        <div className="flex flex-col flex-1 min-w-0">
          <div className="flex justify-between items-center">
            <p className="font-bold">{nickname}</p>
            {/* TODO: Maybe add timestramp */}
          </div>
          <p className="text-sm text-muted-foreground truncate">
            {lastMessage}
          </p>
        </div>
      </div>
    </>
  );
};

export default Conversation;
