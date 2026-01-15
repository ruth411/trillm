# TriLLM Backend Connection Fix

## THE PROBLEM:
Your frontend at https://trillm.ruthwikdovala.com is trying to connect to `http://localhost:3001/api` (default value) instead of your deployed backend at `https://trillm-backend.vercel.app/api`.

## THE FIX:

### In Vercel Dashboard:

1. **Go to your FRONTEND project** (NOT backend):
   https://vercel.com/ruthwik-dovalas-projects/trillm

2. **Click Settings → Environment Variables**

3. **Update `VITE_API_URL`**:
   - Current value: (probably wrong or localhost)
   - New value: `https://trillm-backend.vercel.app/api`
   - ⚠️ **IMPORTANT**: Must include `/api` at the end!

4. **Save and Redeploy**:
   - Go to Deployments tab
   - Find "Production" deployment
   - Click ⋯ → Redeploy
   - Wait 1 minute

5. **Test**:
   - Go to https://trillm.ruthwikdovala.com
   - Hard refresh: Ctrl+Shift+R (Windows) or Cmd+Shift+R (Mac)
   - Type "What is 2+2?"
   - Click "Ask TriLLM"
   - ✅ Should work!

## VERIFICATION:

Your backend is confirmed working at:
- Health: https://trillm-backend.vercel.app/api/health
- Query: https://trillm-backend.vercel.app/api/query

The frontend just needs to know where to find it!

## IF STILL NOT WORKING:

Check browser console (F12):
- Should show: `[API Request] POST /query`
- Should connect to: `https://trillm-backend.vercel.app/api/query`
- If it shows `localhost` → Environment variable not set correctly
