import { useState } from 'react';
import QuestionInput from './components/QuestionInput';
import LoadingState from './components/LoadingState';
import ResponseCard from './components/ResponseCard';
import ErrorState from './components/ErrorState';
import { api } from './services/api';
import type { QueryResponse, ApiError } from './types';

function App() {
  const [isLoading, setIsLoading] = useState(false);
  const [result, setResult] = useState<QueryResponse | null>(null);
  const [error, setError] = useState<string | null>(null);
  const [isNetworkError, setIsNetworkError] = useState(false);

  const handleQuestionSubmit = async (question: string) => {
    setIsLoading(true);
    setError(null);
    setResult(null);
    setIsNetworkError(false);

    try {
      const response = await api.query(question);
      setResult(response);
    } catch (err) {
      const apiError = err as ApiError;
      const errorMessage = apiError.message || 'Failed to get responses from AI models';

      // Detect network/connection errors (backend not deployed)
      const isNetwork =
        errorMessage.toLowerCase().includes('network') ||
        errorMessage.toLowerCase().includes('failed to fetch') ||
        errorMessage.toLowerCase().includes('connection') ||
        errorMessage.toLowerCase().includes('timeout') ||
        apiError.code === 'ERR_NETWORK' ||
        apiError.code === 'ERR_CONNECTION_REFUSED' ||
        apiError.code === 'ECONNREFUSED' ||
        apiError.code === 'ERR_BAD_REQUEST';

      setIsNetworkError(isNetwork);
      setError(errorMessage);
      console.error('Query error:', err);
    } finally {
      setIsLoading(false);
    }
  };

  const handleRetry = () => {
    if (result?.question) {
      handleQuestionSubmit(result.question);
    }
  };

  return (
    <div className="min-h-screen py-8 px-4">
      <div className="max-w-7xl mx-auto">
        {/* Header */}
        <header className="text-center mb-12 animate-fade-in">
          <h1 className="text-6xl font-bold mb-4">
            <span className="gradient-text">TriLLM</span>
          </h1>
          <p className="text-xl text-gray-600 mb-2">
            Triple LLM Intelligence
          </p>
          <p className="text-gray-500 max-w-2xl mx-auto">
            Ask your question once, get answers from ChatGPT, Claude, and Gemini.
            We'll show you the best response.
          </p>
        </header>

        {/* Question Input */}
        <div className="mb-12">
          <QuestionInput onSubmit={handleQuestionSubmit} isLoading={isLoading} />
        </div>

        {/* Loading State */}
        {isLoading && <LoadingState />}

        {/* Error State */}
        {error && !isLoading && (
          <ErrorState
            message={error}
            onRetry={result ? handleRetry : undefined}
            isNetworkError={isNetworkError}
          />
        )}

        {/* Results */}
        {result && !isLoading && !error && (
          <div className="space-y-8 animate-fade-in">
            {/* Question Display */}
            <div className="text-center">
              <h2 className="text-2xl font-semibold text-gray-800 mb-2">Your Question</h2>
              <p className="text-lg text-gray-600 italic">"{result.question}"</p>
            </div>

            {/* Best Answer Highlight */}
            <div className="card bg-gradient-to-r from-yellow-50 to-orange-50 border-2 border-yellow-300">
              <div className="flex items-center space-x-2 mb-3">
                <span className="text-2xl">🏆</span>
                <h3 className="text-xl font-bold text-gray-900">Best Answer</h3>
              </div>
              <p className="text-gray-700 whitespace-pre-wrap leading-relaxed">
                {result.bestAnswer.answer}
              </p>
              <div className="mt-4 pt-4 border-t border-yellow-200">
                <span className="text-sm font-medium text-gray-600">
                  Provided by: <span className="font-bold capitalize">{result.bestAnswer.provider}</span>
                </span>
              </div>
            </div>

            {/* All Responses */}
            <div>
              <h3 className="text-xl font-semibold text-gray-800 mb-4 text-center">
                All Responses
              </h3>
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                {result.responses.map((response, index) => (
                  <ResponseCard key={index} response={response} />
                ))}
              </div>
            </div>

            {/* Query Info */}
            <div className="text-center text-sm text-gray-500">
              <p>Query ID: {result.queryId}</p>
              <p>Timestamp: {new Date(result.timestamp).toLocaleString()}</p>
            </div>
          </div>
        )}

        {/* Footer */}
        {!result && !isLoading && !error && (
          <footer className="text-center mt-16 text-gray-500 text-sm">
            <p className="mb-2">Powered by OpenAI, Google, and Anthropic</p>
            <p>
              Created by{' '}
              <a
                href="https://ruthwikdovala.com"
                target="_blank"
                rel="noopener noreferrer"
                className="text-blue-600 hover:text-blue-800 font-medium"
              >
                Ruthwik Dovala
              </a>
            </p>
          </footer>
        )}
      </div>
    </div>
  );
}

export default App;
