import { Search } from "lucide-react";
import { Input } from "@/components/ui/input";

export function SidebarSearch() {
  return (
    <div className="relative w-full">
      <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
      <Input placeholder="Search conversations..." className="w-full pl-10" />
    </div>
  );
}
