import axios from 'axios';

const API_BASE_URL = process.env.REACT_APP_API_URL || 'http://localhost:3001/api';

export interface ChatRequest {
  message: string;
  conversationId?: string;
  searchEnabled?: boolean;
}

export interface ChatResponse {
  message: string;
  conversationId: string;
  timestamp: string;
  searchResults?: SearchResult[];
}

export interface SearchResult {
  title: string;
  snippet: string;
  url: string;
  source: 'bing' | 'google';
}

class ApiService {
  private api = axios.create({
    baseURL: API_BASE_URL,
    headers: {
      'Content-Type': 'application/json',
    },
  });

  async sendMessage(request: ChatRequest): Promise<ChatResponse> {
    try {
      const response = await this.api.post<ChatResponse>('/chat', request);
      return response.data;
    } catch (error) {
      if (axios.isAxiosError(error)) {
        throw new Error(error.response?.data?.message || 'Failed to send message');
      }
      throw new Error('Network error');
    }
  }

  async checkHealth(): Promise<{ status: string; timestamp: string; services: any }> {
    try {
      const response = await this.api.get('/health');
      return response.data;
    } catch (error) {
      throw new Error('Backend health check failed');
    }
  }
}

export default new ApiService();
