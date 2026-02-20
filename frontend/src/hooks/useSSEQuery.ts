import { useCallback, useRef, useState } from 'react';
import { buildQueryURL } from '@/lib/api';
import type { Citation, SSEEvent } from '@/types';

interface SSEState {
  text: string;
  citations: Citation[];
  isStreaming: boolean;
  error: string | null;
}

export function useSSEQuery() {
  const [state, setState] = useState<SSEState>({
    text: '',
    citations: [],
    isStreaming: false,
    error: null,
  });
  const eventSourceRef = useRef<EventSource | null>(null);

  const stop = useCallback(() => {
    eventSourceRef.current?.close();
    eventSourceRef.current = null;
    setState((s) => ({ ...s, isStreaming: false }));
  }, []);

  const query = useCallback(
    (question: string, videoIds?: string[]) => {
      stop();

      setState({ text: '', citations: [], isStreaming: true, error: null });

      const url = buildQueryURL(question, videoIds);
      const es = new EventSource(url);
      eventSourceRef.current = es;

      es.onmessage = (event) => {
        try {
          const parsed: SSEEvent = JSON.parse(event.data);

          if (parsed.type === 'chunk') {
            setState((s) => ({
              ...s,
              text: s.text + parsed.content,
            }));
          } else if (parsed.type === 'citations') {
            setState((s) => ({
              ...s,
              citations: parsed.citations,
            }));
          } else if (parsed.type === 'done') {
            setState((s) => ({ ...s, isStreaming: false }));
            es.close();
            eventSourceRef.current = null;
          }
        } catch {
          // ignore malformed events
        }
      };

      es.onerror = () => {
        setState((s) => ({
          ...s,
          isStreaming: false,
          error: s.text ? null : 'Failed to connect to the server.',
        }));
        es.close();
        eventSourceRef.current = null;
      };
    },
    [stop],
  );

  return { ...state, query, stop };
}
