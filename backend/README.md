# TriLLM Backend API

Node.js/Express backend for TriLLM - Queries multiple LLMs and returns the best answer.

## Tech Stack

- **Node.js** + **Express** + **TypeScript**
- **OpenAI API** (GPT-3.5-turbo)
- **CORS** enabled for frontend
- **UUID** for query tracking

## Getting Started

### Prerequisites

- Node.js 18+
- OpenAI API key

### Installation

```bash
npm install
```

### Environment Setup

Create `.env` file:

```env
PORT=3001
NODE_ENV=development
OPENAI_API_KEY=your_api_key_here
FRONTEND_URL=http://localhost:5173
```

### Development

```bash
npm run dev
```

### Production Build

```bash
npm run build
npm start
```

## API Endpoints

### Health Check

```
GET /api/health
```

Response:
```json
{
  "status": "ok",
  "timestamp": "2024-01-15T10:30:00Z",
  "service": "TriLLM Backend API"
}
```

### Query LLMs

```
POST /api/query
```

Request:
```json
{
  "question": "What is the capital of France?"
}
```

Response:
```json
{
  "queryId": "uuid-here",
  "question": "What is the capital of France?",
  "responses": [
    {
      "provider": "openai",
      "answer": "The capital of France is Paris...",
      "score": 85,
      "responseTime": 1200,
      "isBest": true,
      "tokensUsed": 150
    }
  ],
  "bestAnswer": {
    "provider": "openai",
    "answer": "The capital of France is Paris..."
  },
  "timestamp": "2024-01-15T10:30:00Z"
}
```

## Project Structure

```
backend/
├── src/
│   ├── config/         # Configuration
│   ├── controllers/    # Request handlers
│   ├── routes/         # API routes
│   ├── services/       # LLM services
│   ├── types/          # TypeScript types
│   └── server.ts       # Main server file
├── dist/               # Compiled JavaScript
├── .env                # Environment variables
├── package.json
└── tsconfig.json
```

## Scoring Algorithm

Responses are scored based on:
- Length and detail (longer = more detailed)
- Structure (paragraphs, lists, code blocks)
- Completeness (examples, nuance)
- Maximum score: 100

## Deployment

Deploy to Railway, Render, or any Node.js hosting:

1. Set environment variables
2. Run `npm run build`
3. Run `npm start`

## License

MIT
