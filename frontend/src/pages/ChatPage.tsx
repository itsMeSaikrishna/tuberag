import { useCallback, useEffect, useRef, useState } from 'react';
import { Send, StopCircle, MessageSquare } from 'lucide-react';
import ChatMessage from '@/components/ChatMessage';
import LoadingSpinner from '@/components/LoadingSpinner';
import { useSSEQuery } from '@/hooks/useSSEQuery';
import { useVideos } from '@/hooks/useVideos';
import type { ChatMessage as ChatMessageType } from '@/types';

export default function ChatPage() {
  const [messages, setMessages] = useState<ChatMessageType[]>([]);
  const [input, setInput] = useState('');
  const messagesEndRef = useRef<HTMLDivElement>(null);
  const inputRef = useRef<HTMLInputElement>(null);

  const { data: videos } = useVideos();
  const { text, citations, isStreaming, error, query, stop } = useSSEQuery();

  // Scroll to bottom on new content
  useEffect(() => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  }, [messages, text]);

  // Sync streaming response into messages
  useEffect(() => {
    if (!text && !isStreaming) return;

    setMessages((prev) => {
      const last = prev[prev.length - 1];
      if (last?.role === 'assistant' && (last.isStreaming || isStreaming)) {
        return [
          ...prev.slice(0, -1),
          { ...last, content: text, citations, isStreaming },
        ];
      }
      if (isStreaming && (!last || last.role === 'user')) {
        return [
          ...prev,
          {
            id: crypto.randomUUID(),
            role: 'assistant',
            content: text,
            citations,
            isStreaming,
          },
        ];
      }
      return prev;
    });
  }, [text, citations, isStreaming]);

  const handleSubmit = useCallback(
    (e: React.FormEvent) => {
      e.preventDefault();
      const trimmed = input.trim();
      if (!trimmed || isStreaming) return;

      const userMsg: ChatMessageType = {
        id: crypto.randomUUID(),
        role: 'user',
        content: trimmed,
      };
      setMessages((prev) => [...prev, userMsg]);
      setInput('');

      const videoIds = videos?.map((v) => v.video_id);
      query(trimmed, videoIds);
    },
    [input, isStreaming, videos, query],
  );

  return (
    <div className="flex-1 flex flex-col max-w-3xl mx-auto w-full">
      {/* Messages area */}
      <div className="flex-1 overflow-y-auto px-6 py-6 space-y-4">
        {messages.length === 0 && !isStreaming ? (
          <div className="flex-1 flex flex-col items-center justify-center gap-4 py-24">
            <div className="w-16 h-16 rounded-2xl bg-accent/10 flex items-center justify-center">
              <MessageSquare className="w-8 h-8 text-accent" />
            </div>
            <div className="text-center space-y-2">
              <h2 className="text-xl font-semibold text-gray-200">
                Ask anything about your videos
              </h2>
              <p className="text-sm text-gray-500 max-w-md">
                {videos?.length
                  ? `${videos.length} video${videos.length > 1 ? 's' : ''} indexed. Ask a question to get AI-powered answers with timestamp citations.`
                  : 'Index some videos first, then come back to ask questions.'}
              </p>
            </div>
          </div>
        ) : (
          messages.map((msg) => <ChatMessage key={msg.id} message={msg} />)
        )}

        {error && (
          <div className="p-3 rounded-lg bg-red-500/10 border border-red-500/20">
            <p className="text-sm text-red-400">{error}</p>
          </div>
        )}

        {isStreaming && !text && (
          <LoadingSpinner label="Thinking..." className="py-4" />
        )}

        <div ref={messagesEndRef} />
      </div>

      {/* Input bar */}
      <div className="sticky bottom-0 border-t border-white/5 bg-surface/80 backdrop-blur-lg px-6 py-4">
        <form onSubmit={handleSubmit} className="flex gap-3">
          <input
            ref={inputRef}
            type="text"
            value={input}
            onChange={(e) => setInput(e.target.value)}
            placeholder="Ask a question about your indexed videos..."
            className="input-dark flex-1"
            disabled={isStreaming}
          />
          {isStreaming ? (
            <button
              type="button"
              onClick={stop}
              className="btn-secondary flex items-center gap-2"
            >
              <StopCircle className="w-4 h-4" />
              Stop
            </button>
          ) : (
            <button
              type="submit"
              disabled={!input.trim()}
              className="btn-primary flex items-center gap-2"
            >
              <Send className="w-4 h-4" />
              Ask
            </button>
          )}
        </form>
      </div>
    </div>
  );
}
