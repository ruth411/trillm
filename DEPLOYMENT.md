# TriLLM Deployment Guide

This guide will help you deploy TriLLM frontend to Vercel.

## Prerequisites

- GitHub account
- Vercel account (free tier is sufficient)
- Code pushed to GitHub repository

## Option 1: Deploy via Vercel Dashboard (Recommended)

### Step 1: Push Code to GitHub

```bash
# Already done! ✅
# Your code is at: https://github.com/ruth411/trillm
```

### Step 2: Deploy to Vercel

1. Go to [vercel.com](https://vercel.com) and sign in
2. Click **"Add New Project"**
3. Import your GitHub repository: `ruth411/trillm`
4. Configure project:
   - **Framework Preset**: Vite
   - **Root Directory**: `frontend`
   - **Build Command**: `npm run build`
   - **Output Directory**: `dist`
5. Add Environment Variable:
   - **Key**: `VITE_API_URL`
   - **Value**: `https://trillm-api.railway.app/api` (update when backend is deployed)
6. Click **"Deploy"**

### Step 3: Get Your URL

After deployment completes, Vercel will provide a URL like:
- `https://trillm.vercel.app` (or similar)

You can also add a custom domain later!

---

## Option 2: Deploy via Vercel CLI

### Step 1: Install Vercel CLI

```bash
npm install -g vercel
```

### Step 2: Login to Vercel

```bash
vercel login
```

### Step 3: Deploy

```bash
cd frontend
vercel
```

Follow the prompts:
- Link to existing project? **No**
- Project name? **trillm**
- Directory? **./frontend**

### Step 4: Set Environment Variables

```bash
vercel env add VITE_API_URL
# Enter: https://trillm-api.railway.app/api
```

### Step 5: Deploy to Production

```bash
vercel --prod
```

---

## Option 3: Automatic Deployment (GitHub Integration)

Once deployed via Option 1 or 2, Vercel automatically:
- Deploys on every push to `main` branch
- Creates preview deployments for pull requests
- Provides deployment status in GitHub

---

## Post-Deployment

### Update Portfolio Website

Once deployed, add the TriLLM URL to your portfolio:

```html
<!-- Add this button to ruthwikdovala.com -->
<a href="https://trillm.vercel.app" class="trillm-button">
  Try TriLLM →
</a>
```

### Custom Domain (Optional)

To use a custom domain like `trillm.ruthwikdovala.com`:

1. In Vercel dashboard, go to your project
2. Click **Settings** → **Domains**
3. Add domain: `trillm.ruthwikdovala.com`
4. Update DNS records as instructed by Vercel

---

## Environment Variables

| Variable | Production Value | Notes |
|----------|-----------------|-------|
| `VITE_API_URL` | `https://trillm-api.railway.app/api` | Update when backend is deployed |

---

## Monitoring Deployment

- **Deployment Status**: Check Vercel dashboard
- **Build Logs**: Available in deployment details
- **Analytics**: Enable in Vercel settings
- **Error Tracking**: Consider adding Sentry

---

## Troubleshooting

### Build Fails

```bash
# Check build locally first
cd frontend
npm run build
```

### Environment Variables Not Working

- Ensure variables start with `VITE_`
- Redeploy after adding/changing env vars

### 404 Errors

- Check `vercel.json` configuration
- Ensure SPA fallback is configured

---

## Next Steps

1. ✅ Deploy frontend to Vercel
2. ✅ Get deployment URL
3. Add button to ruthwikdovala.com
4. Deploy backend (when API keys are ready)
5. Update `VITE_API_URL` to backend URL

---

**Happy Deploying! 🚀**
