export type LLMProvider = 'openai' | 'anthropic' | 'gemini';

export interface LLMResponse {
  provider: LLMProvider;
  answer: string;
  score: number;
  responseTime: number;
  isBest: boolean;
  error?: string;
}

export interface QueryRequest {
  question: string;
}

export interface QueryResponse {
  queryId: string;
  question: string;
  responses: LLMResponse[];
  bestAnswer: {
    provider: LLMProvider;
    answer: string;
  };
  timestamp: string;
}

export interface ApiError {
  message: string;
  code?: string;
  details?: unknown;
}
