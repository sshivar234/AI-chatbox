import React from 'react';
import { SearchResult } from '../services/api';

interface MessageProps {
  content: string;
  isUser: boolean;
  timestamp: Date;
  searchResults?: SearchResult[];
}

const Message: React.FC<MessageProps> = ({ content, isUser, timestamp, searchResults }) => {
  const formatTime = (date: Date) => {
    return date.toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' });
  };

  return (
    <div className={`message ${isUser ? 'user-message' : 'ai-message'}`}>
      <div className="message-content">
        <div className="message-text">{content}</div>
        
        {searchResults && searchResults.length > 0 && (
          <div className="search-results">
            <div className="search-results-header">
              <span className="search-icon">🔍</span>
              <span>Search Results</span>
            </div>
            {searchResults.map((result, index) => (
              <div key={index} className="search-result">
                <a 
                  href={result.url} 
                  target="_blank" 
                  rel="noopener noreferrer"
                  className="search-result-title"
                >
                  {result.title}
                </a>
                <p className="search-result-snippet">{result.snippet}</p>
                <div className="search-result-meta">
                  <span className="search-result-source">{result.source}</span>
                  <span className="search-result-url">{result.url}</span>
                </div>
              </div>
            ))}
          </div>
        )}
      </div>
      
      <div className="message-timestamp">
        {formatTime(timestamp)}
      </div>
    </div>
  );
};

export default Message;
