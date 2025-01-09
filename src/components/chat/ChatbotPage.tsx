import { useState } from "react";
import { ChatMessage } from "./ChatMessage";
import { ChatInput } from "./ChatInput";

interface Message {
  content: string;
  isBot: boolean;
}

export function ChatbotPage() {
  const [messages, setMessages] = useState<Message[]>([
    {
      content: "Hello! How can I help you today?",
      isBot: true,
    },
  ]);
  const [isLoading, setIsLoading] = useState(false);

  const handleSendMessage = async (content: string) => {
    setIsLoading(true);
    // Add user message
    setMessages((prev) => [...prev, { content, isBot: false }]);

    // TODO: Integrate with actual AI service
    // For now, just echo back
    setTimeout(() => {
      setMessages((prev) => [
        ...prev,
        {
          content: `I received your message: "${content}". This is a placeholder response.`,
          isBot: true,
        },
      ]);
      setIsLoading(false);
    }, 1000);
  };

  return (
    <div className="flex flex-col h-[calc(100vh-8rem)]">
      <div className="flex-1 overflow-y-auto space-y-4 p-4">
        {messages.map((message, index) => (
          <ChatMessage
            key={index}
            content={message.content}
            isBot={message.isBot}
          />
        ))}
      </div>
      <div className="p-4 border-t">
        <ChatInput onSend={handleSendMessage} isLoading={isLoading} />
      </div>
    </div>
  );
}