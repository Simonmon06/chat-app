import { useAuthContext } from "@/context/AuthContext";
import { type MessageType } from "@chat-app/validators";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { cn } from "@/lib/utils";
import { format } from "date-fns";
import { avatarUrlForUser } from "@/utils/avatar";

type MessageProps = {
  message: MessageType;
};

export function Message({ message }: MessageProps) {
  const { authUser } = useAuthContext();

  const isOwnMessage = message.sender.id === authUser?.id;

  const containerClass = cn(
    "flex items-start gap-3",
    isOwnMessage && "justify-end"
  );
  const bubbleClass = cn(
    "p-3 rounded-lg max-w-md text-sm",
    isOwnMessage ? "bg-primary text-primary-foreground" : "bg-muted"
  );

  const timeClass = cn(
    "text-xs text-muted-foreground mt-1",
    isOwnMessage ? "self-end pr-3" : "self-start pl-3"
  );

  const avatar = (
    <Avatar>
      <AvatarImage
        src={avatarUrlForUser(message.sender.id)}
        referrerPolicy="no-referrer"
        onError={(e) => {
          e.currentTarget.src = "";
        }}
      />
      <AvatarFallback>
        {message.sender.nickname?.substring(0, 2)}
      </AvatarFallback>
    </Avatar>
  );

  // e.g., 5:03 PM
  const created = new Date(message.createdAt);
  const timeShort = format(created, "HH:mm");
  const timeFull = format(created, "PPpp");

  return (
    <div className={containerClass}>
      {!isOwnMessage && avatar}

      <div className="flex flex-col">
        <div className={bubbleClass}>
          <p>{message.content}</p>
        </div>

        <p className={timeClass} title={timeFull}>
          {timeShort}
        </p>
      </div>

      {isOwnMessage && avatar}
    </div>
  );
}
