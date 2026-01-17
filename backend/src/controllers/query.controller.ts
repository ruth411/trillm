import { Request, Response } from 'express';
import { v4 as uuidv4 } from 'uuid';
import { OpenAIService } from '../services/openai.service';
import { ClaudeService } from '../services/claude.service';
import { LLMResponse, QueryResponse } from '../types';

export class QueryController {
  private openaiService: OpenAIService;
  private claudeService: ClaudeService;

  constructor(openaiApiKey: string, anthropicApiKey: string) {
    this.openaiService = new OpenAIService(openaiApiKey);
    this.claudeService = new ClaudeService(anthropicApiKey);
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

      // Query all available LLMs in parallel
      const responses: LLMResponse[] = [];
      const promises: Promise<void>[] = [];

      // Query OpenAI
      if (this.openaiService.isAvailable()) {
        const promise = (async () => {
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
        })();
        promises.push(promise);
      }

      // Query Claude
      if (this.claudeService.isAvailable()) {
        const promise = (async () => {
          const startTime = Date.now();
          try {
            const result = await this.claudeService.query(question);
            const responseTime = Date.now() - startTime;

            responses.push({
              provider: 'anthropic',
              answer: result.answer,
              score: this.calculateScore(result.answer),
              responseTime,
              isBest: false, // Will be updated later
              tokensUsed: result.tokensUsed,
            });

            console.log(`[Claude] Response received in ${responseTime}ms`);
          } catch (error: any) {
            console.error('[Claude] Error:', error.message);
            responses.push({
              provider: 'anthropic',
              answer: '',
              score: 0,
              responseTime: Date.now() - startTime,
              isBest: false,
              error: error.message,
            });
          }
        })();
        promises.push(promise);
      }

      // Wait for all queries to complete
      await Promise.all(promises);

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
    // Stricter scoring algorithm based on answer quality indicators
    let score = 40; // Lower base score - must earn points

    const length = answer.length;
    const words = answer.split(/\s+/).length;

    // Length & Detail score (up to +30 points)
    if (length > 150) score += 5;  // At least some detail
    if (length > 300) score += 10; // Good detail
    if (length > 500) score += 10; // Comprehensive
    if (length > 800) score += 5;  // Very thorough

    // Word count quality
    if (words > 50) score += 5;   // Substantial content
    if (words > 100) score += 5;  // Detailed explanation

    // Structure indicators (up to +25 points)
    const hasMultipleParagraphs = (answer.match(/\n\n/g) || []).length >= 2;
    const hasNumberedList = /\d+\./g.test(answer);
    const hasBulletPoints = /[•\-]\s/g.test(answer);
    const hasCodeBlock = answer.includes('```');
    const hasHeaders = /^#{1,6}\s/m.test(answer);

    if (hasMultipleParagraphs) score += 8; // Well-organized
    if (hasNumberedList) score += 6;       // Structured points
    if (hasBulletPoints) score += 5;       // Clear formatting
    if (hasCodeBlock) score += 12;         // Technical examples
    if (hasHeaders) score += 4;            // Clear sections

    // Quality & Depth indicators (up to +30 points)
    const hasNuance = answer.toLowerCase().includes('however') ||
                      answer.toLowerCase().includes('although') ||
                      answer.toLowerCase().includes('while') ||
                      answer.toLowerCase().includes('whereas');
    const hasExamples = answer.toLowerCase().includes('example') ||
                        answer.toLowerCase().includes('for instance') ||
                        answer.toLowerCase().includes('such as');
    const hasComparison = answer.toLowerCase().includes('compared to') ||
                          answer.toLowerCase().includes('versus') ||
                          answer.toLowerCase().includes('unlike');
    const hasSteps = answer.toLowerCase().includes('first') ||
                     answer.toLowerCase().includes('step');
    const hasContext = answer.toLowerCase().includes('because') ||
                       answer.toLowerCase().includes('since') ||
                       answer.toLowerCase().includes('reason');

    if (hasNuance) score += 8;      // Thoughtful analysis
    if (hasExamples) score += 8;    // Concrete illustrations
    if (hasComparison) score += 6;  // Comparative analysis
    if (hasSteps) score += 4;       // Procedural clarity
    if (hasContext) score += 4;     // Explains why

    // Penalize poor quality indicators
    if (length < 50) score -= 15;   // Too brief
    if (words < 20) score -= 10;    // Insufficient content
    if (!answer.includes('.')) score -= 10; // No proper sentences

    // Bonus for exceptional answers
    const structureBonus = (hasMultipleParagraphs ? 1 : 0) +
                          (hasNumberedList ? 1 : 0) +
                          (hasCodeBlock ? 1 : 0);
    if (structureBonus >= 2) score += 5; // Well-structured overall

    const qualityBonus = (hasNuance ? 1 : 0) +
                         (hasExamples ? 1 : 0) +
                         (hasComparison ? 1 : 0);
    if (qualityBonus >= 2) score += 5; // High-quality content

    // Ensure score stays in valid range
    return Math.max(0, Math.min(score, 100));
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
