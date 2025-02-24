import { useState, useCallback, useRef } from 'react';

interface SourceDocument {
  id: string;
  title: string;
  content: string;
  url?: string;
  metadata?: Record<string, unknown>;
}

interface UseChatStreamProps {
  onStart?: () => void;
  onToken?: (token: string) => void;
  onError?: (error: string) => void;
  onEnd?: () => void;
  onMetadata?: (metadata: Record<string, unknown>) => void;
  onSourceDocuments?: (docs: SourceDocument[]) => void;
}

export function useChatStream({
  onStart,
  onToken,
  onError,
  onEnd,
}: UseChatStreamProps) {
  const [isStreaming, setIsStreaming] = useState(false);
  const eventSourceRef = useRef<EventSource | null>(null);

  const streamChat = useCallback(async (question: string) => {
    try {
      setIsStreaming(true);
      onStart?.();

      const response = await fetch('/api/chat/stream', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ question }),
      });

      if (!response.ok) {
        throw new Error('Failed to initialize stream');
      }

      const eventSource = new EventSource('/api/chat/stream');
      eventSourceRef.current = eventSource;

      eventSource.onmessage = (event) => {
        try {
          const data = JSON.parse(event.data);
          if (data.data) {
            onToken?.(data.data);
          }
        } catch (error) {
          console.error('Failed to parse stream data:', error);
        }
      };

      eventSource.onerror = (error) => {
        console.error('Stream error:', error);
        onError?.('Stream connection failed');
        eventSource.close();
        setIsStreaming(false);
      };

      eventSource.addEventListener('end', () => {
        onEnd?.();
        eventSource.close();
        setIsStreaming(false);
      });

    } catch (error) {
      onError?.(error instanceof Error ? error.message : 'Stream failed');
      setIsStreaming(false);
    }
  }, [onStart, onToken, onError, onEnd]);

  // Cleanup function
  const cleanup = useCallback(() => {
    if (eventSourceRef.current) {
      eventSourceRef.current.close();
      eventSourceRef.current = null;
    }
    setIsStreaming(false);
  }, []);

  return { streamChat, isStreaming, cleanup };
} 