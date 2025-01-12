import { cn } from "@/lib/utils";
import { Bot, User } from "lucide-react";

interface ChatMessageProps {
  content: string;
  isBot: boolean;
  isLoading?: boolean;
}

export function ChatMessage({ content, isBot, isLoading }: ChatMessageProps) {
  // Function to process text and handle markdown-style formatting
  const formatText = (text: string) => {
    // Process the text line by line to handle headers and bold text
    return text.split('\n').map((line, index) => {
      // Check for H3 headers (###)
      if (line.startsWith('### ')) {
        return (
          <h3 key={index} className="text-lg font-semibold mb-2">
            {line.substring(4)}
          </h3>
        );
      }
      
      // Check for H2 headers (##)
      if (line.startsWith('## ')) {
        return (
          <h2 key={index} className="text-xl font-semibold mb-2">
            {line.substring(3)}
          </h2>
        );
      }
      
      // Check for H1 headers (#)
      if (line.startsWith('# ')) {
        return (
          <h1 key={index} className="text-2xl font-bold mb-3">
            {line.substring(2)}
          </h1>
        );
      }

      // Handle bold text (**) within regular lines
      const parts = line.split(/(\*\*.*?\*\*)/g);
      const formattedLine = parts.map((part, partIndex) => {
        if (part.startsWith('**') && part.endsWith('**')) {
          return (
            <strong key={partIndex} className="font-semibold">
              {part.slice(2, -2)}
            </strong>
          );
        }
        return part;
      });

      return (
        <span key={index} className="block">
          {formattedLine}
          {index !== text.split('\n').length - 1 && <br />}
        </span>
      );
    });
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
        <div className="text-sm whitespace-pre-wrap">
          {isLoading ? (
            <div className="flex items-center gap-2">
              <div className="w-2 h-2 bg-primary rounded-full animate-bounce" />
              <div className="w-2 h-2 bg-primary rounded-full animate-bounce [animation-delay:0.2s]" />
              <div className="w-2 h-2 bg-primary rounded-full animate-bounce [animation-delay:0.4s]" />
            </div>
          ) : (
            formatText(content)
          )}
        </div>
      </div>
    </div>
  );
}