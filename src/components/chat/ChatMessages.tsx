import { ChatMessage } from "./ChatMessage";

interface Message {
  content: string;
  isBot: boolean;
}

interface ChatMessagesProps {
  messages: Message[];
  isLoading: boolean;
}

export function ChatMessages({ messages, isLoading }: ChatMessagesProps) {
  return (
    <div className="flex-1 overflow-y-auto space-y-4 p-4">
      {messages.map((message, index) => (
        <ChatMessage
          key={index}
          content={message.content}
          isBot={message.isBot}
          isLoading={isLoading && index === messages.length - 1 && message.isBot}
        />
      ))}
    </div>
  );
}