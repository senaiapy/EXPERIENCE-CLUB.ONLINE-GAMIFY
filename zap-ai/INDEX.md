# 📚 zap-ai Documentation Index

Complete AI Chatbot Integration for Experience Club E-commerce Platform

---

## 📁 Files in this Directory

### 🚀 Quick Start (Start Here!)
1. **[QUICKSTART.md](./QUICKSTART.md)** - 10-minute setup guide
   - Prerequisites checklist
   - 5-step installation
   - Quick testing procedures
   - Common troubleshooting

### 📖 Complete Documentation
2. **[README.md](./README.md)** - Full documentation (4,000+ words)
   - Architecture overview
   - Detailed setup instructions
   - Workflow node explanations
   - Production deployment guide
   - Security recommendations
   - Analytics queries

### 📋 Implementation Details
3. **[IMPLEMENTATION_SUMMARY.md](./IMPLEMENTATION_SUMMARY.md)** - Technical summary
   - What was delivered
   - Features implemented
   - Technical specifications
   - Testing checklist
   - Cost estimation
   - Future enhancements

### ⚙️ Configuration Files
4. **[config.example.json](./config.example.json)** - Configuration template
   - n8n settings
   - Database connection
   - OpenAI configuration
   - Intent definitions
   - Security settings

### 🤖 n8n Workflow
5. **[chatbot-workflow.json](./chatbot-workflow.json)** - n8n workflow (v1.114.0+)
   - 14 nodes configured
   - Intent-based routing
   - PostgreSQL integration
   - OpenAI GPT integration
   - Analytics tracking
   - **Import this file into n8n**

### 💾 Database Schema
6. **[database-schema.sql](./database-schema.sql)** - PostgreSQL tables and views
   - `conversations` table
   - `analytics` table
   - Views for statistics
   - Indexes and triggers
   - Sample queries
   - **Run this in PostgreSQL**

---

## 🎯 Getting Started (Choose Your Path)

### 👉 Path 1: Quick Setup (Recommended)
1. Read [QUICKSTART.md](./QUICKSTART.md)
2. Follow the 5 steps
3. Test your chatbot
4. You're done!

**Time**: 10 minutes

### 👉 Path 2: Complete Understanding
1. Read [README.md](./README.md) for architecture
2. Review [chatbot-workflow.json](./chatbot-workflow.json) structure
3. Study [database-schema.sql](./database-schema.sql)
4. Follow detailed setup in README
5. Configure using [config.example.json](./config.example.json)
6. Deploy to production

**Time**: 1-2 hours

### 👉 Path 3: Technical Review
1. Read [IMPLEMENTATION_SUMMARY.md](./IMPLEMENTATION_SUMMARY.md)
2. Review technical specifications
3. Check testing checklist
4. Plan deployment strategy

**Time**: 30 minutes

---

## 📂 Integration Points

### Frontend Integration
Location: `/frontend/`

**Files Modified:**
- `components/ChatWidget.tsx` - Chat interface
- `lib/n8n-api.ts` - API service (NEW)
- `.env` - Added `NEXT_PUBLIC_N8N_WEBHOOK_URL`

**Usage:**
```typescript
import { getN8nService } from '@/lib/n8n-api';

const n8n = getN8nService();
const response = await n8n.sendMessage('Hola');
```

### Backend Integration
Location: PostgreSQL database

**Tables Created:**
- `conversations` - Chat messages
- `analytics` - Performance metrics

**Views Created:**
- `conversation_stats` - Daily statistics
- `intent_analytics` - Intent analysis

### n8n Integration
Location: n8n workflow (separate service)

**Endpoint:**
- Development: `http://localhost:5678/webhook/chat`
- Production: `https://n8n.your-domain.com/webhook/chat`

**Required Credentials:**
- PostgreSQL connection
- OpenAI API key

---

## 🔧 Setup Sequence

```
1. Database Setup
   └── Run database-schema.sql in PostgreSQL
   └── Verify tables created

2. n8n Installation
   └── Start n8n (Docker or npm)
   └── Access http://localhost:5678
   └── Create credentials (PostgreSQL, OpenAI)

3. Workflow Import
   └── Import chatbot-workflow.json
   └── Verify all nodes connected
   └── Activate workflow

4. Frontend Configuration
   └── Add NEXT_PUBLIC_N8N_WEBHOOK_URL to .env
   └── Restart frontend service
   └── Test chat widget

5. Testing
   └── Send test message via cURL
   └── Check database for saved conversation
   └── Verify analytics logged
   └── Test frontend chat widget
```

---

## 📊 System Architecture

```
┌─────────────────────────────────────────────────────┐
│                  USER'S BROWSER                     │
│  ┌────────────────────────────────────────────┐    │
│  │        Chat Widget Component               │    │
│  │  (ChatWidget.tsx + n8n-api.ts)             │    │
│  └───────────────────┬────────────────────────┘    │
└────────────────────────┼───────────────────────────┘
                         │ HTTP POST
                         ▼
┌─────────────────────────────────────────────────────┐
│                    n8n WORKFLOW                     │
│  ┌──────────────────────────────────────────────┐  │
│  │  1. Webhook Trigger                          │  │
│  │  2. Save Message to Database                 │  │
│  │  3. Get Conversation History                 │  │
│  │  4. Process Context & Detect Intent          │  │
│  │  5. Route by Intent                          │  │
│  │     ├─ Greeting → Pre-defined Response       │  │
│  │     ├─ Pricing → Pre-defined Response        │  │
│  │     ├─ Shipping → Pre-defined Response       │  │
│  │     ├─ Orders → Pre-defined Response         │  │
│  │     └─ General → OpenAI GPT Response         │  │
│  │  6. Merge Responses                          │  │
│  │  7. Update Database with Bot Response        │  │
│  │  8. Log Analytics                            │  │
│  │  9. Respond to Webhook                       │  │
│  └──────────────────────────────────────────────┘  │
│         │                      │                    │
└─────────┼──────────────────────┼────────────────────┘
          │                      │
          ▼                      ▼
┌──────────────────┐    ┌──────────────────┐
│   PostgreSQL     │    │   OpenAI API     │
│    Database      │    │   GPT-3.5-turbo  │
│                  │    │                  │
│ • conversations  │    │ • Chat completion│
│ • analytics      │    │ • Context-aware  │
└──────────────────┘    └──────────────────┘
```

---

## 🎯 Features Overview

### ✨ Core Features
- ✅ Real-time chat messaging
- ✅ Intent-based routing
- ✅ AI-powered responses (OpenAI GPT)
- ✅ Conversation history
- ✅ Quick reply suggestions
- ✅ Session tracking
- ✅ Analytics logging

### 🧠 Intelligent Features
- ✅ Natural language understanding
- ✅ Context awareness (last 10 messages)
- ✅ Multi-intent detection
- ✅ Smart fallback to AI
- ✅ Emoji-enhanced responses
- ✅ Spanish language support

### 💾 Data Features
- ✅ PostgreSQL persistence
- ✅ User identification
- ✅ Session management
- ✅ Performance metrics
- ✅ Analytics views
- ✅ Data retention policies

### 🎨 UI Features
- ✅ Mobile-responsive design
- ✅ Typing indicators
- ✅ Message timestamps
- ✅ Quick reply buttons
- ✅ Conversation history
- ✅ Error handling

---

## 📈 Success Metrics

### Performance Targets
- Response time: < 2 seconds
- Intent accuracy: 85%+
- Uptime: 99.9%
- Concurrent users: 100+
- Cost per conversation: < $0.001

### Quality Metrics
- User satisfaction: Track with feedback
- Conversation completion: Monitor drop-offs
- Intent distribution: Analyze patterns
- Response effectiveness: Review analytics

---

## 🆘 Quick Troubleshooting

### Issue: Chatbot not responding
**Check:**
1. n8n workflow is Active ✅
2. Webhook URL matches .env ✅
3. PostgreSQL is running ✅
4. OpenAI API key is valid ✅

**Solution:** See [QUICKSTART.md](./QUICKSTART.md) → Troubleshooting

### Issue: Database errors
**Check:**
1. Tables exist in database ✅
2. n8n credentials correct ✅
3. Network connectivity ✅

**Solution:** See [README.md](./README.md) → Troubleshooting

### Issue: OpenAI errors
**Check:**
1. API key is valid ✅
2. API credits available ✅
3. Rate limits not exceeded ✅

**Solution:** Test at https://platform.openai.com/playground

---

## 📞 Support Resources

### Documentation Files
- Quick setup → [QUICKSTART.md](./QUICKSTART.md)
- Full docs → [README.md](./README.md)
- Technical details → [IMPLEMENTATION_SUMMARY.md](./IMPLEMENTATION_SUMMARY.md)

### External Resources
- [n8n Documentation](https://docs.n8n.io/)
- [OpenAI API Docs](https://platform.openai.com/docs)
- [PostgreSQL Docs](https://www.postgresql.org/docs/)
- [Next.js Docs](https://nextjs.org/docs)

### Command Reference
```bash
# Start n8n
docker run -d --name n8n -p 5678:5678 n8nio/n8n

# Check database
docker-compose exec postgres psql -U clubdeofertas -d clubdeofertas

# View conversations
SELECT * FROM conversations ORDER BY created_at DESC LIMIT 10;

# Test webhook
curl -X POST http://localhost:5678/webhook/chat \
  -H "Content-Type: application/json" \
  -d '{"message":"Hola","sessionId":"test","userId":"test","timestamp":"2025-10-15T10:00:00Z","context":{}}'
```

---

## 🎉 Next Steps

After setup is complete:

1. **Customize Responses**
   - Edit intent responses in n8n workflow
   - Add new intents as needed
   - Update keywords for better detection

2. **Monitor Performance**
   - Review analytics daily
   - Track conversation patterns
   - Optimize response times

3. **Enhance Features**
   - Add product recommendations
   - Integrate order tracking
   - Connect live chat handoff

4. **Production Deployment**
   - Set up SSL/HTTPS
   - Configure production URLs
   - Implement rate limiting
   - Set up monitoring alerts

---

## 📄 File Checksums (for verification)

- `chatbot-workflow.json` - 14 nodes, ~600 lines
- `database-schema.sql` - 2 tables, 2 views, ~200 lines
- `README.md` - ~4,000 words
- `QUICKSTART.md` - ~2,000 words
- `IMPLEMENTATION_SUMMARY.md` - ~3,000 words
- `config.example.json` - ~150 lines

**Total Documentation**: 10,000+ words
**Total Code**: 3,000+ lines

---

## ✅ Status: COMPLETE AND READY FOR USE

All files are production-ready and tested. Follow [QUICKSTART.md](./QUICKSTART.md) to get started in 10 minutes!

**Last Updated**: October 15, 2025
**Version**: 1.0.0
**Compatible with**: n8n v1.114.0+
