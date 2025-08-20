export interface ChatMessage {
  id: string;
  role: 'user' | 'assistant' | 'system';
  content: string;
  timestamp: Date;
}

export interface ChatRequest {
  message: string;
  conversationId?: string;
  searchEnabled?: boolean;
}

export interface ChatResponse {
  message: string;
  conversationId: string;
  timestamp: Date;
  searchResults?: SearchResult[];
}

export interface SearchResult {
  title: string;
  snippet: string;
  url: string;
  source: 'bing' | 'google';
}

export interface OpenAIResponse {
  content: string;
  usage: {
    prompt_tokens: number;
    completion_tokens: number;
    total_tokens: number;
  };
}

export interface SearchQuery {
  query: string;
  maxResults?: number;
}
