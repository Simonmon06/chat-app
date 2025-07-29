import { Message } from "./Message";

// Dummy message data for now
const messagesData = [
  { id: 1, text: "Hey, how's it going?", senderId: "me" },
  {
    id: 2,
    text: "Pretty good! Just working on this chat app.",
    senderId: "them",
  },
  { id: 3, text: "Nice! It's looking great.", senderId: "me" },
  { id: 4, text: "Thanks! Trying to get the bubbles right.", senderId: "them" },
];

const loggedInUserId = "me"; // hardcoded for now

export function MessageList() {
  return (
    <div className="flex flex-col gap-4 p-4 overflow-y-auto">
      {messagesData.map((msg) => (
        <Message
          key={msg.id}
          text={msg.text}
          isOwnMessage={msg.senderId === loggedInUserId}
        />
      ))}
    </div>
  );
}
