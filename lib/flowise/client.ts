import { FlowiseClient } from 'flowise-sdk'

export const flowiseClient = new FlowiseClient({
  baseUrl: process.env.NEXT_PUBLIC_FLOWISE_HOST_URL,
  apiKey: process.env.NEXT_PUBLIC_FLOWISE_API_KEY
});

export interface FlowiseStreamResponse {
  event: 'start' | 'token' | 'error' | 'end' | 'metadata' | 'sourceDocuments' | 'usedTools';
  data?: string;
  metadata?: Record<string, unknown>;
  sourceDocuments?: Array<{
    pageContent: string;
    metadata: Record<string, unknown>;
  }>;
  usedTools?: Array<{
    name: string;
    description: string;
    parameters: Record<string, unknown>;
  }>;
}

interface FlowiseConfig {
  id: string;
  name: string;
  description?: string;
  settings: Record<string, unknown>;
}

interface FlowiseResponse {
  data: unknown;
  error?: string;
}

export async function getFlowiseConfig(): Promise<FlowiseConfig> {
  const response = await fetch('/api/flowise/config');
  const data = await response.json();
  return data;
}

export async function updateFlowiseConfig(config: Partial<FlowiseConfig>): Promise<FlowiseResponse> {
  const response = await fetch('/api/flowise/config', {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
    },
    body: JSON.stringify(config),
  });
  const data = await response.json();
  return data;
} 