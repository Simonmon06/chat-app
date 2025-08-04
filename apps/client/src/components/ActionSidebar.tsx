import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Button } from "@/components/ui/button";
import { LogOut, MessageSquare } from "lucide-react";
import {
  Tooltip,
  TooltipContent,
  TooltipTrigger,
} from "@/components/ui/tooltip";

import useLogout from "@/hooks/useLogout";

function ActionSidebar() {
  const { logout } = useLogout();
  return (
    // justify-between pushes the content aside on the main direction
    <div className="flex flex-col h-full justify-between items-center p-2 bg-card rounded-lg border">
      <div className="flex flex-col items-center gap-4">
        {/* 1. User avatar */}
        <Avatar>
          <AvatarImage src="https://github.com/shadcn.png" alt="User Avatar" />
          <AvatarFallback>YOU</AvatarFallback>
        </Avatar>

        <Button variant="ghost" size="icon" className="bg-accent">
          <MessageSquare className="h-6 w-6" />
        </Button>
      </div>

      <div className="flex flex-col items-center gap-4">
        {/* logout buuton at the bottom*/}
        <Tooltip>
          <TooltipTrigger asChild>
            <Button variant="ghost" size="icon" onClick={logout}>
              <LogOut className="h-6 w-6" />
            </Button>
          </TooltipTrigger>
          <TooltipContent side="top">
            <p>Logout</p>
          </TooltipContent>
        </Tooltip>
      </div>
    </div>
  );
}

export default ActionSidebar;
