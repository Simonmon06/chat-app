import { SidebarSearch } from "./SidebarSearch";
import { Separator } from "@/components/ui/separator";
import Conversation from "./Conversation";

const conversationsData = [
  {
    id: 1,
    avatarUrl: "https://github.com/shadcn.png",
    username: "Simon Gu",
    lastMessage: "Hey, are we still on for tomorrow? Let me know!",
  },
  {
    id: 2,
    avatarUrl: "https://uifaces.co/our-content/donated/xP_Yc-nt.jpg",
    username: "Jane Doe",
    lastMessage:
      "Awesome! See you then. I'll bring the snacks this time for sure.",
  },
  {
    id: 3,
    avatarUrl: "https://randomuser.me/api/portraits/men/75.jpg",
    username: "John Smith",
    lastMessage:
      "Can you please send me the report? The deadline is approaching very fast.",
  },
  {
    id: 4,
    avatarUrl: "https://randomuser.me/api/portraits/women/75.jpg",
    username: "Emily White",
    lastMessage: "Just saw your message, I'm on it right now.",
  },
  {
    id: 5,
    avatarUrl: "https://randomuser.me/api/portraits/men/32.jpg",
    username: "Michael Brown",
    lastMessage: "That's hilarious 😂 Did you see the new trailer?",
  },
  {
    id: 6,
    avatarUrl: "https://randomuser.me/api/portraits/women/44.jpg",
    username: "Sarah Green",
    lastMessage: "I've pushed the latest changes to the main branch.",
  },
  {
    id: 7,
    avatarUrl: "https://randomuser.me/api/portraits/men/56.jpg",
    username: "David Black",
    lastMessage: "Let's sync up on Monday morning to discuss the next steps.",
  },
  {
    id: 8,
    avatarUrl: "https://randomuser.me/api/portraits/women/68.jpg",
    username: "Jessica Blue",
    lastMessage: "Happy Friday! Any plans for the weekend?",
  },
  {
    id: 9,
    avatarUrl: "https://randomuser.me/api/portraits/men/82.jpg",
    username: "Chris Yellow",
    lastMessage:
      "I think there's a small bug on the login page, can you check?",
  },
  {
    id: 10,
    avatarUrl: "https://randomuser.me/api/portraits/women/23.jpg",
    username: "Amanda Orange",
    lastMessage: "The meeting is rescheduled to 3 PM.",
  },
  {
    id: 11,
    avatarUrl: "https://randomuser.me/api/portraits/men/11.jpg",
    username: "Kevin Purple",
    lastMessage: "Got it, thanks for the heads up!",
  },
  {
    id: 12,
    avatarUrl: "https://randomuser.me/api/portraits/women/12.jpg",
    username: "Laura Pink",
    lastMessage: "Let's grab lunch sometime next week.",
  },
  {
    id: 13,
    avatarUrl: "https://randomuser.me/api/portraits/men/13.jpg",
    username: "Brian Red",
    lastMessage: "Working on the documentation now, will be done by EOD.",
  },
  {
    id: 14,
    avatarUrl: "https://randomuser.me/api/portraits/women/14.jpg",
    username: "Nancy Gray",
    lastMessage: "Can you review my pull request when you have a moment?",
  },
  {
    id: 15,
    avatarUrl: "https://randomuser.me/api/portraits/men/15.jpg",
    username: "Paul Indigo",
    lastMessage: "The build is failing, I'm looking into it.",
  },
  {
    id: 16,
    avatarUrl: "https://randomuser.me/api/portraits/women/16.jpg",
    username: "Olivia Violet",
    lastMessage: "No worries, take your time.",
  },
  {
    id: 17,
    avatarUrl: "https://randomuser.me/api/portraits/men/17.jpg",
    username: "George Cyan",
    lastMessage: "File sent. Let me know if you received it.",
  },
  {
    id: 18,
    avatarUrl: "https://randomuser.me/api/portraits/women/18.jpg",
    username: "Helen Teal",
    lastMessage: "Sounds like a plan!",
  },
  {
    id: 19,
    avatarUrl: "https://randomuser.me/api/portraits/men/19.jpg",
    username: "Frank Lime",
    lastMessage: "I'll be there in 5.",
  },
  {
    id: 20,
    avatarUrl: "https://randomuser.me/api/portraits/women/20.jpg",
    username: "Grace Aqua",
    lastMessage: "Perfect, thank you so much!",
  },
];

function ConversationSidebar() {
  return (
    <div className="flex flex-col h-full w-full">
      <div className="p-4">
        <SidebarSearch />
      </div>
      <Separator />

      <div className="flex-1 p-2 overflow-y-auto">
        {conversationsData.map((convo) => (
          <Conversation
            key={convo.id}
            avatarUrl={convo.avatarUrl}
            username={convo.username}
            lastMessage={convo.lastMessage}
          />
        ))}
      </div>
    </div>
  );
}

export default ConversationSidebar;
