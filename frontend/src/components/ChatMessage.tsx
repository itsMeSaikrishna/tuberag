import { User, Bot } from 'lucide-react';
import clsx from 'clsx';
import type { ChatMessage as ChatMessageType } from '@/types';
import CitationChip from './CitationChip';
import StreamingText from './StreamingText';

interface Props {
  message: ChatMessageType;
}

export default function ChatMessage({ message }: Props) {
  const isUser = message.role === 'user';

  return (
    <div className={clsx('flex gap-3 fade-in', isUser && 'flex-row-reverse')}>
      <div
        className={clsx(
          'flex-shrink-0 w-8 h-8 rounded-lg flex items-center justify-center',
          isUser ? 'bg-brand/20 text-brand-light' : 'bg-accent/15 text-accent',
        )}
      >
        {isUser ? <User className="w-4 h-4" /> : <Bot className="w-4 h-4" />}
      </div>

      <div
        className={clsx(
          'max-w-[80%] rounded-2xl px-4 py-3 space-y-3',
          isUser ? 'bg-brand/10 border border-brand/20' : 'glass-card',
        )}
      >
        {isUser ? (
          <p className="text-sm text-gray-100">{message.content}</p>
        ) : (
          <StreamingText
            text={message.content}
            isStreaming={message.isStreaming}
          />
        )}

        {message.citations && message.citations.length > 0 && (
          <div className="flex flex-wrap gap-2 pt-1">
            {message.citations.map((c, i) => (
              <CitationChip key={i} citation={c} />
            ))}
          </div>
        )}
      </div>
    </div>
  );
}
