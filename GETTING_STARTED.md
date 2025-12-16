# Getting Started with TriLLM 🚀

This guide will help you set up and run TriLLM locally for development.

## Prerequisites

Before starting, ensure you have:
- **Node.js** (v18 or higher) - [Download](https://nodejs.org/)
- **npm** or **yarn** package manager
- **Git** for version control
- **API Keys** from:
  - [OpenAI](https://platform.openai.com/api-keys) (ChatGPT)
  - [Anthropic](https://console.anthropic.com/) (Claude)
  - [Google AI](https://makersuite.google.com/app/apikey) (Gemini) - Stage 2+

## Project Structure

```
trillm/
├── frontend/              # React frontend
│   ├── src/
│   │   ├── components/   # React components
│   │   ├── pages/        # Page components
│   │   ├── hooks/        # Custom hooks
│   │   ├── utils/        # Utility functions
│   │   ├── App.tsx       # Main app component
│   │   └── main.tsx      # Entry point
│   ├── public/           # Static assets
│   ├── package.json
│   └── vite.config.ts
│
├── backend/              # Node.js backend
│   ├── src/
│   │   ├── routes/       # API routes
│   │   ├── controllers/  # Route controllers
│   │   ├── services/     # Business logic
│   │   ├── adapters/     # LLM adapters
│   │   ├── utils/        # Utility functions
│   │   ├── config/       # Configuration
│   │   └── server.ts     # Express server
│   ├── package.json
│   └── tsconfig.json
│
├── docs/                 # Documentation
├── .env.example          # Environment variables template
├── README.md
├── DEVELOPMENT_PLAN.md
├── ARCHITECTURE.md
└── GETTING_STARTED.md    # This file
```

## Stage 1: MVP Setup

### Step 1: Set Up the Backend

```bash
# Create backend directory and initialize
mkdir backend
cd backend
npm init -y

# Install dependencies
npm install express cors dotenv axios
npm install -D typescript @types/node @types/express @types/cors ts-node nodemon

# Initialize TypeScript
npx tsc --init
```

**Create `backend/package.json` scripts:**
```json
{
  "scripts": {
    "dev": "nodemon --exec ts-node src/server.ts",
    "build": "tsc",
    "start": "node dist/server.js"
  }
}
```

**Create `backend/tsconfig.json`:**
```json
{
  "compilerOptions": {
    "target": "ES2020",
    "module": "commonjs",
    "outDir": "./dist",
    "rootDir": "./src",
    "strict": true,
    "esModuleInterop": true,
    "skipLibCheck": true,
    "forceConsistentCasingInFileNames": true
  },
  "include": ["src/**/*"],
  "exclude": ["node_modules"]
}
```

### Step 2: Set Up Environment Variables

Create `backend/.env`:
```env
PORT=3001
NODE_ENV=development

# API Keys
OPENAI_API_KEY=your_openai_api_key_here
ANTHROPIC_API_KEY=your_anthropic_api_key_here

# CORS (for local development)
FRONTEND_URL=http://localhost:5173

# Rate Limiting
RATE_LIMIT_WINDOW_MS=60000
RATE_LIMIT_MAX_REQUESTS=10
```

### Step 3: Create Backend Structure

```bash
cd backend
mkdir -p src/{routes,controllers,services,adapters,utils,config}
touch src/{server.ts,config/env.ts}
```

**Create `backend/src/server.ts`:**
```typescript
import express from 'express';
import cors from 'cors';
import dotenv from 'dotenv';
import queryRoutes from './routes/query';

dotenv.config();

const app = express();
const PORT = process.env.PORT || 3001;

// Middleware
app.use(cors({
  origin: process.env.FRONTEND_URL || 'http://localhost:5173'
}));
app.use(express.json());

// Routes
app.use('/api', queryRoutes);

// Health check
app.get('/api/health', (req, res) => {
  res.json({ status: 'ok', timestamp: new Date().toISOString() });
});

// Start server
app.listen(PORT, () => {
  console.log(`🚀 TriLLM Backend running on http://localhost:${PORT}`);
});
```

### Step 4: Set Up the Frontend

```bash
# Go back to root directory
cd ..

# Create React app with Vite
npm create vite@latest frontend -- --template react-ts
cd frontend

# Install dependencies
npm install
npm install axios react-router-dom zustand
npm install -D tailwindcss postcss autoprefixer
npx tailwindcss init -p
```

**Configure Tailwind CSS in `frontend/tailwind.config.js`:**
```javascript
/** @type {import('tailwindcss').Config} */
export default {
  content: [
    "./index.html",
    "./src/**/*.{js,ts,jsx,tsx}",
  ],
  theme: {
    extend: {},
  },
  plugins: [],
}
```

**Update `frontend/src/index.css`:**
```css
@tailwind base;
@tailwind components;
@tailwind utilities;
```

**Create `frontend/.env`:**
```env
VITE_API_URL=http://localhost:3001/api
```

### Step 5: Run the Development Servers

Open two terminal windows:

**Terminal 1 - Backend:**
```bash
cd backend
npm run dev
```

**Terminal 2 - Frontend:**
```bash
cd frontend
npm run dev
```

Frontend: http://localhost:5173
Backend: http://localhost:3001

## Stage 1: Implementation Checklist

### Backend Tasks
- [ ] Set up Express server with TypeScript
- [ ] Create LLM adapter interfaces
- [ ] Implement OpenAI adapter
- [ ] Implement Anthropic adapter
- [ ] Create query endpoint (`POST /api/query`)
- [ ] Add error handling middleware
- [ ] Implement basic rate limiting
- [ ] Add request validation
- [ ] Create simple ranking algorithm
- [ ] Add logging

### Frontend Tasks
- [ ] Set up React with Vite and TypeScript
- [ ] Configure Tailwind CSS
- [ ] Create landing page layout
- [ ] Build question input component
- [ ] Create loading state component
- [ ] Build response display component
- [ ] Implement API client (Axios)
- [ ] Add error handling
- [ ] Make responsive design
- [ ] Add basic animations

### Integration Tasks
- [ ] Test end-to-end flow
- [ ] Handle CORS properly
- [ ] Test error scenarios
- [ ] Optimize response times
- [ ] Add basic analytics (console logs)

### Deployment Tasks
- [ ] Deploy backend to Railway
- [ ] Deploy frontend to Vercel
- [ ] Configure environment variables
- [ ] Test production deployment
- [ ] Update portfolio website
- [ ] Add TriLLM button to portfolio

## Development Workflow

### 1. Making Changes

```bash
# Create a feature branch
git checkout -b feature/your-feature-name

# Make your changes
# ...

# Commit with descriptive message
git add .
git commit -m "feat: add your feature description"

# Push to GitHub
git push origin feature/your-feature-name
```

### 2. Testing Locally

**Test Backend Endpoint:**
```bash
curl -X POST http://localhost:3001/api/query \
  -H "Content-Type: application/json" \
  -d '{"question": "What is the capital of France?"}'
```

**Test Frontend:**
- Open http://localhost:5173
- Enter a question
- Check browser console for errors
- Verify responses display correctly

### 3. Debugging

**Backend Logs:**
```bash
# In backend terminal, you'll see console.log output
# Check for error stack traces
```

**Frontend Logs:**
- Open browser DevTools (F12)
- Check Console tab for errors
- Check Network tab for API requests

## Common Issues & Solutions

### Issue: CORS Error

**Error:** `Access to fetch blocked by CORS policy`

**Solution:**
1. Ensure backend CORS is configured correctly
2. Check `FRONTEND_URL` in backend `.env`
3. Restart backend server

### Issue: API Key Invalid

**Error:** `401 Unauthorized` or `Invalid API key`

**Solution:**
1. Verify API keys in `.env` are correct
2. Check no extra spaces in API keys
3. Ensure `.env` file is in `backend/` directory
4. Restart backend server after changing `.env`

### Issue: Module Not Found

**Error:** `Cannot find module 'xyz'`

**Solution:**
```bash
# Delete node_modules and reinstall
rm -rf node_modules package-lock.json
npm install
```

### Issue: Port Already in Use

**Error:** `Port 3001 is already in use`

**Solution:**
```bash
# Find and kill process using port
# macOS/Linux:
lsof -ti:3001 | xargs kill

# Windows:
netstat -ano | findstr :3001
taskkill /PID <PID> /F

# Or change PORT in .env
```

## API Documentation

### POST /api/query

Submit a question to be answered by LLMs.

**Request:**
```json
{
  "question": "What is the capital of France?"
}
```

**Response:**
```json
{
  "queryId": "uuid-here",
  "question": "What is the capital of France?",
  "responses": [
    {
      "provider": "openai",
      "answer": "The capital of France is Paris...",
      "score": 95,
      "responseTime": 1200,
      "isBest": true
    },
    {
      "provider": "anthropic",
      "answer": "Paris is the capital of France...",
      "score": 92,
      "responseTime": 1100,
      "isBest": false
    }
  ],
  "bestAnswer": {
    "provider": "openai",
    "answer": "The capital of France is Paris..."
  },
  "timestamp": "2024-01-15T10:30:00Z"
}
```

### GET /api/health

Check if the API is running.

**Response:**
```json
{
  "status": "ok",
  "timestamp": "2024-01-15T10:30:00Z"
}
```

## Environment Variables Reference

### Backend

| Variable | Description | Required | Default |
|----------|-------------|----------|---------|
| `PORT` | Server port | No | 3001 |
| `NODE_ENV` | Environment | No | development |
| `OPENAI_API_KEY` | OpenAI API key | Yes | - |
| `ANTHROPIC_API_KEY` | Anthropic API key | Yes | - |
| `FRONTEND_URL` | Frontend URL for CORS | No | http://localhost:5173 |
| `RATE_LIMIT_WINDOW_MS` | Rate limit window (ms) | No | 60000 |
| `RATE_LIMIT_MAX_REQUESTS` | Max requests per window | No | 10 |

### Frontend

| Variable | Description | Required | Default |
|----------|-------------|----------|---------|
| `VITE_API_URL` | Backend API URL | Yes | - |

## Next Steps

Once Stage 1 is complete:
1. ✅ Deploy to production
2. ✅ Integrate with portfolio website
3. ✅ Gather user feedback
4. 📋 Move to Stage 2: Enhanced capabilities

Check [DEVELOPMENT_PLAN.md](./DEVELOPMENT_PLAN.md) for Stage 2 features!

## Resources

- [React Documentation](https://react.dev/)
- [Vite Documentation](https://vitejs.dev/)
- [Express.js Guide](https://expressjs.com/)
- [Tailwind CSS Docs](https://tailwindcss.com/)
- [OpenAI API Reference](https://platform.openai.com/docs/api-reference)
- [Anthropic API Reference](https://docs.anthropic.com/)

## Need Help?

- Check existing issues on GitHub
- Review [ARCHITECTURE.md](./ARCHITECTURE.md) for system design
- Refer to [DEVELOPMENT_PLAN.md](./DEVELOPMENT_PLAN.md) for roadmap

---

Happy coding! 🚀
