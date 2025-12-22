# Deploy TriLLM Backend - Quick Guide

## Step 1: Push Changes to GitHub (1 minute)

The backend is configured and ready. To push the changes:

```bash
cd /home/user/trillm
git push origin main
```

Or if that doesn't work, push from GitHub web interface:
1. Go to https://github.com/ruth411/trillm
2. Upload the changed files (backend/vercel.json and backend/src/server.ts)

## Step 2: Deploy Backend to Vercel (5 minutes)

### Option A: Vercel CLI (Fastest)

```bash
cd /home/user/trillm/backend
npm install -g vercel
vercel login
vercel
```

When prompted:
- Set up and deploy: Yes
- Scope: Select your account
- Link to existing project: No
- Project name: `trillm-backend`
- Directory: `./` (you're already in backend folder)
- Override settings: No

Then add environment variables:
```bash
vercel env add OPENAI_API_KEY
# Paste your OpenAI API key from backend/.env file (starts with sk-proj-)

vercel env add FRONTEND_URL
# Paste: https://trillm.ruthwikdovala.com

vercel env add NODE_ENV
# Paste: production

vercel --prod
```

### Option B: Vercel Dashboard (Easier)

1. Go to https://vercel.com/new
2. Import `ruth411/trillm` repository
3. Configure project:
   - **Project Name**: `trillm-backend`
   - **Root Directory**: `backend` ← Click Edit and select backend folder
   - **Framework Preset**: Other
   - **Build Command**: `npm run build`
   - **Output Directory**: `dist`

4. Add Environment Variables:
   - `OPENAI_API_KEY`: Your OpenAI API key from `backend/.env` (starts with `sk-proj-`)
   - `FRONTEND_URL`: `https://trillm.ruthwikdovala.com`
   - `NODE_ENV`: `production`

5. Click **Deploy**

6. Copy your backend URL (will look like: `https://trillm-backend.vercel.app`)

## Step 3: Connect Frontend to Backend (2 minutes)

1. Go to your frontend Vercel project settings
2. Settings → Environment Variables
3. Add new variable:
   - **Name**: `VITE_API_URL`
   - **Value**: `https://your-backend-url.vercel.app` (paste the URL from Step 2)
   - Example: `https://trillm-backend.vercel.app`

   ⚠️ **Important**: Don't add `/api` at the end - just the base URL

4. Go to Deployments tab
5. Click ⋯ (three dots) on latest deployment → **Redeploy**

## Step 4: Test Your App! (30 seconds)

1. Go to https://trillm.ruthwikdovala.com
2. Type a question: "What is the capital of France?"
3. Click "Ask TriLLM"
4. You should see OpenAI respond with the answer!

## Troubleshooting

**If frontend still shows "Backend Coming Soon":**
- Make sure VITE_API_URL is set correctly in frontend Vercel project
- Make sure you redeployed frontend after adding the environment variable
- Clear browser cache (Ctrl+Shift+R)

**If you get CORS errors:**
- Check that FRONTEND_URL in backend matches your actual frontend URL
- Redeploy backend after fixing

**If OpenAI returns errors:**
- Check that OPENAI_API_KEY is set correctly in backend
- Make sure the API key is valid
- Check OpenAI API status: https://status.openai.com

## What's Ready

✅ Backend code configured for Vercel
✅ OpenAI integration working
✅ CORS configured for your frontend
✅ Error handling in place
✅ Frontend ready to connect

All you need to do is deploy!

## Expected Timeline

- Step 1 (Push): 1 minute
- Step 2 (Deploy Backend): 3-5 minutes
- Step 3 (Update Frontend): 2 minutes
- Step 4 (Test): 30 seconds

**Total: ~10 minutes to working AI app!**
