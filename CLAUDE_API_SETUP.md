# Add Claude API to TriLLM

## ✅ What I Did:

I've integrated Claude (Anthropic) API alongside OpenAI! Now your app will query **both APIs simultaneously** and show you the best answer.

### Changes Made:
- ✅ Created `ClaudeService` with Claude 3.5 Sonnet integration
- ✅ Updated `QueryController` to query OpenAI and Claude in parallel
- ✅ Added `ANTHROPIC_API_KEY` to environment configuration
- ✅ Installed `@anthropic-ai/sdk` package
- ✅ Both APIs return responses with scores - best one is highlighted

---

## 🔑 Step 1: Get Your Claude API Key (5 minutes)

### Get API Key:
1. Go to: https://console.anthropic.com/
2. Sign up or log in
3. Click **"Get API Keys"** or go to: https://console.anthropic.com/settings/keys
4. Click **"Create Key"**
5. Give it a name like "TriLLM"
6. **Copy the API key** (starts with `sk-ant-...`)

### Add Credits:
- Go to: https://console.anthropic.com/settings/billing
- Add payment method and credits (minimum $5)
- Claude pricing: ~$3 per million input tokens, ~$15 per million output tokens
- For comparison: 1000 questions ≈ $0.10-0.50

---

## 🚀 Step 2: Deploy with Claude (10 minutes)

### Merge the Code:
1. Go to: https://github.com/ruth411/trillm/pull/new/claude/add-claude-api-zvr7T
2. Click **"Create pull request"**
3. Click **"Merge pull request"**
4. Click **"Confirm merge"**

### Update Backend in Vercel:

1. **Go to backend project**: https://vercel.com/ruthwik-dovalas-projects/trillm-backend

2. **Add Claude API Key**:
   - Click **Settings** → **Environment Variables**
   - Click **"Add Variable"**
   - Name: `ANTHROPIC_API_KEY`
   - Value: Your Claude API key (starts with `sk-ant-...`)
   - Click **"Save"**

3. **Redeploy Backend**:
   - Click **"Deployments"** tab
   - Click **⋯** on latest deployment
   - Click **"Redeploy"**
   - Wait 1-2 minutes

### Update Frontend (if not done already):

1. **Go to frontend project**: https://vercel.com/ruthwik-dovalas-projects/trillm

2. **Check `VITE_API_URL`**:
   - Settings → Environment Variables
   - Should be: `https://trillm-backend.vercel.app/api`
   - If not, update and redeploy frontend

3. **Redeploy Frontend** (if needed):
   - Deployments → ⋯ → Redeploy

---

## 🎉 Step 3: Test Both APIs!

1. Go to: https://trillm.ruthwikdovala.com
2. Hard refresh: **Ctrl+Shift+R** (or Cmd+Shift+R)
3. Ask: "Explain quantum computing in simple terms"
4. Click **"Ask TriLLM"**

### What You'll See:
- **Two response cards**: One from OpenAI (ChatGPT), one from Claude
- **Scores for each**: Based on answer quality (length, structure, examples)
- **Best Answer highlighted**: At the top with 🏆
- **Response times**: See which API is faster
- **Side-by-side comparison**: Compare both answers

---

## 📊 How It Works:

### Parallel Queries:
Both APIs are queried **simultaneously** (not one after another):
- OpenAI GPT-3.5-turbo
- Claude 3.5 Sonnet

### Scoring Algorithm:
Responses are scored based on:
- **Length**: Longer, more detailed answers score higher
- **Structure**: Paragraphs, lists, code blocks add points
- **Completeness**: Examples, nuance, context increase score
- **Maximum score**: 100

### Best Answer Selection:
- Highest scoring response is marked as "Best"
- Shown at the top with special highlighting
- Other responses shown below for comparison

---

## 💰 Cost Comparison:

**OpenAI GPT-3.5-turbo:**
- Input: $0.50 per 1M tokens
- Output: $1.50 per 1M tokens
- ~1000 questions: $0.10-0.30

**Claude 3.5 Sonnet:**
- Input: $3 per 1M tokens
- Output: $15 per 1M tokens
- ~1000 questions: $0.30-0.60

**Total for both APIs:**
- ~1000 questions: $0.40-0.90
- Very affordable for testing!

---

## ⚙️ Environment Variables Summary:

**Backend needs these 4 variables:**
- `OPENAI_API_KEY` - Your OpenAI key (sk-proj-...)
- `ANTHROPIC_API_KEY` - Your Claude key (sk-ant-...)
- `FRONTEND_URL` - https://trillm.ruthwikdovala.com
- `NODE_ENV` - production

**Frontend needs this 1 variable:**
- `VITE_API_URL` - https://trillm-backend.vercel.app/api

---

## 🔧 Troubleshooting:

**Only seeing OpenAI responses?**
- Make sure you added `ANTHROPIC_API_KEY` to backend
- Make sure you redeployed backend after adding the key
- Check backend logs in Vercel for errors

**Getting Claude API errors?**
- Verify API key is correct (starts with `sk-ant-`)
- Make sure you added payment method in Anthropic console
- Check you have available credits

**Both APIs showing errors?**
- Check frontend `VITE_API_URL` is correct
- Make sure backend is deployed and running
- Clear browser cache and hard refresh

---

## 🎯 What's Next:

Want to add Google Gemini too? Let me know and I'll integrate it!

Your app will show responses from all 3 major AI providers side-by-side.

---

**Need help?** Let me know which step you're on!
