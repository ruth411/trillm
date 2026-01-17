import OpenAI from 'openai';
import { LLMAdapter } from '../types';

export class OpenAIService implements LLMAdapter {
  name: 'openai' = 'openai';
  private client: OpenAI;
  private apiKey: string;

  constructor(apiKey: string) {
    this.apiKey = apiKey;
    this.client = new OpenAI({
      apiKey: this.apiKey,
    });
  }

  isAvailable(): boolean {
    return !!this.apiKey && this.apiKey !== 'your_openai_api_key_here';
  }

  async query(prompt: string): Promise<{ answer: string; tokensUsed: number }> {
    try {
      const completion = await this.client.chat.completions.create({
        model: 'gpt-4o-mini', // Latest affordable GPT-4 model
        messages: [
          {
            role: 'system',
            content: 'You are a helpful AI assistant. Provide clear, accurate, and detailed answers with examples when appropriate.',
          },
          {
            role: 'user',
            content: prompt,
          },
        ],
        temperature: 0.7,
        max_tokens: 1000, // Increased for more detailed responses
      });

      const answer = completion.choices[0]?.message?.content || 'No response generated';
      const tokensUsed = completion.usage?.total_tokens || 0;

      return {
        answer,
        tokensUsed,
      };
    } catch (error: any) {
      console.error('[OpenAI Service Error]', error.message);
      throw new Error(`OpenAI API Error: ${error.message}`);
    }
  }
}
