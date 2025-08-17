import { useNavigate } from "react-router-dom";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Button } from "@/components/ui/button";
import { useContactsStore } from "@/zustand/useContactsStore";
import { useEnsureConversation } from "@/hooks/useEnsureConversation";
import { useState } from "react";
import { useShallow } from "zustand/react/shallow";
function initials(name: string) {
  return name.trim().slice(0, 2).toUpperCase();
}

export function ContactDetailsPane() {
  const { selectedContact } = useContactsStore(
    useShallow((s) => ({
      selectedContact: s.selectedContact,
    }))
  );

  const { ensureConversation, isStarting } = useEnsureConversation();
  const [sending, setSending] = useState(false);
  const navigate = useNavigate();

  if (!selectedContact) {
    return (
      <div className="h-full flex items-center justify-center text-muted-foreground">
        Select a contact to view details
      </div>
    );
  }

  const onStart = async () => {
    // 这里示例：发送一个简短开场白，创建会话
    setSending(true);
    const item = await ensureConversation(selectedContact.id);

    setSending(false);
    if (item) navigate(`/chats/${item.id}`);
  };

  return (
    <div className="h-full p-6 flex flex-col items-center gap-4">
      <Avatar className="h-20 w-20">
        <AvatarImage src={selectedContact.profilePic ?? undefined} />
        <AvatarFallback className="text-xl">
          {initials(selectedContact.nickname || "U")}
        </AvatarFallback>
      </Avatar>

      <div className="text-center">
        <h2 className="text-xl font-semibold">{selectedContact.nickname}</h2>
      </div>

      <div className="mt-2">
        <Button onClick={onStart} disabled={isStarting || sending}>
          {isStarting || sending ? "Starting..." : "Start chat"}
        </Button>
      </div>
    </div>
  );
}
