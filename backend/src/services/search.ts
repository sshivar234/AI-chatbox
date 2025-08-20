import axios from 'axios';
import { SearchQuery, SearchResult } from '../types';

export class SearchService {
  private bingApiKey: string;
  private googleApiKey: string;
  private googleSearchEngineId: string;

  constructor() {
    this.bingApiKey = process.env.BING_API_KEY || '';
    this.googleApiKey = process.env.GOOGLE_API_KEY || '';
    this.googleSearchEngineId = process.env.GOOGLE_SEARCH_ENGINE_ID || '';
  }

  async searchBing(query: SearchQuery): Promise<SearchResult[]> {
    if (!this.bingApiKey) {
      throw new Error('Bing API key not configured');
    }

    try {
      const response = await axios.get(
        `https://api.bing.microsoft.com/v7.0/search`,
        {
          params: {
            q: query.query,
            count: query.maxResults || 5,
            mkt: 'en-US',
          },
          headers: {
            'Ocp-Apim-Subscription-Key': this.bingApiKey,
          },
        }
      );

      const results: SearchResult[] = response.data.webPages?.value?.map((item: any) => ({
        title: item.name,
        snippet: item.snippet,
        url: item.url,
        source: 'bing' as const,
      })) || [];

      return results;
    } catch (error) {
      console.error('Bing search error:', error);
      throw new Error('Failed to search Bing');
    }
  }

  async searchGoogle(query: SearchQuery): Promise<SearchResult[]> {
    if (!this.googleApiKey || !this.googleSearchEngineId) {
      throw new Error('Google API key or search engine ID not configured');
    }

    try {
      const response = await axios.get(
        `https://www.googleapis.com/customsearch/v1`,
        {
          params: {
            key: this.googleApiKey,
            cx: this.googleSearchEngineId,
            q: query.query,
            num: query.maxResults || 5,
          },
        }
      );

      const results: SearchResult[] = response.data.items?.map((item: any) => ({
        title: item.title,
        snippet: item.snippet,
        url: item.link,
        source: 'google' as const,
      })) || [];

      return results;
    } catch (error) {
      console.error('Google search error:', error);
      throw new Error('Failed to search Google');
    }
  }

  async searchBoth(query: SearchQuery): Promise<SearchResult[]> {
    try {
      const [bingResults, googleResults] = await Promise.allSettled([
        this.searchBing(query),
        this.searchGoogle(query),
      ]);

      const results: SearchResult[] = [];

      if (bingResults.status === 'fulfilled') {
        results.push(...bingResults.value);
      }

      if (googleResults.status === 'fulfilled') {
        results.push(...googleResults.value);
      }

      // Sort by relevance and remove duplicates
      const uniqueResults = this.removeDuplicates(results);
      return uniqueResults.slice(0, query.maxResults || 10);
    } catch (error) {
      console.error('Combined search error:', error);
      throw new Error('Failed to perform combined search');
    }
  }

  private removeDuplicates(results: SearchResult[]): SearchResult[] {
    const seen = new Set<string>();
    return results.filter(result => {
      const key = `${result.title}-${result.url}`;
      if (seen.has(key)) {
        return false;
      }
      seen.add(key);
      return true;
    });
  }

  isConfigured(): boolean {
    return !!(this.bingApiKey || (this.googleApiKey && this.googleSearchEngineId));
  }
}
