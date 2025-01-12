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
  const allMessages = [
    ...messages,
    ...(isLoading ? [{ content: "", isBot: true }] : []),
  ];

  return (
    <div className="flex-1 overflow-y-auto space-y-4 p-4">
      {allMessages.map((message, index) => (
        <ChatMessage
          key={index}
          content={message.content}
          isBot={message.isBot}
          isLoading={isLoading && index === allMessages.length - 1}
        />
      ))}
    </div>
  );
}