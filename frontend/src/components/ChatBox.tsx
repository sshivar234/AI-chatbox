import React, { useState, useRef, useEffect } from 'react';
import { Send, Search, Bot, User } from 'lucide-react';
import Message from './Message';
import apiService, { ChatRequest, ChatResponse, SearchResult } from '../services/api';

interface ChatMessage {
  id: string;
  content: string;
  isUser: boolean;
  timestamp: Date;
  searchResults?: SearchResult[];
}

const ChatBox: React.FC = () => {
  const [messages, setMessages] = useState<ChatMessage[]>([]);
  const [inputMessage, setInputMessage] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const [searchEnabled, setSearchEnabled] = useState(false);
  const [conversationId, setConversationId] = useState<string>('');
  const messagesEndRef = useRef<HTMLDivElement>(null);

  const scrollToBottom = () => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  };

  useEffect(() => {
    scrollToBottom();
  }, [messages]);

  const addMessage = (content: string, isUser: boolean, searchResults?: SearchResult[]) => {
    const newMessage: ChatMessage = {
      id: Date.now().toString(),
      content,
      isUser,
      timestamp: new Date(),
      searchResults,
    };
    setMessages(prev => [...prev, newMessage]);
  };

  const handleSendMessage = async () => {
    if (!inputMessage.trim() || isLoading) return;

    const userMessage = inputMessage.trim();
    setInputMessage('');
    addMessage(userMessage, true);

    setIsLoading(true);

    try {
      const request: ChatRequest = {
        message: userMessage,
        conversationId: conversationId || undefined,
        searchEnabled,
      };

      const response: ChatResponse = await apiService.sendMessage(request);
      
      if (!conversationId) {
        setConversationId(response.conversationId);
      }

      addMessage(response.message, false, response.searchResults);
    } catch (error) {
      console.error('Failed to send message:', error);
      addMessage(
        'Sorry, I encountered an error. Please try again.',
        false
      );
    } finally {
      setIsLoading(false);
    }
  };

  const handleKeyPress = (e: React.KeyboardEvent) => {
    if (e.key === 'Enter' && !e.shiftKey) {
      e.preventDefault();
      handleSendMessage();
    }
  };

  const clearChat = () => {
    setMessages([]);
    setConversationId('');
  };

  return (
    <div className="chat-container">
      <div className="chat-header">
        <div className="chat-title">
          <Bot className="chat-icon" />
          <h1>AI Chatbot</h1>
        </div>
        <div className="chat-controls">
          <button
            className={`search-toggle ${searchEnabled ? 'active' : ''}`}
            onClick={() => setSearchEnabled(!searchEnabled)}
            title={searchEnabled ? 'Disable web search' : 'Enable web search'}
          >
            <Search size={16} />
            {searchEnabled && <span className="search-indicator">ON</span>}
          </button>
          <button className="clear-chat" onClick={clearChat} title="Clear chat">
            Clear
          </button>
        </div>
      </div>

      <div className="messages-container">
        {messages.length === 0 && (
          <div className="welcome-message">
            <Bot size={48} className="welcome-icon" />
            <h2>Welcome to AI Chatbot!</h2>
            <p>I'm here to help you with questions and tasks.</p>
            {searchEnabled && (
              <p className="search-notice">
                🔍 Web search is enabled - I can provide up-to-date information!
              </p>
            )}
          </div>
        )}

        {messages.map((message) => (
          <Message
            key={message.id}
            content={message.content}
            isUser={message.isUser}
            timestamp={message.timestamp}
            searchResults={message.searchResults}
          />
        ))}

        {isLoading && (
          <div className="message ai-message">
            <div className="message-content">
              <div className="typing-indicator">
                <span></span>
                <span></span>
                <span></span>
              </div>
            </div>
          </div>
        )}

        <div ref={messagesEndRef} />
      </div>

      <div className="input-container">
        <div className="input-wrapper">
          <textarea
            value={inputMessage}
            onChange={(e) => setInputMessage(e.target.value)}
            onKeyPress={handleKeyPress}
            placeholder="Type your message here..."
            rows={1}
            className="message-input"
            disabled={isLoading}
          />
          <button
            onClick={handleSendMessage}
            disabled={!inputMessage.trim() || isLoading}
            className="send-button"
            title="Send message"
          >
            <Send size={20} />
          </button>
        </div>
        
        <div className="input-footer">
          <span className="search-status">
            {searchEnabled ? '🔍 Web search enabled' : '🔍 Web search disabled'}
          </span>
          <span className="conversation-id">
            {conversationId && `Chat ID: ${conversationId.slice(-8)}`}
          </span>
        </div>
      </div>
    </div>
  );
};

export default ChatBox;
