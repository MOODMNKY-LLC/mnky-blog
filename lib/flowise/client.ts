import { FlowiseClient } from 'flowise-sdk'

// Types for message handling
export type MessageType = 'apiMessage' | 'userMessage';

export interface IMessage {
  message: string;
  type: MessageType;
  role?: MessageType;
  content?: string;
}

// Types for Flowise responses
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

export interface FlowiseConfig {
  id: string;
  name: string;
  description?: string;
  settings: Record<string, unknown>;
}

export interface FlowiseResponse {
  data: unknown;
  error?: string;
}

// Create a singleton instance of FlowiseClient
export class FlowiseService {
  private static instance: FlowiseService;
  private client: FlowiseClient;
  private chatflowId: string;

  private constructor() {
    if (!process.env.NEXT_PUBLIC_FLOWISE_HOST_URL) {
      throw new Error('NEXT_PUBLIC_FLOWISE_HOST_URL is not defined');
    }
    if (!process.env.NEXT_PUBLIC_FLOWISE_API_KEY) {
      throw new Error('NEXT_PUBLIC_FLOWISE_API_KEY is not defined');
    }
    if (!process.env.NEXT_PUBLIC_FLOWISE_CHATFLOW_ID) {
      throw new Error('NEXT_PUBLIC_FLOWISE_CHATFLOW_ID is not defined');
    }

    this.client = new FlowiseClient({
      baseUrl: process.env.NEXT_PUBLIC_FLOWISE_HOST_URL,
      apiKey: process.env.NEXT_PUBLIC_FLOWISE_API_KEY,
    });

    this.chatflowId = process.env.NEXT_PUBLIC_FLOWISE_CHATFLOW_ID;
  }

  public static getInstance(): FlowiseService {
    if (!FlowiseService.instance) {
      FlowiseService.instance = new FlowiseService();
    }
    return FlowiseService.instance;
  }

  private isAsyncIterable(obj: unknown): obj is AsyncIterable<{ event: string; data: string }> {
    return obj !== null && 
           typeof obj === 'object' && 
           Symbol.asyncIterator in obj;
  }

  public async createPrediction(params: {
    question: string;
    history?: IMessage[];
    overrideConfig?: Record<string, unknown>;
    streaming?: boolean;
  }): Promise<AsyncIterable<{ event: string; data: string }>> {
    console.log('Creating prediction with:', {
      chatflowId: this.chatflowId,
      ...params
    });

    const response = await this.client.createPrediction({
      chatflowId: this.chatflowId,
      question: params.question,
      history: params.history?.map(msg => ({
        message: msg.message,
        type: msg.type,
        role: msg.role,
        content: msg.content
      })),
      overrideConfig: params.overrideConfig,
      streaming: params.streaming,
    });

    if (this.isAsyncIterable(response)) {
      return response;
    }

    return {
      async *[Symbol.asyncIterator]() {
        yield { event: 'data', data: JSON.stringify(response) };
      }
    };
  }

  public async uploadFile(file: File): Promise<{ filepath: string }> {
    const formData = new FormData();
    formData.append('file', file);

    const response = await fetch(`${process.env.NEXT_PUBLIC_FLOWISE_HOST_URL}/api/v1/upload`, {
      method: 'POST',
      headers: {
        'Authorization': `Bearer ${process.env.NEXT_PUBLIC_FLOWISE_API_KEY}`,
      },
      body: formData,
    });

    if (!response.ok) {
      throw new Error(`Upload failed: ${response.statusText}`);
    }

    const data = await response.json();
    return { filepath: data.filepath };
  }

  // Helper method to process streaming responses
  public async *processStreamResponse(response: Response): AsyncGenerator<FlowiseStreamResponse, void, unknown> {
    if (!response.body) {
      console.error('No response body received');
      yield { event: 'error', data: 'No response body received' };
      return;
    }

    const reader = response.body.getReader();
    const decoder = new TextDecoder();
    let buffer = '';

    try {
      while (true) {
        const { done, value } = await reader.read();
        if (done) break;

        buffer += decoder.decode(value, { stream: true });
        const lines = buffer.split('\n');
        buffer = lines.pop() || '';

        for (const line of lines) {
          if (line.trim() === '') continue;

          if (line.startsWith('data: ')) {
            const data = line.slice(6).trim();
            try {
              const jsonData = JSON.parse(data);
              if (typeof jsonData === 'string') {
                yield { event: 'token', data: jsonData };
              } else if ('text' in jsonData) {
                yield { event: 'token', data: jsonData.text };
              } else if ('response' in jsonData) {
                yield { event: 'token', data: jsonData.response };
              } else {
                yield { event: 'token', data: JSON.stringify(jsonData) };
              }
            } catch {
              yield { event: 'token', data };
            }
          } else if (line.startsWith('event: ')) {
            const event = line.slice(7).trim();
            if (event === 'error') {
              yield { event: 'error', data: 'Stream error occurred' };
            }
          }
        }
      }

      if (buffer.trim()) {
        if (buffer.startsWith('data: ')) {
          const data = buffer.slice(6).trim();
          yield { event: 'token', data };
        }
      }
    } catch (error) {
      yield { event: 'error', data: error instanceof Error ? error.message : 'Unknown error occurred' };
    } finally {
      reader.releaseLock();
    }
  }
}

// Export the singleton instance
export const flowiseService = FlowiseService.getInstance();

// For backward compatibility
export const flowiseClient = flowiseService;

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