import { useState } from "react";
import { ChatMessage } from "./ChatMessage";
import { ChatInput } from "./ChatInput";
import { supabase } from "@/integrations/supabase/client";
import { toast } from "sonner";

interface Message {
  content: string;
  isBot: boolean;
}

export function ChatbotPage() {
  const [messages, setMessages] = useState<Message[]>([
    {
      content: "Hello! I'm your goal planning assistant. Share your goal with me, and I'll help you break it down into actionable steps, suggest timelines, and recommend priority levels.",
      isBot: true,
    },
  ]);
  const [isLoading, setIsLoading] = useState(false);

  const handleSendMessage = async (content: string) => {
    try {
      setIsLoading(true);
      // Add user message
      setMessages((prev) => [...prev, { content, isBot: false }]);

      const { data, error } = await supabase.functions.invoke('goal-planning-assistant', {
        body: { prompt: content }, // Changed from 'message' to 'prompt'
      });

      if (error) throw error;

      setMessages((prev) => [
        ...prev,
        {
          content: data.generatedText,
          isBot: true,
        },
      ]);
    } catch (error) {
      console.error('Error:', error);
      toast.error("Failed to get response from the assistant");
    } finally {
      setIsLoading(false);
    }
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