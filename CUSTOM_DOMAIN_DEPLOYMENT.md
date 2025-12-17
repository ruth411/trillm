# Deploy TriLLM to trillm.ruthwikdovala.com

Complete guide to deploy TriLLM frontend to your custom subdomain.

## Quick Overview

1. Deploy to Vercel (gets temporary URL)
2. Configure custom domain `trillm.ruthwikdovala.com`
3. Update DNS records
4. Done! Your TriLLM is live at trillm.ruthwikdovala.com

---

## Step 1: Deploy to Vercel

### Via Vercel Dashboard (Easiest)

1. **Go to Vercel**
   - Visit [vercel.com](https://vercel.com)
   - Sign in with GitHub

2. **Import Project**
   - Click **"Add New Project"**
   - Search for `ruth411/trillm`
   - Click **"Import"**

3. **Configure Build Settings**
   ```
   Framework Preset: Vite
   Root Directory: frontend
   Build Command: npm run build
   Output Directory: dist
   Install Command: npm install
   ```

4. **Add Environment Variable** (for now, will update later)
   - Click **"Environment Variables"**
   - Add:
     - **Name**: `VITE_API_URL`
     - **Value**: `http://localhost:3001/api` (temporary)

5. **Deploy**
   - Click **"Deploy"**
   - Wait 1-2 minutes for build to complete
   - You'll get a temporary URL like: `trillm-xyz123.vercel.app`

---

## Step 2: Configure Custom Domain

### In Vercel Dashboard

1. **Go to Project Settings**
   - Click on your `trillm` project
   - Go to **Settings** → **Domains**

2. **Add Custom Domain**
   - Click **"Add"**
   - Enter: `trillm.ruthwikdovala.com`
   - Click **"Add"**

3. **Get DNS Configuration**
   - Vercel will show you the DNS records to add
   - You'll see something like:
     ```
     Type: CNAME
     Name: trillm
     Value: cname.vercel-dns.com
     ```

---

## Step 3: Update DNS Records

You need to add a DNS record for your domain. Where you do this depends on your DNS provider:

### If ruthwikdovala.com uses Vercel DNS:

1. Go to Vercel Dashboard
2. Navigate to your `ruthwikdovala.com` project (or domain settings)
3. Go to **Domains** → **DNS**
4. Add new record:
   - **Type**: CNAME
   - **Name**: trillm
   - **Value**: cname.vercel-dns.com
   - **TTL**: Auto

### If using Cloudflare:

1. Log in to [Cloudflare](https://dash.cloudflare.com)
2. Select your `ruthwikdovala.com` domain
3. Go to **DNS** → **Records**
4. Click **"Add record"**
   - **Type**: CNAME
   - **Name**: trillm
   - **Target**: cname.vercel-dns.com
   - **Proxy status**: DNS only (turn off orange cloud)
   - **TTL**: Auto
5. Click **"Save"**

### If using GoDaddy:

1. Log in to GoDaddy
2. Go to **My Products** → **DNS**
3. Click **"Add"** under Records
   - **Type**: CNAME
   - **Name**: trillm
   - **Value**: cname.vercel-dns.com
   - **TTL**: 1 hour
4. Click **"Save"**

### If using Namecheap:

1. Log in to Namecheap
2. Go to **Domain List** → Click **"Manage"**
3. Go to **Advanced DNS**
4. Click **"Add New Record"**
   - **Type**: CNAME Record
   - **Host**: trillm
   - **Value**: cname.vercel-dns.com
   - **TTL**: Automatic
5. Click **"Save"**

### Other DNS Providers:

Add a CNAME record with:
- **Name/Host**: `trillm`
- **Value/Target**: `cname.vercel-dns.com`

---

## Step 4: Wait for DNS Propagation

1. **DNS propagation takes 5 minutes to 24 hours**
   - Usually 5-30 minutes
   - Can take up to 24 hours in rare cases

2. **Check DNS Propagation**
   - Use [dnschecker.org](https://dnschecker.org)
   - Enter: `trillm.ruthwikdovala.com`
   - Type: CNAME
   - Should show: `cname.vercel-dns.com`

3. **Vercel Auto-Configures SSL**
   - Once DNS propagates, Vercel automatically:
     - Issues SSL certificate (HTTPS)
     - Configures your domain
     - Redirects HTTP → HTTPS

---

## Step 5: Verify Deployment

### Test Your Site

1. **Visit**: https://trillm.ruthwikdovala.com
2. **You should see**:
   - Beautiful TriLLM landing page
   - Gradient "TriLLM" title
   - Question input box
   - Sample questions

### Test Functionality (without backend)

1. Type a question
2. Click "Ask TriLLM"
3. You'll see an error (expected - backend not deployed yet)
4. Error handling should work gracefully

---

## Step 6: Update Portfolio Links

Now update your portfolio to use the custom domain:

### In your portfolio code (`ruthwikdovala.com`):

Replace all instances of `https://trillm.vercel.app` with:
```
https://trillm.ruthwikdovala.com
```

Example in navigation:
```tsx
<a
  href="https://trillm.ruthwikdovala.com"
  target="_blank"
  rel="noopener noreferrer"
  className="chip bg-gradient-to-r from-blue-600 to-purple-600 text-white"
>
  ✨ TriLLM
</a>
```

---

## Step 7: Update Environment Variable (Later)

When you deploy the backend:

1. Go to Vercel → Your Project → Settings → Environment Variables
2. Update `VITE_API_URL`:
   - **Name**: `VITE_API_URL`
   - **Value**: `https://your-backend-url.railway.app/api`
3. Redeploy to apply changes

---

## Deployment Checklist

- [ ] Deploy to Vercel
- [ ] Get temporary Vercel URL
- [ ] Add custom domain in Vercel
- [ ] Get DNS configuration from Vercel
- [ ] Add CNAME record to DNS provider
- [ ] Wait for DNS propagation (5-30 min)
- [ ] Visit https://trillm.ruthwikdovala.com
- [ ] Verify SSL is working (HTTPS)
- [ ] Update portfolio links to use custom domain
- [ ] (Later) Update `VITE_API_URL` when backend is ready

---

## Troubleshooting

### Domain not working after 24 hours

**Check DNS Records:**
```bash
nslookup trillm.ruthwikdovala.com
# Should show CNAME pointing to Vercel
```

**Common Issues:**
- Wrong CNAME value (should be `cname.vercel-dns.com`)
- Cloudflare proxy enabled (turn off orange cloud)
- Parent domain not verified in Vercel

### SSL Certificate Error

- Wait 10-15 minutes after DNS propagates
- Vercel needs time to issue certificate
- Check Vercel dashboard for SSL status

### "Configuration Invalid" in Vercel

- Ensure CNAME points to `cname.vercel-dns.com`
- Not `trillm-xyz.vercel.app` (don't use A record)
- Must be CNAME record, not A or AAAA

### Build Fails

```bash
# Test build locally first
cd /home/user/trillm/frontend
npm run build
```

---

## Architecture After Deployment

```
User visits: https://trillm.ruthwikdovala.com
            ↓
    DNS lookup (CNAME)
            ↓
    Vercel Edge Network
            ↓
    TriLLM Frontend (React App)
            ↓
    API calls to backend (when ready)
            ↓
    OpenAI, Anthropic, Google APIs
```

---

## What You Have Now

✅ **Frontend**: Complete and production-ready
✅ **Deployment Config**: Vercel configuration ready
✅ **Documentation**: Complete deployment guide
✅ **Custom Domain Setup**: Step-by-step instructions

## What's Next

⏳ **Deploy to Vercel** (10 minutes)
⏳ **Configure DNS** (5 minutes)
⏳ **Wait for propagation** (5-30 minutes)
⏳ **Backend** (when you get API keys)

---

## Support

If you get stuck:
1. Check Vercel deployment logs
2. Verify DNS records with dnschecker.org
3. Check Vercel's domain configuration status
4. Refer to [Vercel DNS docs](https://vercel.com/docs/concepts/projects/domains)

---

**Ready to deploy! Let's make TriLLM live at trillm.ruthwikdovala.com! 🚀**
