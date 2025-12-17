import React from 'react';
import type { LLMResponse } from '../types';

interface ResponseCardProps {
  response: LLMResponse;
}

const providerInfo = {
  openai: {
    name: 'ChatGPT',
    icon: '🤖',
    color: 'green',
    description: 'OpenAI GPT-4',
  },
  anthropic: {
    name: 'Claude',
    icon: '🧠',
    color: 'orange',
    description: 'Anthropic Claude',
  },
  gemini: {
    name: 'Gemini',
    icon: '💎',
    color: 'blue',
    description: 'Google Gemini',
  },
};

const ResponseCard: React.FC<ResponseCardProps> = ({ response }) => {
  const info = providerInfo[response.provider];
  const colorClasses = {
    green: {
      badge: 'llm-badge-openai',
      border: 'border-green-300',
      bg: 'bg-green-50',
      crown: 'text-yellow-500',
    },
    orange: {
      badge: 'llm-badge-anthropic',
      border: 'border-orange-300',
      bg: 'bg-orange-50',
      crown: 'text-yellow-500',
    },
    blue: {
      badge: 'llm-badge-gemini',
      border: 'border-blue-300',
      bg: 'bg-blue-50',
      crown: 'text-yellow-500',
    },
  };

  const colors = colorClasses[info.color as keyof typeof colorClasses];

  if (response.error) {
    return (
      <div className="card border-red-200 bg-red-50">
        <div className="flex items-center justify-between mb-3">
          <div className="flex items-center space-x-2">
            <span className="text-2xl">{info.icon}</span>
            <div>
              <h3 className="font-semibold text-gray-900">{info.name}</h3>
              <p className="text-xs text-gray-500">{info.description}</p>
            </div>
          </div>
          <span className="llm-badge bg-red-100 text-red-800">Error</span>
        </div>
        <p className="text-sm text-red-600">{response.error}</p>
      </div>
    );
  }

  return (
    <div
      className={`card relative transition-all duration-300 hover:shadow-xl ${
        response.isBest ? `${colors.border} border-2 ${colors.bg}` : ''
      }`}
    >
      {/* Best Answer Crown */}
      {response.isBest && (
        <div className="absolute -top-3 -right-3">
          <div className="bg-white rounded-full p-2 shadow-lg border-2 border-yellow-400">
            <span className="text-2xl">👑</span>
          </div>
        </div>
      )}

      {/* Header */}
      <div className="flex items-center justify-between mb-4">
        <div className="flex items-center space-x-3">
          <span className="text-3xl">{info.icon}</span>
          <div>
            <h3 className="font-semibold text-gray-900 flex items-center space-x-2">
              <span>{info.name}</span>
              {response.isBest && (
                <span className="text-xs bg-gradient-to-r from-yellow-400 to-orange-500 text-white px-2 py-1 rounded-full font-bold">
                  BEST
                </span>
              )}
            </h3>
            <p className="text-xs text-gray-500">{info.description}</p>
          </div>
        </div>

        <span className={`llm-badge ${colors.badge}`}>
          Score: {response.score}
        </span>
      </div>

      {/* Answer */}
      <div className="prose prose-sm max-w-none">
        <p className="text-gray-700 whitespace-pre-wrap leading-relaxed">
          {response.answer}
        </p>
      </div>

      {/* Footer */}
      <div className="flex items-center justify-between mt-4 pt-4 border-t border-gray-200">
        <span className="text-xs text-gray-500">
          Response time: {response.responseTime}ms
        </span>
        {response.isBest && (
          <span className="text-xs font-medium text-yellow-600 flex items-center space-x-1">
            <span>⭐</span>
            <span>Top Answer</span>
          </span>
        )}
      </div>
    </div>
  );
};

export default ResponseCard;
