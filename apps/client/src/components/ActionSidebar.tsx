import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Button } from "@/components/ui/button";
import { LogOut, MessageSquare, UsersRound } from "lucide-react";
import {
  Tooltip,
  TooltipContent,
  TooltipTrigger,
} from "@/components/ui/tooltip";
import useLogout from "@/hooks/useLogout";
import { NavLink } from "react-router-dom";
import { cn } from "@/lib/utils";
import { useAuthContext } from "@/context/AuthContext";
import defaultAvatar from "../assets/avatars/defaultAvatar.svg";

export function ActionSidebar() {
  const { authUser } = useAuthContext();
  const { logout } = useLogout();
  return (
    // justify-between pushes the content aside on the main direction
    <div className="flex flex-col h-full justify-between items-center p-2 bg-card rounded-lg border">
      <div className="flex flex-col items-center gap-4">
        {/* 1. User avatar */}
        <Avatar>
          <AvatarImage
            src={authUser?.profilePic || defaultAvatar}
            alt="User Avatar"
          />
          <AvatarFallback>YOU</AvatarFallback>
        </Avatar>

        <Button variant="ghost" size="icon" className="bg-accent">
          <NavLink
            to="/chats"
            className={({ isActive }) =>
              cn(
                "inline-flex h-10 w-10 items-center justify-center rounded-md",
                isActive && "bg-primary text-primary-foreground"
              )
            }
          >
            <MessageSquare className="h-6 w-6" />
          </NavLink>
        </Button>
        <Button variant="ghost" size="icon" className="bg-accent">
          <NavLink
            to="/contacts"
            className={({ isActive }) =>
              cn(
                "inline-flex h-10 w-10 items-center justify-center rounded-md",
                isActive && "bg-primary text-primary-foreground"
              )
            }
          >
            <UsersRound className="h-6 w-6" />
          </NavLink>
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
