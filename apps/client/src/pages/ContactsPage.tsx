import { ContactsSidebar } from "@/components/ContactsSidebar";
import { ContactDetailsPane } from "@/components/ContactDetailsPane";

export default function ContactsPage() {
  return (
    <>
      <div className="hidden sm:flex sm:w-1/3 flex-col rounded-lg border bg-card text-card-foreground">
        <ContactsSidebar />
      </div>
      <div className="flex-1 flex-col rounded-lg border bg-card text-card-foreground">
        <ContactDetailsPane />
      </div>
    </>
  );
}
