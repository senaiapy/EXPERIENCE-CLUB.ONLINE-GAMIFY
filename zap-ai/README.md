# 🤖 Experience Club - AI Chatbot with n8n

Complete AI-powered chatbot integration using n8n workflows, OpenAI GPT, and PostgreSQL for conversation storage.

## 📋 Table of Contents

- [Overview](#overview)
- [Features](#features)
- [Architecture](#architecture)
- [Setup Instructions](#setup-instructions)
- [Configuration](#configuration)
- [Workflow Details](#workflow-details)
- [Testing](#testing)
- [Troubleshooting](#troubleshooting)

## 🎯 Overview

This chatbot system provides intelligent customer service for Experience Club e-commerce platform with:

- **Real-time chat** via n8n webhooks
- **AI-powered responses** using OpenAI GPT-3.5-turbo
- **Intent detection** and smart routing
- **Conversation history** stored in PostgreSQL
- **Analytics tracking** for performance monitoring
- **Quick reply suggestions** for better UX

## ✨ Features

### 🧠 Intelligent Features
- ✅ Natural language understanding with OpenAI
- ✅ Intent-based routing (greeting, pricing, shipping, orders, products)
- ✅ Context-aware responses with conversation history
- ✅ Multi-language support (Spanish)
- ✅ Emoji-enhanced responses

### 💾 Data Management
- ✅ PostgreSQL database for persistence
- ✅ Session tracking across conversations
- ✅ User identification (authenticated or anonymous)
- ✅ Analytics and performance metrics

### 🎨 Frontend Integration
- ✅ React-based chat widget
- ✅ Real-time message updates
- ✅ Typing indicators
- ✅ Quick reply buttons
- ✅ Conversation history persistence

## 🏗️ Architecture

```
┌─────────────────┐
│  Frontend Chat  │
│     Widget      │
└────────┬────────┘
         │ HTTP POST
         ▼
┌─────────────────┐
│  n8n Webhook    │
│  Trigger Node   │
└────────┬────────┘
         │
         ▼
┌─────────────────┐     ┌──────────────┐
│ Save Message    │────▶│ PostgreSQL   │
│   to Database   │     │  Database    │
└────────┬────────┘     └──────────────┘
         │
         ▼
┌─────────────────┐
│ Get Conversation│
│    History      │
└────────┬────────┘
         │
         ▼
┌─────────────────┐
│ Process Context │
│ & Detect Intent │
└────────┬────────┘
         │
         ▼
┌─────────────────┐
│  Route by       │
│    Intent       │
└─────┬───┬───┬───┘
      │   │   │
   ┌──┴┐┌─┴┐┌─┴──┐
   │ A ││ B ││ C  │  (Predefined responses)
   └──┬┘└─┬┘└─┬──┘
      │   │   │
      └───┼───┘
          ▼
   ┌──────────────┐
   │  OpenAI GPT  │  (Fallback for complex queries)
   └──────┬───────┘
          │
          ▼
   ┌──────────────┐
   │    Merge     │
   │  Responses   │
   └──────┬───────┘
          │
          ├─────────────┐
          ▼             ▼
   ┌──────────┐  ┌─────────────┐
   │  Update  │  │ Log         │
   │  Database│  │ Analytics   │
   └──────┬───┘  └─────────────┘
          │
          ▼
   ┌──────────────┐
   │   Respond    │
   │  to Webhook  │
   └──────────────┘
```

## 🚀 Setup Instructions

### 1. Prerequisites

- **n8n** v1.114.0 or higher ([Install n8n](https://docs.n8n.io/hosting/installation/))
- **PostgreSQL** 12+ (already available in this project)
- **OpenAI API Key** ([Get API Key](https://platform.openai.com/api-keys))
- **Node.js** 18+ (for frontend)

### 2. Database Setup

Run the database schema SQL to create required tables:

```bash
# Connect to PostgreSQL
docker-compose exec postgres psql -U clubdeofertas -d clubdeofertas

# Run schema creation
\i /path/to/zap-ai/database-schema.sql

# Or copy content and paste in psql
```

**Tables created:**
- `conversations` - Stores all chat messages
- `analytics` - Stores performance metrics
- `conversation_stats` (view) - Daily statistics
- `intent_analytics` (view) - Intent-based analytics

### 3. n8n Installation

#### Option A: Docker (Recommended)

```bash
# Create n8n directory
mkdir -p ~/n8n-data

# Run n8n with Docker
docker run -d \
  --name n8n \
  -p 5678:5678 \
  -e N8N_BASIC_AUTH_ACTIVE=true \
  -e N8N_BASIC_AUTH_USER=admin \
  -e N8N_BASIC_AUTH_PASSWORD=admin123 \
  -e WEBHOOK_URL=http://localhost:5678/ \
  -v ~/n8n-data:/home/node/.n8n \
  n8nio/n8n:latest
```

#### Option B: npm

```bash
npm install n8n -g
n8n start
```

Access n8n at: **http://localhost:5678**

### 4. Import Workflow

1. Open n8n at http://localhost:5678
2. Login with credentials
3. Click **"Workflows"** → **"Import from File"**
4. Select `chatbot-workflow.json`
5. Workflow will be imported with all nodes

### 5. Configure Credentials

#### PostgreSQL Credential

1. Go to **Credentials** → **Add Credential**
2. Select **PostgreSQL**
3. Name: `PostgreSQL - Club Ofertas`
4. Configure:
   ```
   Host: localhost (or postgres if in Docker network)
   Port: 15432
   Database: clubdeofertas
   User: clubdeofertas
   Password: clubdeofertas123
   ```
5. Click **Save**

#### OpenAI API Credential

1. Go to **Credentials** → **Add Credential**
2. Select **OpenAI API**
3. Name: `OpenAI API`
4. Enter your **API Key**
5. Click **Save**

### 6. Activate Workflow

1. Open the imported workflow
2. Click **"Active"** toggle in top-right
3. Copy the **Webhook URL** (will be something like: `http://localhost:5678/webhook/chat`)

### 7. Configure Frontend

Add environment variable to frontend `.env`:

```bash
# /frontend/.env
NEXT_PUBLIC_N8N_WEBHOOK_URL=http://localhost:5678/webhook/chat
```

### 8. Add ChatWidget to Layout

The ChatWidget is already integrated. To enable it, ensure it's added to the layout:

```typescript
// /frontend/app/layout.tsx
import ChatWidget from '../components/ChatWidget';

export default function RootLayout({ children }) {
  return (
    <html lang="es">
      <body>
        {/* ... other components ... */}
        <ChatWidget />
      </body>
    </html>
  );
}
```

## ⚙️ Configuration

### Environment Variables

**Frontend** (`/frontend/.env`):
```env
NEXT_PUBLIC_N8N_WEBHOOK_URL=http://localhost:5678/webhook/chat
```

**n8n** (Docker environment):
```env
N8N_BASIC_AUTH_ACTIVE=true
N8N_BASIC_AUTH_USER=admin
N8N_BASIC_AUTH_PASSWORD=admin123
WEBHOOK_URL=http://localhost:5678/
N8N_ENCRYPTION_KEY=your-encryption-key
```

**OpenAI Settings** (in n8n workflow):
- Model: `gpt-3.5-turbo`
- Temperature: `0.7`
- Max Tokens: `500`

### Webhook URL Format

Development:
```
http://localhost:5678/webhook/chat
```

Production:
```
https://your-n8n-domain.com/webhook/chat
```

## 📊 Workflow Details

### Node Breakdown

1. **Webhook Trigger**
   - Receives POST requests from frontend
   - Path: `/webhook/chat`
   - Accepts JSON payload with message, sessionId, userId, context

2. **Save User Message**
   - Inserts user message into `conversations` table
   - Stores: message, session, user, timestamp, context

3. **Get Conversation History**
   - Retrieves last 10 messages for the session
   - Provides context for AI responses

4. **Process Context**
   - Analyzes message to detect intent
   - Extracts keywords
   - Builds conversation context string
   - Generates quick reply suggestions

5. **Route by Intent**
   - Branches based on detected intent:
     - `greeting` → Welcome message
     - `pricing` → Price information
     - `shipping` → Shipping details
     - `order_status` → Order tracking info
     - `product_inquiry` → Product search
     - `general` → OpenAI GPT (fallback)

6. **Intent Response Nodes**
   - Pre-defined responses for common queries
   - Fast response time
   - Includes relevant suggestions

7. **OpenAI GPT Response**
   - Handles complex/unknown queries
   - Context-aware using conversation history
   - Temperature: 0.7 for natural responses

8. **Merge Responses**
   - Combines responses from all branches
   - Formats final output
   - Adds metadata (responseId, timestamp)

9. **Update Conversation**
   - Updates database with bot response
   - Links response to original message

10. **Log Analytics**
    - Tracks: intent, response time, session
    - Enables performance monitoring

11. **Respond to Webhook**
    - Returns JSON response to frontend
    - Format: `{ response, responseId, suggestions, timestamp }`

### Intent Detection Logic

```javascript
const lowerMessage = userMessage.toLowerCase();

if (includes('precio', 'costo', 'cuanto'))
  → intent = 'pricing'

else if (includes('envio', 'entrega'))
  → intent = 'shipping'

else if (includes('pedido', 'orden', 'compra'))
  → intent = 'order_status'

else if (includes('producto', 'perfume', 'marca'))
  → intent = 'product_inquiry'

else if (includes('hola', 'ayuda'))
  → intent = 'greeting'

else
  → intent = 'general' (OpenAI fallback)
```

## 🧪 Testing

### Test with cURL

```bash
# Send test message
curl -X POST http://localhost:5678/webhook/chat \
  -H "Content-Type: application/json" \
  -d '{
    "message": "Hola, ¿cuánto cuesta el envío?",
    "sessionId": "test_session_123",
    "userId": "test_user",
    "timestamp": "2025-10-15T10:00:00.000Z",
    "context": {
      "page": "/",
      "userAgent": "Test Client"
    }
  }'
```

**Expected Response:**
```json
{
  "response": "🚚 **Información de Envío**\n\nOfrecemos envío a todo Paraguay...",
  "responseId": "resp_1697364000000",
  "suggestions": ["Ver política de envío", "Sucursales", "Hablar con asesor"],
  "timestamp": "2025-10-15T10:00:01.234Z"
}
```

### Test Frontend Integration

1. Start frontend: `npm run dev:start`
2. Open: http://localhost:3060
3. Click chat icon (bottom-right)
4. Type: "Hola"
5. Verify response appears

### Test Database

```sql
-- View recent conversations
SELECT * FROM conversations ORDER BY created_at DESC LIMIT 10;

-- Check analytics
SELECT * FROM intent_analytics;

-- Daily stats
SELECT * FROM conversation_stats ORDER BY date DESC LIMIT 7;
```

## 🔧 Troubleshooting

### Issue: Workflow not receiving requests

**Solution:**
1. Check n8n is running: http://localhost:5678
2. Verify workflow is **Active**
3. Check webhook URL in frontend `.env`
4. Test with cURL directly

### Issue: Database connection error

**Solution:**
1. Verify PostgreSQL is running: `npm run dev:ps`
2. Check credentials in n8n
3. Test connection in n8n credential setup
4. Ensure database `clubdeofertas` exists

### Issue: OpenAI responses failing

**Solution:**
1. Verify API key is valid
2. Check OpenAI API credits
3. Test API key: https://platform.openai.com/playground
4. Review error in n8n execution logs

### Issue: CORS errors in browser

**Solution:**
Add CORS headers to n8n webhook response node:
```json
{
  "Access-Control-Allow-Origin": "*",
  "Access-Control-Allow-Methods": "POST, OPTIONS",
  "Access-Control-Allow-Headers": "Content-Type"
}
```

### Issue: Chat history not loading

**Solution:**
1. Check localStorage in browser (F12 → Application)
2. Clear: `localStorage.removeItem('chatHistory')`
3. Verify session ID is consistent
4. Check database for session records

## 📈 Analytics Queries

### Conversation Volume

```sql
SELECT
  DATE(created_at) as date,
  COUNT(*) as total_messages,
  COUNT(DISTINCT session_id) as unique_sessions
FROM conversations
WHERE created_at >= CURRENT_DATE - INTERVAL '7 days'
GROUP BY DATE(created_at)
ORDER BY date DESC;
```

### Popular Intents

```sql
SELECT
  intent,
  COUNT(*) as count,
  ROUND(AVG(response_time_ms)) as avg_response_ms
FROM analytics
WHERE created_at >= CURRENT_DATE - INTERVAL '7 days'
GROUP BY intent
ORDER BY count DESC;
```

### Peak Hours

```sql
SELECT
  EXTRACT(HOUR FROM created_at) as hour,
  COUNT(*) as message_count
FROM conversations
WHERE created_at >= CURRENT_DATE - INTERVAL '7 days'
GROUP BY hour
ORDER BY hour;
```

## 🚀 Production Deployment

### 1. n8n Production Setup

```bash
# Docker Compose for n8n production
version: '3.8'
services:
  n8n:
    image: n8nio/n8n:latest
    restart: always
    ports:
      - "5678:5678"
    environment:
      - N8N_BASIC_AUTH_ACTIVE=true
      - N8N_BASIC_AUTH_USER=${N8N_USER}
      - N8N_BASIC_AUTH_PASSWORD=${N8N_PASSWORD}
      - WEBHOOK_URL=https://your-domain.com/
      - N8N_ENCRYPTION_KEY=${ENCRYPTION_KEY}
      - N8N_HOST=0.0.0.0
      - N8N_PROTOCOL=https
    volumes:
      - n8n_data:/home/node/.n8n

volumes:
  n8n_data:
```

### 2. Nginx Reverse Proxy

```nginx
server {
    listen 443 ssl;
    server_name n8n.your-domain.com;

    ssl_certificate /etc/letsencrypt/live/your-domain.com/fullchain.pem;
    ssl_certificate_key /etc/letsencrypt/live/your-domain.com/privkey.pem;

    location / {
        proxy_pass http://localhost:5678;
        proxy_http_version 1.1;
        proxy_set_header Upgrade $http_upgrade;
        proxy_set_header Connection 'upgrade';
        proxy_set_header Host $host;
        proxy_cache_bypass $http_upgrade;
    }
}
```

### 3. Update Frontend Environment

```env
NEXT_PUBLIC_N8N_WEBHOOK_URL=https://n8n.your-domain.com/webhook/chat
```

### 4. Security Recommendations

- ✅ Use HTTPS for all webhook URLs
- ✅ Enable n8n basic auth or OAuth
- ✅ Set strong passwords
- ✅ Rotate OpenAI API keys regularly
- ✅ Implement rate limiting
- ✅ Monitor webhook abuse
- ✅ Encrypt sensitive data
- ✅ Regular database backups

## 📚 Additional Resources

- [n8n Documentation](https://docs.n8n.io/)
- [OpenAI API Reference](https://platform.openai.com/docs/api-reference)
- [PostgreSQL Documentation](https://www.postgresql.org/docs/)
- [Next.js Documentation](https://nextjs.org/docs)

## 🤝 Support

For issues or questions:
1. Check n8n execution logs
2. Review database logs
3. Test individual workflow nodes
4. Contact development team

## 📄 License

Part of Experience Club e-commerce platform.
