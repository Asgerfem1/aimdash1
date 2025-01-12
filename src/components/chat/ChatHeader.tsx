import { Plus } from "lucide-react";
import { useState } from "react"; // Added this import
import { Button } from "@/components/ui/button";
import { ScrollArea, ScrollBar } from "@/components/ui/scroll-area";
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger } from "@/components/ui/dialog";
import { Input } from "@/components/ui/input";
import { Edit, Trash2 } from "lucide-react";

interface Chat {
  id: string;
  title: string;
  created_at: string;
}

interface ChatHeaderProps {
  chats: Chat[];
  currentChat: string | null;
  onNewChat: () => void;
  onSelectChat: (chatId: string) => void;
  onRenameChat: (chatId: string, newTitle: string) => void;
  onDeleteChat: (chatId: string) => void;
}

export function ChatHeader({
  chats,
  currentChat,
  onNewChat,
  onSelectChat,
  onRenameChat,
  onDeleteChat,
}: ChatHeaderProps) {
  return (
    <div className="border-b p-4 flex items-center gap-4">
      <Button onClick={onNewChat} variant="outline" size="sm" className="shrink-0 h-9">
        <Plus className="h-4 w-4 mr-2" />
        New Chat
      </Button>
      <ScrollArea className="w-[600px]" type="always">
        <div className="flex gap-2 pb-4">
          {chats.map((chat) => (
            <ChatItem
              key={chat.id}
              chat={chat}
              isSelected={currentChat === chat.id}
              onSelect={onSelectChat}
              onRename={onRenameChat}
              onDelete={onDeleteChat}
            />
          ))}
        </div>
        <ScrollBar orientation="horizontal" className="h-2.5" />
      </ScrollArea>
    </div>
  );
}

interface ChatItemProps {
  chat: Chat;
  isSelected: boolean;
  onSelect: (chatId: string) => void;
  onRename: (chatId: string, newTitle: string) => void;
  onDelete: (chatId: string) => void;
}

function ChatItem({ chat, isSelected, onSelect, onRename, onDelete }: ChatItemProps) {
  const [isRenaming, setIsRenaming] = useState(false);
  const [newTitle, setNewTitle] = useState(chat.title);

  return (
    <div
      className={`flex items-center gap-2 px-3 py-2 rounded-md cursor-pointer shrink-0 ${
        isSelected ? 'bg-primary text-primary-foreground' : 'hover:bg-accent'
      }`}
      onClick={() => onSelect(chat.id)}
    >
      <span className="truncate max-w-[150px]">{chat.title}</span>
      <div className="flex gap-1">
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
              <Button 
                onClick={() => {
                  onRename(chat.id, newTitle);
                  setIsRenaming(false);
                }}
              >
                Save
              </Button>
            </div>
          </DialogContent>
        </Dialog>
        <Button
          variant="ghost"
          size="sm"
          className="h-6 w-6 p-0"
          onClick={(e) => {
            e.stopPropagation();
            onDelete(chat.id);
          }}
        >
          <Trash2 className="h-4 w-4" />
        </Button>
      </div>
    </div>
  );
}