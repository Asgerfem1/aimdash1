import { cn } from "@/lib/utils";

interface ChatMessageProps {
  content: string;
  isBot: boolean;
}

export function ChatMessage({ content, isBot }: ChatMessageProps) {
  return (
    <div
      className={cn(
        "flex w-full gap-2 p-4 rounded-lg",
        isBot ? "bg-muted" : "bg-primary/5"
      )}
    >
      <div className="flex-1">
        <p className="text-sm">{content}</p>
      </div>
    </div>
  );
}