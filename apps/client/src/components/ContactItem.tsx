import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { cn } from "@/lib/utils";
import { useContactsStore, type Contact } from "@/zustand/useContactsStore";
import { avatarUrlForUser } from "@/utils/avatar";
import defaultAvatar from "../assets/avatars/defaultAvatar.svg";

function initials(name: string) {
  return name.trim().slice(0, 2).toUpperCase();
}

type Props = {
  contact: Contact;
  selected?: boolean;
  onClick?: () => void;
};

export default function ContactItem({ contact, selected, onClick }: Props) {
  const setSelectedContact = useContactsStore((s) => s.setSelectedContact);

  const handleClick = () => {
    setSelectedContact(contact);
    onClick?.();
  };

  return (
    <button
      onClick={handleClick}
      className={cn(
        "w-full flex items-center gap-3 p-2 rounded-md hover:bg-accent/50 transition",
        selected && "bg-accent"
      )}
    >
      <Avatar className="h-10 w-10">
        <AvatarImage
          src={avatarUrlForUser(contact.id) || defaultAvatar}
          referrerPolicy="no-referrer"
          onError={(e) => {
            e.currentTarget.src = defaultAvatar;
          }}
        />
        <AvatarFallback>{initials(contact.nickname || "U")}</AvatarFallback>
      </Avatar>
      <div className="flex-1 text-left">
        <p className="font-medium truncate">{contact.nickname}</p>
      </div>
    </button>
  );
}
