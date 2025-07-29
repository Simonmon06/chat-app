import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { Send } from "lucide-react";

export function MessageInput() {
  return (
    <div className="p-4 border-t">
      <form className="flex items-center gap-2">
        <Input type="text" placeholder="Type a message..." className="flex-1" />
        <Button type="submit" size="icon">
          <Send className="h-4 w-4" />
        </Button>
      </form>
    </div>
  );
}
