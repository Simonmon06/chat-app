import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";

// Pass the conversation partner's info as props
type ChatHeaderProps = {
  username: string;
  avatarUrl: string;
};

export function ChatHeader({ username, avatarUrl }: ChatHeaderProps) {
  return (
    <div className="flex items-center gap-4 p-4 border-b">
      <Avatar>
        <AvatarImage src={avatarUrl} />
        <AvatarFallback>{username.substring(0, 2)}</AvatarFallback>
      </Avatar>
      <h2 className="text-lg font-semibold">{username}</h2>
    </div>
  );
}
