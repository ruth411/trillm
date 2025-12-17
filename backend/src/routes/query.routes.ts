import { Router } from 'express';
import { QueryController } from '../controllers/query.controller';

export function createQueryRouter(openaiApiKey: string): Router {
  const router = Router();
  const controller = new QueryController(openaiApiKey);

  // POST /api/query - Submit a question
  router.post('/query', (req, res) => controller.handleQuery(req, res));

  return router;
}
