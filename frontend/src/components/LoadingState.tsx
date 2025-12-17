import React from 'react';

interface LoadingStateProps {
  message?: string;
}

const LoadingState: React.FC<LoadingStateProps> = ({ message = 'Querying AI models...' }) => {
  return (
    <div className="flex flex-col items-center justify-center py-12 space-y-6">
      {/* Animated spinner */}
      <div className="relative w-24 h-24">
        <div className="absolute inset-0 border-4 border-blue-200 rounded-full"></div>
        <div className="absolute inset-0 border-4 border-t-blue-600 border-r-transparent border-b-transparent border-l-transparent rounded-full animate-spin"></div>
      </div>

      {/* Loading message */}
      <div className="text-center">
        <p className="text-lg font-medium text-gray-700">{message}</p>
        <p className="text-sm text-gray-500 mt-2">This may take a few seconds...</p>
      </div>

      {/* Animated dots for LLMs */}
      <div className="flex items-center space-x-4 mt-4">
        <div className="flex flex-col items-center space-y-2">
          <div className="w-12 h-12 bg-green-100 rounded-full flex items-center justify-center animate-pulse">
            <span className="text-xl">🤖</span>
          </div>
          <span className="text-xs text-gray-600 font-medium">ChatGPT</span>
        </div>

        <div className="flex flex-col items-center space-y-2 animation-delay-200">
          <div className="w-12 h-12 bg-orange-100 rounded-full flex items-center justify-center animate-pulse">
            <span className="text-xl">🧠</span>
          </div>
          <span className="text-xs text-gray-600 font-medium">Claude</span>
        </div>

        <div className="flex flex-col items-center space-y-2 animation-delay-400">
          <div className="w-12 h-12 bg-blue-100 rounded-full flex items-center justify-center animate-pulse">
            <span className="text-xl">💎</span>
          </div>
          <span className="text-xs text-gray-600 font-medium">Gemini</span>
        </div>
      </div>
    </div>
  );
};

export default LoadingState;
