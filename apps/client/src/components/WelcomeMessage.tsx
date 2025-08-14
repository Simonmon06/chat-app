// when user login, and not select any conversation, show welcome message

import { useAuthContext } from "@/context/AuthContext";

export const WelcomeMessage = () => {
  const { authUser } = useAuthContext();
  return (
    <div className="flex flex-col items-center justify-center h-full text-center">
      <h2 className="text-2xl font-semibold">Welcome, {authUser?.nickname}!</h2>
      <p className="text-muted-foreground mt-2">
        Select a conversation from the sidebar to start chatting.
      </p>
    </div>
  );
};
