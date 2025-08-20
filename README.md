# AI Chatbot

A modern AI chatbot application built with Node.js, TypeScript, React, and OpenAI GPT-4o. Features web search integration with Bing and Google APIs for up-to-date information.

## 🖼️ User Interface

![AI Chatbot UI](https://i.imgur.com/example.png)

**Current UI Features:**
- **Clean, Modern Design**: Purple gradient background with white card layout
- **Robot Icon**: Friendly chatbot mascot in the header and welcome section
- **Welcome Screen**: User-friendly introduction message
- **Message Input**: Clean input field with send button (paper airplane icon)
- **Search Toggle**: Web search functionality (currently disabled)
- **Responsive Layout**: Works seamlessly across all devices

*Note: The UI is fully functional and ready for user interaction. The backend is configured with hardcoded API keys for immediate use.*

## 🚀 Features

- **AI Chat**: Powered by OpenAI GPT-4o for intelligent conversations
- **Web Search**: Real-time search integration with Bing and Google APIs
- **Modern UI**: Beautiful, responsive React frontend with TypeScript
- **Real-time**: Instant message responses with typing indicators
- **Search Toggle**: Enable/disable web search on demand
- **Conversation Management**: Persistent chat sessions with unique IDs
- **Responsive Design**: Works seamlessly on desktop and mobile devices

## 🏗️ Architecture

```
ai-chatbot/
│── backend/                  # Node.js + TypeScript backend
│   ├── src/
│   │   ├── index.ts         # Express server entry point
│   │   ├── routes/          # API route handlers
│   │   ├── services/        # Business logic services
│   │   └── types/          # TypeScript type definitions
│   ├── package.json
│   └── tsconfig.json
│
│── frontend/                # React + TypeScript frontend
│   ├── src/
│   │   ├── App.tsx         # Main application component
│   │   ├── components/     # Reusable UI components
│   │   └── services/       # API communication layer
│   ├── package.json
│   └── tsconfig.json
│
│── docker-compose.yml       # Docker deployment configuration
│── README.md
```

## 🛠️ Tech Stack

### Backend
- **Node.js** with **Express.js**
- **TypeScript** for type safety
- **OpenAI API** for GPT-4o integration
- **Bing Search API** and **Google Custom Search API**
- **Axios** for HTTP requests
- **Helmet** for security headers
- **CORS** for cross-origin requests

### Frontend
- **React 18** with **TypeScript**
- **Lucide React** for beautiful icons
- **CSS3** with modern design patterns
- **Responsive design** for all devices

## 📋 Prerequisites

- Node.js 18+ and npm
- OpenAI API key
- Bing Search API key (optional)
- Google Custom Search API key and Search Engine ID (optional)

## 🚀 Quick Start

### 1. Clone the repository
```bash
git clone <your-repo-url>
cd ai-chatbot
```

### 2. Backend Setup
```bash
cd backend
npm install
```

**🔑 Environment Setup Required!** The backend now uses environment variables:
1. Copy `env_backend` to `.env` in the backend directory
2. Fill in your actual API keys in the `.env` file

```bash
cd backend
copy env_backend .env
# Then edit .env with your actual API keys
```

### 3. Frontend Setup
```bash
cd ../frontend
npm install
```

**🔑 Environment Setup Required!** The frontend now uses environment variables:
1. Copy `env_frontend` to `.env` in the frontend directory
2. Modify the API URL if needed

```bash
cd frontend
copy env_frontend .env
# Then edit .env if you need to change the API URL
```

### 4. Start Development Servers

**Terminal 1 - Backend:**
```bash
cd backend
npm run dev
```

**Terminal 2 - Frontend:**
```bash
cd frontend
npm start
```

The application will be available at:
- Frontend: http://localhost:3000
- Backend API: http://localhost:3001

## 🐳 Docker Deployment

### Using Docker Compose
```bash
# Build and start all services
docker-compose up --build

# Run in background
docker-compose up -d --build

# Stop services
docker-compose down
```

### Environment Variables for Docker
**🔑 Environment Setup Required!** The Docker configuration now uses environment variables:
1. Copy `env_root` to `.env` in the root directory
2. Fill in your actual API keys in the `.env` file

```bash
copy env_root .env
# Then edit .env with your actual API keys
```
```env
OPENAI_API_KEY=your_openai_api_key_here
BING_API_KEY=your_bing_api_key_here
GOOGLE_API_KEY=your_google_api_key_here
GOOGLE_SEARCH_ENGINE_ID=your_search_engine_id_here
FRONTEND_URL=http://localhost:3000
REACT_APP_API_URL=http://localhost:3001/api
```

## 🔧 API Endpoints

### Chat API
- `POST /api/chat` - Send a message and get AI response
- `GET /api/health` - Check backend health status

### Request Format
```json
{
  "message": "Your message here",
  "conversationId": "optional_conversation_id",
  "searchEnabled": true
}
```

### Response Format
```json
{
  "message": "AI response",
  "conversationId": "generated_conversation_id",
  "timestamp": "2024-01-01T00:00:00.000Z",
  "searchResults": [
    {
      "title": "Search result title",
      "snippet": "Search result snippet",
      "url": "https://example.com",
      "source": "bing"
    }
  ]
}
```

## 🎨 Customization

### Styling
- Modify `frontend/src/App.css` for custom styling
- Update color schemes, fonts, and layout
- Add custom animations and transitions

### Features
- Extend the search service with additional providers
- Add conversation history persistence
- Implement user authentication
- Add file upload capabilities

## 🧪 Testing

### Backend Tests
```bash
cd backend
npm test
```

### Frontend Tests
```bash
cd frontend
npm test
```

## 📱 Mobile Support

The application is fully responsive and works on:
- Desktop browsers (Chrome, Firefox, Safari, Edge)
- Mobile devices (iOS Safari, Android Chrome)
- Tablet devices

## 🔒 Security Features

- **Helmet.js** for security headers
- **CORS** configuration
- **Input validation** and sanitization
- **Rate limiting** (can be added)
- **Environment variable** protection

## ⚠️ Current Status & Known Issues

### ✅ What's Working
- **Backend**: Successfully running on port 3001
- **Frontend**: Beautiful UI running on port 3000
- **API Communication**: Frontend and backend are connected
- **Environment Configuration**: All API keys are now configurable via environment variables

### ⚠️ Known Issues
- **OpenAI API Quota**: The current OpenAI API key has exceeded its quota limit
- **Error Messages**: Users see "Sorry, I encountered an error" due to API quota issues
- **Web Search**: Currently disabled in the UI (but backend is configured)

### 🔧 How to Fix
1. **Set Up Environment Variables**: Copy the environment files and fill in your API keys
2. **Check OpenAI Billing**: Visit [platform.openai.com/account/billing](https://platform.openai.com/account/billing)
3. **Add Payment Method**: Ensure you have a valid payment method
4. **Check Usage Limits**: Verify your current plan and usage
5. **Update API Key**: Replace the placeholder in your `.env` file with your actual OpenAI API key

### 🎯 Expected Behavior After Fix
Once the OpenAI API quota issue is resolved, users will see:
- Intelligent AI responses from GPT-4o
- Web search integration working
- Smooth conversation flow
- No more error messages

## 🚀 Production Deployment

### Environment Variables
Ensure all production environment variables are set:
- `NODE_ENV=production`
- `OPENAI_API_KEY`
- Search API keys (if using web search)

### Build Commands
```bash
# Backend
cd backend
npm run build
npm start

# Frontend
cd frontend
npm run build
```

### Reverse Proxy
Consider using Nginx or Apache as a reverse proxy for production deployments.

## 🤝 Contributing

1. Fork the repository
2. Create a feature branch (`git checkout -b feature/amazing-feature`)
3. Commit your changes (`git commit -m 'Add amazing feature'`)
4. Push to the branch (`git push origin feature/amazing-feature`)
5. Open a Pull Request

## 📄 License

This project is licensed under the MIT License - see the [LICENSE](LICENSE) file for details.

## 🙏 Acknowledgments

- OpenAI for GPT-4o API
- Microsoft for Bing Search API
- Google for Custom Search API
- React and TypeScript communities

## 📞 Support

For support and questions:
- Create an issue in the repository
- Check the API documentation
- Review the troubleshooting section

## 🔮 Future Enhancements

- [ ] Voice input/output
- [ ] Multi-language support
- [ ] Advanced conversation memory
- [ ] Integration with more AI models
- [ ] Real-time collaboration features
- [ ] Advanced analytics and insights
