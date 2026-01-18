import Anthropic from '@anthropic-ai/sdk';
import { LLMAdapter } from '../types';

export class ClaudeService implements LLMAdapter {
  name: 'anthropic' = 'anthropic';
  private client: Anthropic;
  private apiKey: string;

  constructor(apiKey: string) {
    this.apiKey = apiKey;
    this.client = new Anthropic({
      apiKey: this.apiKey,
    });
  }

  isAvailable(): boolean {
    return !!this.apiKey && this.apiKey !== 'your_anthropic_api_key_here';
  }

  async query(prompt: string): Promise<{ answer: string; tokensUsed: number }> {
    try {
      const message = await this.client.messages.create({
        model: 'claude-3-5-sonnet-20241022', // Latest Claude 3.5 Sonnet (most API keys have access)
        max_tokens: 2000, // Increased for detailed responses
        messages: [
          {
            role: 'user',
            content: prompt,
          },
        ],
      });

      const answer = message.content[0]?.type === 'text'
        ? message.content[0].text
        : 'No response generated';

      const tokensUsed = message.usage.input_tokens + message.usage.output_tokens;

      return {
        answer,
        tokensUsed,
      };
    } catch (error: any) {
      console.error('[Claude Service Error]', error.message);
      throw new Error(`Claude API Error: ${error.message}`);
    }
  }
}
