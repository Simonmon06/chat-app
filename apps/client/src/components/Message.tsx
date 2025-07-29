import { cn } from "@/lib/utils";

type MessageProps = {
  text: string;
  isOwnMessage: boolean;
};

export function Message({ text, isOwnMessage }: MessageProps) {
  // Use the `cn` utility to conditionally apply classes
  const messageClasses = cn(
    "p-3 rounded-lg max-w-xs", // Base styles for all bubbles
    {
      "bg-primary text-primary-foreground self-end": isOwnMessage, // Styles for our messages
      "bg-secondary text-secondary-foreground self-start": !isOwnMessage, // Styles for their messages
    }
  );

  return (
    <div className={messageClasses}>
      <p>{text}</p>
    </div>
  );
}
