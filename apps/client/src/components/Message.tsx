import { useAuthContext } from "@/context/AuthContext";
import { type MessageType } from "@chat-app/validators";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { cn } from "@/lib/utils";
import { format } from "date-fns";

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
      <AvatarImage src={message.sender.profilePic} />
      <AvatarFallback>{message.sender.fullName.substring(0, 2)}</AvatarFallback>
    </Avatar>
  );

  // e.g., 5:03 PM
  const formattedTime = format(new Date(message.createAt), "HH:mm");

  return (
    <div className={containerClass}>
      {!isOwnMessage && avatar}

      <div className="flex flex-col">
        <div className={bubbleClass}>
          <p>{message.body}</p>
        </div>

        <p className={timeClass}>{formattedTime}</p>
      </div>

      {isOwnMessage && avatar}
    </div>
  );
}
