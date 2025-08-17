import { useState, type FormEvent } from "react";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { Send, Loader2 } from "lucide-react";
import { useConversationStore } from "@/zustand/useConversationStore";
import { useAddMessageToConversation } from "@/hooks/useAddMessageToConversation";
import { usePickFrom } from "@/hooks/z-generic";
export function MessageInput() {
  const [text, setText] = useState("");
  const { selectedConversationId } = usePickFrom(
    useConversationStore,
    "selectedConversationId"
  );

  const { addMessageToConversation, isSending, error } =
    useAddMessageToConversation();

  const handleOnSubmit = async (e: FormEvent) => {
    e.preventDefault();
    if (!selectedConversationId || !text.trim()) return;
    const ok = await addMessageToConversation(selectedConversationId, text);
    if (ok) setText("");
  };

  const disabled = !selectedConversationId || isSending;

  return (
    <div className="p-4 border-t">
      <form className="flex items-center gap-2" onSubmit={handleOnSubmit}>
        <Input
          type="text"
          placeholder="Type a message..."
          className="flex-1"
          value={text}
          onChange={(e) => setText(e.target.value)}
          disabled={disabled}
        />
        <Button type="submit" size="icon" disabled={disabled} aria-label="Send">
          {isSending ? (
            <Loader2 className="h-4 w-4 animate-spin" />
          ) : (
            <Send className="h-4 w-4" />
          )}
        </Button>
      </form>

      {error ? (
        <div className="mt-2 text-sm text-destructive" aria-live="polite">
          {error}
        </div>
      ) : null}
    </div>
  );
}
