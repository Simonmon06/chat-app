import { useAuthContext } from "@/context/AuthContext";
import { type MessageType } from "@chat-app/validators";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { cn } from "@/lib/utils";

type MessageProps = {
  message: MessageType;
};

export function Message({ message }: MessageProps) {
  const { authUser } = useAuthContext();

  const isOwnMessage = message.sender.id === authUser?.id;

  const containerClasses = cn(
    "flex items-start gap-3",
    isOwnMessage && "justify-end"
  );
  const bubbleClasses = cn(
    "p-3 rounded-lg max-w-md text-sm",
    isOwnMessage ? "bg-primary text-primary-foreground" : "bg-muted"
  );

  const avatar = (
    <Avatar>
      <AvatarImage src={message.sender.profilePic} />
      <AvatarFallback>{message.sender.fullName.substring(0, 2)}</AvatarFallback>
    </Avatar>
  );

  return (
    <div className={containerClasses}>
      {!isOwnMessage && avatar}
      <div className={bubbleClasses}>
        <p>{message.body}</p>
      </div>
      {isOwnMessage && avatar}
    </div>
  );
}
