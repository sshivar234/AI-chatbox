import OpenAI from 'openai';
import { ChatRequest, OpenAIResponse } from '../types';

export class OpenAIService {
  private openai: OpenAI;

  constructor() {
    if (!process.env.OPENAI_API_KEY) {
      throw new Error('OPENAI_API_KEY environment variable is required');
    }
    
    this.openai = new OpenAI({
      apiKey: process.env.OPENAI_API_KEY,
    });
  }

  async generateResponse(request: ChatRequest): Promise<OpenAIResponse> {
    try {
      const systemPrompt = `You are a helpful AI assistant. You can help users with various tasks, answer questions, and provide information. 
      If the user asks about current events or recent information, let them know that you can search the web for up-to-date information.
      Always be helpful, accurate, and friendly in your responses.`;

      const messages = [
        { role: 'system' as const, content: systemPrompt },
        { role: 'user' as const, content: request.message }
      ];

      const completion = await this.openai.chat.completions.create({
        model: 'gpt-4o',
        messages,
        max_tokens: 1000,
        temperature: 0.7,
      });

      const content = completion.choices[0]?.message?.content || 'Sorry, I could not generate a response.';

      return {
        content,
        usage: {
          prompt_tokens: completion.usage?.prompt_tokens || 0,
          completion_tokens: completion.usage?.completion_tokens || 0,
          total_tokens: completion.usage?.total_tokens || 0,
        },
      };
    } catch (error: any) {
      console.error('OpenAI API error:', error);
      
      // Provide helpful fallback responses based on error type
      if (error?.status === 429) {
        throw new Error('OpenAI API quota exceeded. Please check your billing or try again later.');
      } else if (error?.status === 401) {
        throw new Error('OpenAI API key invalid. Please check your configuration.');
      } else if (error?.status === 500) {
        throw new Error('OpenAI service temporarily unavailable. Please try again.');
      } else {
        throw new Error('AI service temporarily unavailable. Please try again in a moment.');
      }
    }
  }

  async generateResponseWithContext(
    request: ChatRequest, 
    searchResults: string[]
  ): Promise<OpenAIResponse> {
    try {
      const systemPrompt = `You are a helpful AI assistant with access to current web search results. 
      Use the provided search results to give accurate and up-to-date information when relevant.
      If the search results don't contain relevant information, rely on your general knowledge.
      Always cite sources when using search results.`;

      const contextMessage = searchResults.length > 0 
        ? `Here are some relevant search results:\n${searchResults.join('\n\n')}\n\nUser question: ${request.message}`
        : request.message;

      const messages = [
        { role: 'system' as const, content: systemPrompt },
        { role: 'user' as const, content: contextMessage }
      ];

      const completion = await this.openai.chat.completions.create({
        model: 'gpt-4o',
        messages,
        max_tokens: 1000,
        temperature: 0.7,
      });

      const content = completion.choices[0]?.message?.content || 'Sorry, I could not generate a response.';

      return {
        content,
        usage: {
          prompt_tokens: completion.usage?.prompt_tokens || 0,
          completion_tokens: completion.usage?.completion_tokens || 0,
          total_tokens: completion.usage?.total_tokens || 0,
        },
      };
    } catch (error: any) {
      console.error('OpenAI API error with context:', error);
      
      // Provide helpful fallback responses based on error type
      if (error?.status === 429) {
        throw new Error('OpenAI API quota exceeded. Please check your billing or try again later.');
      } else if (error?.status === 401) {
        throw new Error('OpenAI API key invalid. Please check your configuration.');
      } else if (error?.status === 500) {
        throw new Error('OpenAI service temporarily unavailable. Please try again.');
      } else {
        throw new Error('AI service temporarily unavailable. Please try again in a moment.');
      }
    }
  }
}
