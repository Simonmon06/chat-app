import { Message } from "./Message";
import { Skeleton } from "@/components/ui/skeleton";
import { useConversationStore } from "@/zustand/useConversationStore";

type MessageListProps = {
  isLoading: boolean;
};

export function MessageList({ isLoading }: MessageListProps) {
  const { messages, selectedConversationId } = useConversationStore();

  // Derive the messages to display for the currently selected conversation
  const currentMessages = selectedConversationId
    ? messages[selectedConversationId] || []
    : [];

  if (isLoading) {
    return (
      <div className="p-4 space-y-4">
        <Skeleton className="h-16 w-48 rounded-lg" />
        <div className="flex justify-end w-full">
          <Skeleton className="h-20 w-56 rounded-lg" />
        </div>
        <Skeleton className="h-12 w-32 rounded-lg" />
      </div>
    );
  }

  if (currentMessages.length === 0) {
    return (
      <div className="flex items-center justify-center h-full">
        <p className="text-muted-foreground">No messages yet. Say hi!</p>
      </div>
    );
  }

  return (
    <div className="flex flex-col gap-4 p-4 overflow-y-auto">
      {currentMessages.map((msg) => (
        <Message key={msg.id} message={msg} />
      ))}
    </div>
  );
}
