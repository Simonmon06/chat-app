import { Message } from "./Message";
import { Skeleton } from "@/components/ui/skeleton";
import { useConversationStore } from "@/zustand/useConversationStore";
import { type MessageType } from "@chat-app/validators";
import { useRef, useEffect } from "react";
type MessageListProps = {
  isLoading: boolean;
};

export function MessageList({ isLoading }: MessageListProps) {
  const selectedConversationId = useConversationStore(
    (s) => s.selectedConversationId
  );
  const msgs = useConversationStore((s) =>
    selectedConversationId ? s.messages[selectedConversationId] : undefined
  );

  if (!selectedConversationId) return null;

  const showSkeleton = isLoading || msgs === undefined;

  const bottomRef = useRef<HTMLDivElement | null>(null);

  useEffect(() => {
    bottomRef.current?.scrollIntoView({ behavior: "auto" });
  }, [selectedConversationId, msgs?.length]);

  if (showSkeleton) {
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
  const emptyList: MessageType[] = [];
  const currentMessages = msgs ?? emptyList;
  if (currentMessages.length === 0) {
    return (
      <div className="flex items-center justify-center h-full">
        <p className="text-muted-foreground">No messages yet. Say hi!</p>
      </div>
    );
  }

  return (
    <div className="flex flex-col gap-4 p-4">
      {currentMessages.map((msg) => (
        <Message key={msg.id} message={msg} />
      ))}
      <div ref={bottomRef} />
    </div>
  );
}
