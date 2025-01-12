import { useState, useEffect } from "react";
import { supabase } from "@/integrations/supabase/client";
import { toast } from "sonner";
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

const INITIAL_BOT_MESSAGE = "Hello! I'm your goal planning assistant. Share your goal with me, and I'll help you break it down into actionable steps, suggest timelines, and recommend priority levels.";

export function useChatState() {
  const [messages, setMessages] = useState<Message[]>([]);
  const [isLoading, setIsLoading] = useState(false);
  const [chats, setChats] = useState<Chat[]>([]);
  const [currentChat, setCurrentChat] = useState<string | null>(null);
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
      
      if (data.length === 0) {
        setMessages([{
          content: INITIAL_BOT_MESSAGE,
          isBot: true
        }]);
        
        const { error: insertError } = await supabase
          .from('chat_messages')
          .insert([{
            chat_id: chatId,
            content: INITIAL_BOT_MESSAGE,
            is_bot: true
          }]);
          
        if (insertError) throw insertError;
      } else {
        setMessages(data.map(msg => ({
          content: msg.content,
          isBot: msg.is_bot
        })));
      }
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
        content: INITIAL_BOT_MESSAGE,
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

      const updatedChats = chats.filter(chat => chat.id !== chatId);
      setChats(updatedChats);

      if (currentChat === chatId) {
        if (updatedChats.length > 0) {
          setCurrentChat(updatedChats[0].id);
          await loadMessages(updatedChats[0].id);
        } else {
          setCurrentChat(null);
          setMessages([]);
        }
      }
      
      toast.success("Chat deleted successfully");
    } catch (error) {
      console.error('Error deleting chat:', error);
      toast.error("Failed to delete chat");
    }
  };

  const renameChat = async (chatId: string, newTitle: string) => {
    try {
      const { error } = await supabase
        .from('chats')
        .update({ title: newTitle })
        .eq('id', chatId);

      if (error) throw error;
      setChats(prev => prev.map(chat => 
        chat.id === chatId ? { ...chat, title: newTitle } : chat
      ));
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

    setIsLoading(true);
    try {
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

  return {
    messages,
    isLoading,
    chats,
    currentChat,
    createNewChat,
    deleteChat,
    renameChat,
    handleSendMessage,
    setCurrentChat,
  };
}