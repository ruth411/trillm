import { Request, Response } from 'express';
import { v4 as uuidv4 } from 'uuid';
import { OpenAIService } from '../services/openai.service';
import { LLMResponse, QueryResponse } from '../types';

export class QueryController {
  private openaiService: OpenAIService;

  constructor(openaiApiKey: string) {
    this.openaiService = new OpenAIService(openaiApiKey);
  }

  async handleQuery(req: Request, res: Response): Promise<void> {
    try {
      const { question } = req.body;

      // Validation
      if (!question || typeof question !== 'string') {
        res.status(400).json({ error: 'Question is required and must be a string' });
        return;
      }

      if (question.length > 1000) {
        res.status(400).json({ error: 'Question must be less than 1000 characters' });
        return;
      }

      if (question.trim().length === 0) {
        res.status(400).json({ error: 'Question cannot be empty' });
        return;
      }

      console.log(`[Query] Processing question: "${question.substring(0, 50)}..."`);

      // Query OpenAI
      const responses: LLMResponse[] = [];

      if (this.openaiService.isAvailable()) {
        const startTime = Date.now();
        try {
          const result = await this.openaiService.query(question);
          const responseTime = Date.now() - startTime;

          responses.push({
            provider: 'openai',
            answer: result.answer,
            score: this.calculateScore(result.answer),
            responseTime,
            isBest: false, // Will be updated later
            tokensUsed: result.tokensUsed,
          });

          console.log(`[OpenAI] Response received in ${responseTime}ms`);
        } catch (error: any) {
          console.error('[OpenAI] Error:', error.message);
          responses.push({
            provider: 'openai',
            answer: '',
            score: 0,
            responseTime: Date.now() - startTime,
            isBest: false,
            error: error.message,
          });
        }
      }

      // Determine best answer
      const bestResponse = this.getBestResponse(responses);
      if (bestResponse) {
        bestResponse.isBest = true;
      }

      // Prepare response
      const queryResponse: QueryResponse = {
        queryId: uuidv4(),
        question,
        responses,
        bestAnswer: bestResponse
          ? {
              provider: bestResponse.provider,
              answer: bestResponse.answer,
            }
          : {
              provider: 'openai',
              answer: 'No responses available',
            },
        timestamp: new Date().toISOString(),
      };

      res.json(queryResponse);
    } catch (error: any) {
      console.error('[Query Controller Error]', error);
      res.status(500).json({
        error: 'Internal server error',
        message: error.message,
      });
    }
  }

  private calculateScore(answer: string): number {
    // Simple scoring algorithm based on answer quality indicators
    let score = 50; // Base score

    // Length score (longer answers tend to be more detailed, up to a point)
    const length = answer.length;
    if (length > 100) score += 10;
    if (length > 300) score += 10;
    if (length > 500) score += 5;

    // Structure indicators
    if (answer.includes('\n\n')) score += 5; // Paragraphs
    if (answer.match(/\d+\./g)) score += 5; // Numbered lists
    if (answer.includes('•') || answer.includes('-')) score += 5; // Bullet points
    if (answer.includes('```')) score += 10; // Code blocks

    // Completeness indicators
    if (answer.toLowerCase().includes('however') || answer.toLowerCase().includes('although')) {
      score += 5; // Nuanced answer
    }
    if (answer.toLowerCase().includes('example')) score += 5; // Provides examples

    // Cap at 100
    return Math.min(score, 100);
  }

  private getBestResponse(responses: LLMResponse[]): LLMResponse | null {
    const validResponses = responses.filter((r) => !r.error && r.answer);

    if (validResponses.length === 0) {
      return null;
    }

    // Sort by score (descending) and return the best
    validResponses.sort((a, b) => b.score - a.score);
    return validResponses[0];
  }
}
