import { createContext, useContext, useState } from 'react';
import type { ChatMessage } from '@/types';

interface ChatContextType {
  messages: ChatMessage[];
  setMessages: React.Dispatch<React.SetStateAction<ChatMessage[]>>;
}

const ChatContext = createContext<ChatContextType | null>(null);

export function ChatProvider({ children }: { children: React.ReactNode }) {
  const [messages, setMessages] = useState<ChatMessage[]>([]);

  return (
    <ChatContext.Provider value={{ messages, setMessages }}>
      {children}
    </ChatContext.Provider>
  );
}

export function useChatMessages() {
  const ctx = useContext(ChatContext);
  if (!ctx) throw new Error('useChatMessages must be inside ChatProvider');
  return ctx;
}
