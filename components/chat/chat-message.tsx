import { useChatStream } from '@/hooks/use-chat-stream';
import { useState } from 'react';

interface SourceDocument {
  id: string;
  title: string;
  content: string;
  url?: string;
  metadata?: Record<string, unknown>;
}

export function ChatMessage() {
  const [message, setMessage] = useState('');
  const [metadata, setMetadata] = useState<Record<string, unknown> | null>(null);
  const [sources, setSources] = useState<SourceDocument[]>([]);
  
  const { streamChat, isStreaming } = useChatStream({
    onStart: () => {
      setMessage('');
      setMetadata(null);
      setSources([]);
    },
    onToken: (token) => {
      setMessage(prev => prev + token);
    },
    onError: (error) => {
      console.error('Chat Error:', error);
    },
    onEnd: () => {
      console.log('Stream completed');
    },
    onMetadata: (meta) => {
      setMetadata(meta);
    },
    onSourceDocuments: (docs) => {
      setSources(docs);
    }
  });

  return (
    <div className="space-y-4">
      <button 
        onClick={() => streamChat('Tell me a joke')}
        disabled={isStreaming}
        className="px-4 py-2 bg-blue-500 text-white rounded disabled:bg-gray-300"
      >
        {isStreaming ? 'Streaming...' : 'Get Response'}
      </button>
      
      <div className="whitespace-pre-wrap">{message}</div>
      
      {metadata && (
        <div className="text-sm text-gray-500">
          {Object.entries(metadata).map(([key, value]) => (
            <div key={key}>
              {key}: {typeof value === 'string' ? value : JSON.stringify(value)}
            </div>
          ))}
        </div>
      )}
      
      {sources.length > 0 && (
        <div className="text-sm text-gray-500">
          <div>Sources: {sources.length} documents found</div>
          {sources.map(source => (
            <div key={source.id} className="mt-2">
              <div className="font-medium">{source.title}</div>
              <div className="text-xs">{source.content}</div>
              {source.url && (
                <a href={source.url} className="text-blue-500 hover:underline text-xs" target="_blank" rel="noopener noreferrer">
                  View Source
                </a>
              )}
            </div>
          ))}
        </div>
      )}
    </div>
  );
} 