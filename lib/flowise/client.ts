import { FlowiseClient } from 'flowise-sdk'

export const flowiseClient = new FlowiseClient({
  baseUrl: process.env.NEXT_PUBLIC_FLOWISE_HOST_URL,
  apiKey: process.env.NEXT_PUBLIC_FLOWISE_API_KEY
});

export interface FlowiseStreamResponse {
  event: 'start' | 'token' | 'error' | 'end' | 'metadata' | 'sourceDocuments' | 'usedTools';
  data?: string;
  metadata?: Record<string, any>;
  sourceDocuments?: any[];
  usedTools?: any[];
} 