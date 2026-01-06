# 🚀 Quick Start Guide - n8n Chatbot

Get your AI chatbot up and running in 10 minutes!

## 📋 Prerequisites Check

Before starting, ensure you have:

- [ ] PostgreSQL running (port 15432)
- [ ] Docker installed
- [ ] OpenAI API key ([Get one here](https://platform.openai.com/api-keys))
- [ ] Terminal access

## ⚡ Quick Setup (5 Steps)

### Step 1: Create Database Tables (2 min)

```bash
# From project root
cd /media/galo/3a6b0a4e-6cfc-45eb-af54-75b5939133753/PROJECTS/CLUBDEOFERTAS/CLUBOFERTAS-V1.0.1

# Connect to PostgreSQL
docker-compose exec postgres psql -U clubdeofertas -d clubdeofertas

# Copy and paste the entire content of zap-ai/database-schema.sql
\i /path/to/zap-ai/database-schema.sql

# Or manually:
# 1. Open zap-ai/database-schema.sql
# 2. Copy all SQL content
# 3. Paste into psql terminal
# 4. Press Enter

# Verify tables created
\dt

# You should see: conversations, analytics

# Exit psql
\q
```

### Step 2: Start n8n (2 min)

```bash
# Create n8n data directory
mkdir -p ~/n8n-data

# Run n8n with Docker
docker run -d \
  --name n8n-clubofertas \
  --network clubofertas-v1.0.1_default \
  -p 5678:5678 \
  -e N8N_BASIC_AUTH_ACTIVE=true \
  -e N8N_BASIC_AUTH_USER=admin \
  -e N8N_BASIC_AUTH_PASSWORD=admin123 \
  -e WEBHOOK_URL=http://localhost:5678/ \
  -v ~/n8n-data:/home/node/.n8n \
  n8nio/n8n:latest

# Check n8n is running
docker ps | grep n8n

# Access n8n at: http://localhost:5678
# Login: admin / admin123
```

### Step 3: Import Workflow (2 min)

1. Open browser: http://localhost:5678
2. Login with `admin` / `admin123`
3. Click **"Workflows"** in left sidebar
4. Click **"Add Workflow"** → **"Import from File"**
5. Select `zap-ai/chatbot-workflow.json`
6. Click **"Import"**

### Step 4: Configure Credentials (3 min)

#### PostgreSQL Credential

1. In n8n, click **"Credentials"** (left sidebar)
2. Click **"Add Credential"**
3. Search for **"PostgreSQL"**
4. Fill in:
   ```
   Name: PostgreSQL - Club Ofertas
   Host: postgres (or localhost if n8n outside Docker network)
   Port: 5432 (use 15432 if outside Docker network)
   Database: clubdeofertas
   User: clubdeofertas
   Password: clubdeofertas123
   ```
5. Click **"Test Connection"** → Should show success
6. Click **"Save"**

#### OpenAI Credential

1. Click **"Add Credential"** again
2. Search for **"OpenAI"**
3. Fill in:
   ```
   Name: OpenAI API
   API Key: sk-... (your OpenAI API key)
   ```
4. Click **"Save"**

### Step 5: Activate Workflow (1 min)

1. Go back to **"Workflows"**
2. Open **"Experience Club AI Chatbot"**
3. Click the **"Inactive"** toggle in top-right → It will turn to **"Active"**
4. Copy the **Webhook URL** shown in the Webhook node (something like: `http://localhost:5678/webhook/chat`)

## 🎨 Frontend Configuration

### Add Environment Variable

```bash
# Edit frontend/.env
cd frontend
echo "NEXT_PUBLIC_N8N_WEBHOOK_URL=http://localhost:5678/webhook/chat" >> .env
```

### Enable ChatWidget (already integrated!)

The ChatWidget is already added to the layout. Just ensure the WhatsAppButton component imports it:

```bash
# Check if ChatWidget is in layout
grep -r "ChatWidget" frontend/app/layout.tsx

# If not found, add it to the layout imports
```

## ✅ Test Your Setup

### Test 1: Direct Webhook Test

```bash
curl -X POST http://localhost:5678/webhook/chat \
  -H "Content-Type: application/json" \
  -d '{
    "message": "Hola",
    "sessionId": "test_123",
    "userId": "test_user",
    "timestamp": "2025-10-15T10:00:00.000Z",
    "context": {"page": "/", "userAgent": "Test"}
  }'
```

**Expected:** JSON response with greeting message

### Test 2: Check Database

```bash
docker-compose exec postgres psql -U clubdeofertas -d clubdeofertas

# In psql:
SELECT * FROM conversations ORDER BY created_at DESC LIMIT 3;

# You should see your test message!
```

### Test 3: Frontend Chat

1. Start frontend: `npm run dev:start`
2. Open: http://localhost:3060
3. Look for chat icon (bottom-right, green floating button)
4. Click it to open chat
5. Type: "Hola"
6. You should get a welcome message!

## 🐛 Troubleshooting

### n8n won't start

```bash
# Check if port 5678 is already in use
lsof -i :5678

# Stop existing n8n
docker stop n8n-clubofertas
docker rm n8n-clubofertas

# Restart
docker run -d --name n8n-clubofertas...
```

### Database connection fails

```bash
# Verify PostgreSQL is running
npm run dev:ps

# Check connection from n8n container
docker exec -it n8n-clubofertas ping postgres

# If fails, use "localhost" and port "15432" in n8n credentials
```

### Webhook returns error

1. Check workflow is **Active** (green toggle)
2. Check webhook URL matches frontend `.env`
3. View execution logs in n8n (click "Executions" tab)
4. Check OpenAI API key is valid

### Chat widget doesn't appear

```bash
# Restart frontend
npm run dev:stop
npm run dev:start

# Check browser console for errors (F12)

# Verify WhatsAppButton is rendering
# Open http://localhost:3060 and check for green floating button
```

## 🎉 Success Indicators

You'll know it's working when:

✅ n8n dashboard shows workflow as "Active"
✅ Database has `conversations` and `analytics` tables
✅ curl test returns JSON response
✅ Chat widget appears on frontend
✅ Messages receive responses within 2-3 seconds
✅ Database shows new conversations after each message

## 📚 Next Steps

Now that your chatbot is running:

1. **Customize responses** - Edit intent responses in n8n workflow
2. **Add more intents** - Duplicate response nodes for new topics
3. **Integrate products** - Connect to products API for dynamic responses
4. **Add analytics dashboard** - Query analytics table for insights
5. **Train OpenAI** - Fine-tune system prompt for better responses

## 🔗 Useful Links

- **n8n Dashboard**: http://localhost:5678
- **Frontend**: http://localhost:3060
- **Admin Panel**: http://localhost:3061
- **API Docs**: http://localhost:3062/api/docs

## 📞 Need Help?

- Check [README.md](./README.md) for detailed documentation
- Review n8n execution logs for errors
- Test each workflow node individually
- Check database for saved conversations

## 🚀 Ready for Production?

See [README.md](./README.md) → "Production Deployment" section for:
- SSL/HTTPS setup
- Nginx reverse proxy
- Security hardening
- Performance optimization
