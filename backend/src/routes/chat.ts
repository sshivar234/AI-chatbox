import { Router, Request, Response } from 'express';
import { OpenAIService } from '../services/openai';
import { SearchService } from '../services/search';
import { ChatRequest, ChatResponse } from '../types';

const router = Router();
const openaiService = new OpenAIService();
const searchService = new SearchService();

// Generate a unique conversation ID
const generateConversationId = (): string => {
  return `conv_${Date.now()}_${Math.random().toString(36).substr(2, 9)}`;
};

router.post('/chat', async (req: Request, res: Response) => {
  try {
    const { message, conversationId, searchEnabled = false }: ChatRequest = req.body;

    if (!message || typeof message !== 'string') {
      return res.status(400).json({ error: 'Message is required and must be a string' });
    }

    const convId = conversationId || generateConversationId();
    let aiResponse: string;
    let searchResults: any[] = [];

    // Perform web search if enabled and search service is configured
    if (searchEnabled && searchService.isConfigured()) {
      try {
        searchResults = await searchService.searchBoth({ query: message, maxResults: 5 });
        
        // Extract snippets for AI context
        const searchContext = searchResults.map(result => 
          `${result.title}: ${result.snippet} (Source: ${result.source})`
        );
        
        // Generate AI response with search context
        const openaiResponse = await openaiService.generateResponseWithContext(
          { message, conversationId: convId, searchEnabled },
          searchContext
        );
        aiResponse = openaiResponse.content;
      } catch (searchError) {
        console.error('Search failed, falling back to AI-only response:', searchError);
        // Fallback to AI-only response if search fails
        const openaiResponse = await openaiService.generateResponse({
          message,
          conversationId: convId,
          searchEnabled: false
        });
        aiResponse = openaiResponse.content;
      }
    } else {
      // Generate AI response without search
      const openaiResponse = await openaiService.generateResponse({
        message,
        conversationId: convId,
        searchEnabled: false
      });
      aiResponse = openaiResponse.content;
    }

    const response: ChatResponse = {
      message: aiResponse,
      conversationId: convId,
      timestamp: new Date(),
      searchResults: searchResults.length > 0 ? searchResults : undefined,
    };

    res.json(response);
  } catch (error) {
    console.error('Chat endpoint error:', error);
    res.status(500).json({ 
      error: 'Internal server error',
      message: error instanceof Error ? error.message : 'Unknown error'
    });
  }
});

// Health check endpoint
router.get('/health', (req: Request, res: Response) => {
  res.json({ 
    status: 'healthy',
    timestamp: new Date().toISOString(),
    services: {
      openai: 'available',
      search: searchService.isConfigured() ? 'configured' : 'not configured'
    }
  });
});

export default router;
