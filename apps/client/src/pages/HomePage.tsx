import { ActionSidebar } from "@/components/ActionSidebar";
import { useListenMessages } from "@/hooks/useListenMessages";
import { Outlet } from "react-router-dom";
function HomePage() {
  useListenMessages();
  return (
    <div className="flex h-screen w-screen p-4 gap-4">
      {/* flex-shrink-0 no shrink */}
      <div className="flex-shrink-0">
        <ActionSidebar />
      </div>
      <Outlet />
    </div>
  );
}

export default HomePage;
