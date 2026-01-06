# Chat Widget Webhook Integration Guide

## Overview

The Experience Club frontend includes a fully functional chat widget with webhook integration for sending and receiving messages between customers and support agents.

## Features

- ✅ Beautiful WhatsApp-style chat interface
- ✅ Real-time message sending and receiving
- ✅ Webhook integration for external chat systems
- ✅ Typing indicators
- ✅ Message timestamps
- ✅ Auto-scrolling
- ✅ Smooth animations
- ✅ Mobile responsive
- ✅ Persistent chat history (localStorage)
- ✅ Secure webhook authentication

## Architecture

### Components

1. **WhatsAppButton** (`/components/WhatsAppButton.tsx`)
   - Fixed floating button in bottom-right corner
   - Opens/closes chat widget
   - Green WhatsApp branding

2. **ChatWidget** (`/components/ChatWidget.tsx`)
   - Full chat interface
   - Message bubble display
   - Input area with send button
   - Typing indicator
   - Auto-polling for new messages

### API Endpoints

#### 1. Send Messages Endpoint
**Path:** `/api/chat/send`
**Method:** `POST`

Sends customer messages to your external webhook service.

**Request Body:**
```json
{
  "message": "Customer message text",
  "timestamp": "2025-10-04T10:30:00.000Z"
}
```

**Response:**
```json
{
  "success": true,
  "response": "Agent response text",
  "timestamp": "2025-10-04T10:30:05.000Z"
}
```

**External Webhook Called:**
- URL: `NEXT_PUBLIC_CHAT_WEBHOOK_SEND_URL`
- Headers: `Authorization: Bearer YOUR_WEBHOOK_SECRET`
- Body: Customer message data

#### 2. Receive Messages Endpoint
**Path:** `/api/chat/receive`
**Methods:** `POST` (webhook receiver) & `GET` (polling)

**POST - Receive from External Webhook:**
External services send agent responses here.

**Request:**
```json
{
  "message": "Agent response",
  "timestamp": "2025-10-04T10:30:05.000Z",
  "sender": "agent"
}
```

**GET - Poll for New Messages:**
Frontend polls this endpoint every 5 seconds.

**Response:**
```json
{
  "messages": [
    {
      "id": "1728045005000",
      "text": "Agent response",
      "timestamp": "2025-10-04T10:30:05.000Z",
      "sender": "agent"
    }
  ],
  "timestamp": "2025-10-04T10:30:10.000Z"
}
```

## Environment Variables

Add these to your `.env` file:

```bash
# Chat Webhook Configuration

# URL where customer messages will be sent (your external webhook service)
NEXT_PUBLIC_CHAT_WEBHOOK_SEND_URL=https://your-webhook-service.com/api/chat/incoming

# URL where agent responses will be sent from (this frontend receives webhook)
NEXT_PUBLIC_CHAT_WEBHOOK_RECEIVE_URL=http://localhost:3060/api/chat/receive

# Secret token for webhook authentication
CHAT_WEBHOOK_SECRET=your-secure-webhook-secret-token-here
```

### Development Mode

If `NEXT_PUBLIC_CHAT_WEBHOOK_SEND_URL` is not configured, the system returns mock responses:

```typescript
{
  success: true,
  response: 'Gracias por tu mensaje. Un agente se pondrá en contacto contigo pronto. 😊',
  timestamp: new Date().toISOString(),
}
```

## Integration with External Services

### Example: Integrating with Zapier, Make.com, or N8N

#### Step 1: Configure Outgoing Webhook (Customer → External)

1. Create a webhook in your automation platform
2. Copy the webhook URL
3. Set `NEXT_PUBLIC_CHAT_WEBHOOK_SEND_URL` in `.env`
4. Generate a secret token: `openssl rand -base64 32`
5. Set `CHAT_WEBHOOK_SECRET` in `.env`

**Expected Payload from Frontend:**
```json
{
  "message": "Customer message",
  "timestamp": "2025-10-04T10:30:00.000Z",
  "source": "clubdeofertas-frontend"
}
```

#### Step 2: Configure Incoming Webhook (External → Customer)

Your external service should send POST requests to:
```
https://yourdomain.com/api/chat/receive
```

**Headers:**
```
Content-Type: application/json
Authorization: Bearer YOUR_WEBHOOK_SECRET
```

**Payload:**
```json
{
  "message": "Agent response text",
  "timestamp": "2025-10-04T10:30:05.000Z",
  "sender": "agent"
}
```

### Example: WhatsApp Business API Integration

```javascript
// Zapier or Make.com Webhook Response Code
const customerMessage = inputData.message;

// Send to WhatsApp Business API
const whatsappResponse = await sendToWhatsApp(customerMessage);

// Return response to Experience Club
return {
  response: whatsappResponse,
  timestamp: new Date().toISOString()
};
```

## Message Flow

```
┌──────────────┐
│   Customer   │
│  (Frontend)  │
└──────┬───────┘
       │ 1. Types message
       ▼
┌──────────────────────┐
│  POST /api/chat/send │
└──────┬───────────────┘
       │ 2. Forward to webhook
       ▼
┌────────────────────────┐
│  External Service      │
│  (Zapier/WhatsApp/etc) │
└──────┬─────────────────┘
       │ 3. Process & respond
       ▼
┌──────────────────────────┐
│  POST /api/chat/receive  │
└──────┬───────────────────┘
       │ 4. Queue message
       ▼
┌──────────────────────┐
│  GET /api/chat/receive│
│  (Frontend polls)     │
└──────┬────────────────┘
       │ 5. Display to customer
       ▼
┌──────────────┐
│   Customer   │
│  sees reply  │
└──────────────┘
```

## Security Considerations

1. **Webhook Secret**: Always use a strong secret token
   ```bash
   openssl rand -base64 32
   ```

2. **HTTPS Only**: Use HTTPS in production
   ```bash
   NEXT_PUBLIC_CHAT_WEBHOOK_SEND_URL=https://... # ✅
   NEXT_PUBLIC_CHAT_WEBHOOK_SEND_URL=http://...  # ❌
   ```

3. **Rate Limiting**: Implement rate limiting on webhook endpoints

4. **Validation**: Validate all incoming webhook data

## Production Deployment

### 1. Set Environment Variables

```bash
NEXT_PUBLIC_CHAT_WEBHOOK_SEND_URL=https://api.your-chat-service.com/incoming
NEXT_PUBLIC_CHAT_WEBHOOK_RECEIVE_URL=https://experience-club.online/api/chat/receive
CHAT_WEBHOOK_SECRET=<secure-random-token>
```

### 2. Use Persistent Storage

Replace in-memory queue with Redis or database:

```typescript
// api/chat/receive/route.ts
import { Redis } from '@upstash/redis';

const redis = new Redis({
  url: process.env.REDIS_URL,
  token: process.env.REDIS_TOKEN,
});

// Store message
await redis.lpush('chat:messages', JSON.stringify(message));
```

### 3. Add Webhook Endpoint to External Service

Configure your external service (Zapier, Make.com, etc.) to send POST requests to:

```
https://experience-club.online/api/chat/receive
```

## Testing

### Test Send Endpoint

```bash
curl -X POST http://localhost:3060/api/chat/send \
  -H "Content-Type: application/json" \
  -d '{
    "message": "Test message",
    "timestamp": "2025-10-04T10:30:00.000Z"
  }'
```

### Test Receive Endpoint (Simulate External Webhook)

```bash
curl -X POST http://localhost:3060/api/chat/receive \
  -H "Content-Type: application/json" \
  -H "Authorization: Bearer your-secure-webhook-secret-token-here" \
  -d '{
    "message": "Agent response",
    "timestamp": "2025-10-04T10:30:05.000Z",
    "sender": "agent"
  }'
```

### Test Polling

```bash
curl http://localhost:3060/api/chat/receive
```

## Troubleshooting

### Chat not opening
- Check browser console for errors
- Verify WhatsAppButton is imported in layout.tsx

### Messages not sending
- Check `NEXT_PUBLIC_CHAT_WEBHOOK_SEND_URL` is set
- Verify network tab for API call status
- Check backend webhook service is accessible

### Messages not receiving
- Verify external service is sending to correct URL
- Check `Authorization` header matches `CHAT_WEBHOOK_SECRET`
- Monitor `/api/chat/receive` POST endpoint logs

### Polling not working
- Check browser network tab for GET requests to `/api/chat/receive`
- Verify 5-second interval is working
- Check for JavaScript errors in console

## Customization

### Change Polling Interval

Edit `ChatWidget.tsx`:

```typescript
const interval = setInterval(pollMessages, 5000); // 5 seconds (default)
// Change to:
const interval = setInterval(pollMessages, 3000); // 3 seconds
```

### Customize Welcome Message

Edit `ChatWidget.tsx`:

```typescript
const [messages, setMessages] = useState<Message[]>([
  {
    id: '1',
    text: 'Your custom welcome message here!',
    sender: 'agent',
    timestamp: new Date(),
  },
]);
```

### Change Chat Position

Edit `WhatsAppButton.tsx` and `ChatWidget.tsx`:

```typescript
// From bottom-right to bottom-left
className="fixed bottom-6 left-6 ..." // Change right-6 to left-6
```

## Support

For issues or questions:
- Check browser console for errors
- Review API endpoint responses
- Verify environment variables are loaded
- Test webhook connectivity

---

**Version:** 1.0.1
**Last Updated:** October 4, 2025
**Author:** Experience Club Development Team
