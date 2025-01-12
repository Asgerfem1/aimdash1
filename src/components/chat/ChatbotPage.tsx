import { ChatHeader } from "./ChatHeader";
import { ChatMessages } from "./ChatMessages";
import { ChatInput } from "./ChatInput";
import { useChatState } from "./useChatState";

export function ChatbotPage() {
  const {
    messages,
    isLoading,
    chats,
    currentChat,
    createNewChat,
    deleteChat,
    renameChat,
    handleSendMessage,
    setCurrentChat,
  } = useChatState();

  return (
    <div className="flex flex-col h-[calc(100vh-8rem)] max-w-full">
      <ChatHeader
        chats={chats}
        currentChat={currentChat}
        onNewChat={createNewChat}
        onSelectChat={setCurrentChat}
        onRenameChat={renameChat}
        onDeleteChat={deleteChat}
      />
      <ChatMessages messages={messages} isLoading={isLoading} />
      <div className="p-4 border-t">
        <ChatInput onSend={handleSendMessage} isLoading={isLoading} />
      </div>
    </div>
  );
}