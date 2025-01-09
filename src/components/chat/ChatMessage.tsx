import { cn } from "@/lib/utils";
import { Bot, User } from "lucide-react";

interface ChatMessageProps {
  content: string;
  isBot: boolean;
}

export function ChatMessage({ content, isBot }: ChatMessageProps) {
  // Function to process text and preserve formatting
  const formatText = (text: string) => {
    return text.split('\n').map((line, index) => (
      <span key={index}>
        {line}
        {index !== text.split('\n').length - 1 && <br />}
      </span>
    ));
  };

  return (
    <div
      className={cn(
        "flex w-full gap-4 p-4 rounded-lg",
        isBot ? "bg-muted" : "bg-primary/5"
      )}
    >
      <div className="w-8 h-8 rounded-full flex items-center justify-center bg-primary/10">
        {isBot ? (
          <Bot className="w-5 h-5 text-primary" />
        ) : (
          <User className="w-5 h-5 text-primary" />
        )}
      </div>
      <div className="flex-1">
        <p className="text-sm whitespace-pre-wrap">{formatText(content)}</p>
      </div>
    </div>
  );
}