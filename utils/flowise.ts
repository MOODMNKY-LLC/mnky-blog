// Types for chat messages and responses
export interface ChatMessage {
  role: 'user' | 'assistant';
  content: string;
}

export interface StreamResponse {
  type: 'stream' | 'end' | 'error' | 'metadata' | 'sourceDocuments' | 'usedTools' | 'start';
  data?: string | Record<string, unknown>;
  error?: string;
}

export interface FlowiseConfig {
  notionIntegrationToken?: string;
  databaseId?: string;
  metadata?: Record<string, unknown>;
  omitMetadataKeys?: string;
  [key: string]: unknown;
}

// Chat configuration
const CHAT_CONFIG = {
  chatflowId: process.env.NEXT_PUBLIC_FLOWISE_CHATFLOW_ID || '',
  baseUrl: process.env.NEXT_PUBLIC_FLOWISE_HOST_URL || '',
  apiKey: process.env.NEXT_PUBLIC_FLOWISE_API_KEY || '',
  streaming: false, // Disable streaming by default
  fileSizeLimit: 10 * 1024 * 1024, // 10MB
  fileUploadPath: '/api/v1/upload',
  supportedFileTypes: [
    'text/*',
    'application/pdf',
    'application/json',
    'application/msword',
    'application/vnd.openxmlformats-officedocument.wordprocessingml.document'
  ] as string[],
};

// Validate required environment variables
if (!CHAT_CONFIG.chatflowId) throw new Error('FLOWISE_CHATFLOW_ID is required');
if (!CHAT_CONFIG.baseUrl) throw new Error('FLOWISE_HOST_URL is required');
if (!CHAT_CONFIG.apiKey) throw new Error('FLOWISE_API_KEY is required');

// Helper function to validate file uploads
export function validateFile(file: File): boolean {
  if (file.size > CHAT_CONFIG.fileSizeLimit) {
    throw new Error(`File size exceeds limit of ${CHAT_CONFIG.fileSizeLimit / 1024 / 1024}MB`);
  }

  const isSupported = CHAT_CONFIG.supportedFileTypes.some((type: string) => {
    if (type.endsWith('/*')) {
      const baseType = type.split('/')[0];
      return file.type.startsWith(baseType + '/');
    }
    return file.type === type;
  });

  if (!isSupported) {
    throw new Error('File type not supported');
  }

  return true;
}

// Function to handle file uploads
export async function uploadFile(file: File): Promise<string> {
  validateFile(file);

  const formData = new FormData();
  formData.append('file', file);

  const response = await fetch(`${CHAT_CONFIG.baseUrl}${CHAT_CONFIG.fileUploadPath}`, {
    method: 'POST',
    headers: {
      Authorization: `Bearer ${CHAT_CONFIG.apiKey}`,
    },
    body: formData,
  });

  if (!response.ok) {
    throw new Error('Failed to upload file');
  }

  const data = await response.json();
  return data.filepath;
}

// Function to send chat message (non-streaming)
export async function sendChatMessage(
  messages: ChatMessage[],
  config?: Record<string, unknown>
): Promise<string> {
  try {
    const currentMessage = messages[messages.length - 1];
    const history = messages.slice(0, -1);

    const requestBody = {
      question: currentMessage.content,
      history: history.map(msg => ({
        message: msg.content,
        type: msg.role,
      })),
      overrideConfig: config,
      streaming: false,
    };

    console.log('Flowise Request:', {
      url: `${CHAT_CONFIG.baseUrl}/api/v1/prediction/${CHAT_CONFIG.chatflowId}`,
      body: requestBody,
    });

    const response = await fetch(`${CHAT_CONFIG.baseUrl}/api/v1/prediction/${CHAT_CONFIG.chatflowId}`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        Authorization: `Bearer ${CHAT_CONFIG.apiKey}`,
      },
      body: JSON.stringify(requestBody),
    });

    if (!response.ok) {
      throw new Error(`Request failed: ${response.status} ${response.statusText}`);
    }

    const data = await response.json();
    console.log('Flowise Response:', data);

    // Return the response text, with fallbacks for different response formats
    return data.text || data.answer || data.response || data.message || '';
  } catch (error) {
    console.error('Chat error:', error);
    throw error;
  }
}

// Function to override chatflow configuration
export async function updateChatflowConfig(config: FlowiseConfig): Promise<void> {
  const response = await fetch(`${CHAT_CONFIG.baseUrl}/chatflow/override/${CHAT_CONFIG.chatflowId}`, {
    method: 'POST',
    headers: {
      Authorization: `Bearer ${CHAT_CONFIG.apiKey}`,
      'Content-Type': 'application/json',
    },
    body: JSON.stringify({
      overrideConfig: config,
    }),
  });

  if (!response.ok) {
    throw new Error('Failed to update chatflow configuration');
  }
}

export const FlowiseAPI = {
  uploadFile,
  sendChatMessage,
  updateChatflowConfig,
  validateFile,
  CHAT_CONFIG,
}; 