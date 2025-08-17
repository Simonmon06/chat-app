// apps/client/src/components/ContactsSidebar.tsx
import { SidebarSearch } from "./SidebarSearch";
import { Separator } from "@/components/ui/separator";
import { Skeleton } from "@/components/ui/skeleton";
import ContactItem from "./ContactItem";
import { useContactsStore } from "@/zustand/useContactsStore";
import { useListUsers } from "@/hooks/useListUsers";

export function ContactsSidebar() {
  const { isLoading, error, items } = useListUsers();
  const selectedId = useContactsStore((s) => s.selectedContact?.id ?? null);

  let content: React.ReactNode;
  const isFetching = isLoading || items === null;

  if (isFetching) {
    content = (
      <div className="space-y-2 pt-2">
        {[...Array(6)].map((_, i) => (
          <div key={i} className="flex items-center space-x-4 p-2">
            <Skeleton className="h-12 w-12 rounded-full" />
            <div className="space-y-2 flex-1">
              <Skeleton className="h-4 w-1/2" />
              <Skeleton className="h-4 w-3/4" />
            </div>
          </div>
        ))}
      </div>
    );
  } else if (error) {
    content = (
      <div className="flex-1 p-4 text-center text-destructive">
        <p>Error loading contacts:</p>
        <p className="text-sm">{error}</p>
      </div>
    );
  } else {
    const list = items ?? [];
    content =
      list.length === 0 ? (
        <div className="flex-1 p-6 text-center text-muted-foreground">
          <p className="font-medium">No contacts</p>
          <p className="text-sm mt-1">Try inviting someone to chat.</p>
        </div>
      ) : (
        <div className="flex-1 p-2 overflow-y-auto">
          {list.map((c) => (
            <ContactItem
              key={c.id}
              contact={c}
              selected={c.id === selectedId}
            />
          ))}
        </div>
      );
  }

  return (
    <div className="flex flex-col h-full w-full">
      <div className="p-4">
        {/* 复用现有搜索框组件（占位） */}
        <SidebarSearch />
      </div>
      <Separator />
      {content}
    </div>
  );
}
