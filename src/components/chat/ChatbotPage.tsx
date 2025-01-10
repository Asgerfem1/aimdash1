import { useState, useEffect } from "react";
import { ChatMessage } from "./ChatMessage";
import { ChatInput } from "./ChatInput";
import { supabase } from "@/integrations/supabase/client";
import { toast } from "sonner";
import { Plus, Edit, Trash2 } from "lucide-react";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { ScrollArea } from "@/components/ui/scroll-area";
import { useUser } from "@supabase/auth-helpers-react";

interface Message {
  content: string;
  isBot: boolean;
}

interface Chat {
  id: string;
  title: string;
  created_at: string;
}

export function ChatbotPage() {
  const [messages, setMessages] = useState<Message[]>([]);
  const [isLoading, setIsLoading] = useState(false);
  const [chats, setChats] = useState<Chat[]>([]);
  const [currentChat, setCurrentChat] = useState<string | null>(null);
  const [isRenaming, setIsRenaming] = useState(false);
  const [newTitle, setNewTitle] = useState("");
  const user = useUser();

  useEffect(() => {
    if (user) {
      loadChats();
    }
  }, [user]);

  useEffect(() => {
    if (currentChat) {
      loadMessages(currentChat);
    }
  }, [currentChat]);

  const loadChats = async () => {
    try {
      const { data, error } = await supabase
        .from('chats')
        .select('*')
        .order('created_at', { ascending: false });

      if (error) throw error;
      setChats(data);
      if (data.length > 0 && !currentChat) {
        setCurrentChat(data[0].id);
      }
    } catch (error) {
      console.error('Error loading chats:', error);
      toast.error("Failed to load chats");
    }
  };

  const loadMessages = async (chatId: string) => {
    try {
      const { data, error } = await supabase
        .from('chat_messages')
        .select('*')
        .eq('chat_id', chatId)
        .order('created_at', { ascending: true });

      if (error) throw error;
      setMessages(data.map(msg => ({
        content: msg.content,
        isBot: msg.is_bot
      })));
    } catch (error) {
      console.error('Error loading messages:', error);
      toast.error("Failed to load messages");
    }
  };

  const createNewChat = async () => {
    try {
      const { data, error } = await supabase
        .from('chats')
        .insert([{ user_id: user?.id }])
        .select()
        .single();

      if (error) throw error;
      setChats(prev => [data, ...prev]);
      setCurrentChat(data.id);
      setMessages([{
        content: "Hello! I'm your goal planning assistant. Share your goal with me, and I'll help you break it down into actionable steps, suggest timelines, and recommend priority levels.",
        isBot: true,
      }]);
    } catch (error) {
      console.error('Error creating chat:', error);
      toast.error("Failed to create new chat");
    }
  };

  const deleteChat = async (chatId: string) => {
    try {
      const { error } = await supabase
        .from('chats')
        .delete()
        .eq('id', chatId);

      if (error) throw error;
      setChats(prev => prev.filter(chat => chat.id !== chatId));
      if (currentChat === chatId) {
        const remainingChats = chats.filter(chat => chat.id !== chatId);
        setCurrentChat(remainingChats.length > 0 ? remainingChats[0].id : null);
      }
      toast.success("Chat deleted successfully");
    } catch (error) {
      console.error('Error deleting chat:', error);
      toast.error("Failed to delete chat");
    }
  };

  const renameChat = async (chatId: string) => {
    try {
      const { error } = await supabase
        .from('chats')
        .update({ title: newTitle })
        .eq('id', chatId);

      if (error) throw error;
      setChats(prev => prev.map(chat => 
        chat.id === chatId ? { ...chat, title: newTitle } : chat
      ));
      setIsRenaming(false);
      setNewTitle("");
      toast.success("Chat renamed successfully");
    } catch (error) {
      console.error('Error renaming chat:', error);
      toast.error("Failed to rename chat");
    }
  };

  const handleSendMessage = async (content: string) => {
    if (!currentChat) {
      toast.error("Please select or create a chat first");
      return;
    }

    try {
      setIsLoading(true);
      // Add user message to the database
      const { error: messageError } = await supabase
        .from('chat_messages')
        .insert([{
          chat_id: currentChat,
          content,
          is_bot: false
        }]);

      if (messageError) throw messageError;

      // Add message to UI
      setMessages(prev => [...prev, { content, isBot: false }]);

      const { data, error } = await supabase.functions.invoke('goal-planning-assistant', {
        body: { prompt: content },
      });

      if (error) throw error;

      // Add bot response to the database
      const { error: botMessageError } = await supabase
        .from('chat_messages')
        .insert([{
          chat_id: currentChat,
          content: data.generatedText,
          is_bot: true
        }]);

      if (botMessageError) throw botMessageError;

      // Add bot response to UI
      setMessages(prev => [
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
      <div className="border-b p-4 flex items-center space-x-4">
        <Button onClick={createNewChat} variant="outline" size="sm">
          <Plus className="h-4 w-4 mr-2" />
          New Chat
        </Button>
        <ScrollArea className="flex-1">
          <div className="flex space-x-4">
            {chats.map((chat) => (
              <div
                key={chat.id}
                className={`flex items-center space-x-2 px-3 py-2 rounded-md cursor-pointer ${
                  currentChat === chat.id ? 'bg-primary text-primary-foreground' : 'hover:bg-accent'
                }`}
                onClick={() => setCurrentChat(chat.id)}
              >
                <span className="truncate max-w-[150px]">{chat.title}</span>
                <div className="flex space-x-1">
                  <Dialog open={isRenaming} onOpenChange={setIsRenaming}>
                    <DialogTrigger asChild>
                      <Button
                        variant="ghost"
                        size="sm"
                        className="h-6 w-6 p-0"
                        onClick={(e) => {
                          e.stopPropagation();
                          setNewTitle(chat.title);
                        }}
                      >
                        <Edit className="h-4 w-4" />
                      </Button>
                    </DialogTrigger>
                    <DialogContent>
                      <DialogHeader>
                        <DialogTitle>Rename Chat</DialogTitle>
                      </DialogHeader>
                      <div className="space-y-4">
                        <Input
                          value={newTitle}
                          onChange={(e) => setNewTitle(e.target.value)}
                          placeholder="Enter new title"
                        />
                        <Button onClick={() => renameChat(chat.id)}>Save</Button>
                      </div>
                    </DialogContent>
                  </Dialog>
                  <Button
                    variant="ghost"
                    size="sm"
                    className="h-6 w-6 p-0"
                    onClick={(e) => {
                      e.stopPropagation();
                      deleteChat(chat.id);
                    }}
                  >
                    <Trash2 className="h-4 w-4" />
                  </Button>
                </div>
              </div>
            ))}
          </div>
        </ScrollArea>
      </div>
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