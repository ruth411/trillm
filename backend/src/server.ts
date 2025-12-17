import express, { Express, Request, Response } from 'express';
import cors from 'cors';
import { config } from './config/env';
import { createQueryRouter } from './routes/query.routes';

const app: Express = express();

// Middleware
app.use(cors({
  origin: config.frontendUrl,
  methods: ['GET', 'POST'],
  credentials: true,
}));

app.use(express.json());
app.use(express.urlencoded({ extended: true }));

// Request logging
app.use((req, res, next) => {
  console.log(`${req.method} ${req.path}`);
  next();
});

// Health check
app.get('/api/health', (req: Request, res: Response) => {
  res.json({
    status: 'ok',
    timestamp: new Date().toISOString(),
    service: 'TriLLM Backend API',
  });
});

// API Routes
app.use('/api', createQueryRouter(config.openaiApiKey));

// 404 handler
app.use((req: Request, res: Response) => {
  res.status(404).json({
    error: 'Not Found',
    message: `Cannot ${req.method} ${req.path}`,
  });
});

// Error handler
app.use((err: any, req: Request, res: Response, next: any) => {
  console.error('[Server Error]', err);
  res.status(500).json({
    error: 'Internal Server Error',
    message: err.message,
  });
});

// Start server
const PORT = config.port;
app.listen(PORT, () => {
  console.log(`
╔═══════════════════════════════════════╗
║                                       ║
║   🚀 TriLLM Backend API               ║
║                                       ║
║   Port: ${PORT}                        ║
║   Environment: ${config.nodeEnv}         ║
║   Frontend: ${config.frontendUrl}     ║
║                                       ║
║   Health: http://localhost:${PORT}/api/health
║   Query: http://localhost:${PORT}/api/query
║                                       ║
╚═══════════════════════════════════════╝
  `);

  if (!config.openaiApiKey || config.openaiApiKey === 'your_openai_api_key_here') {
    console.error('❌ ERROR: OpenAI API key is not configured!');
    console.error('Please set OPENAI_API_KEY in your .env file');
  } else {
    console.log('✅ OpenAI configured');
  }
});

export default app;
