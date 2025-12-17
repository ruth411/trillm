import React from 'react';

interface ErrorStateProps {
  message: string;
  onRetry?: () => void;
}

const ErrorState: React.FC<ErrorStateProps> = ({ message, onRetry }) => {
  return (
    <div className="card border-red-200 bg-red-50 max-w-2xl mx-auto">
      <div className="flex flex-col items-center text-center space-y-4">
        {/* Error Icon */}
        <div className="w-16 h-16 bg-red-100 rounded-full flex items-center justify-center">
          <span className="text-4xl">⚠️</span>
        </div>

        {/* Error Message */}
        <div>
          <h3 className="text-lg font-semibold text-red-900 mb-2">Oops! Something went wrong</h3>
          <p className="text-sm text-red-700">{message}</p>
        </div>

        {/* Retry Button */}
        {onRetry && (
          <button
            onClick={onRetry}
            className="px-6 py-2 bg-red-600 text-white rounded-lg hover:bg-red-700 transition-colors duration-200 font-medium"
          >
            Try Again
          </button>
        )}

        {/* Help Text */}
        <p className="text-xs text-gray-600 mt-4">
          If the problem persists, please check your connection or try again later.
        </p>
      </div>
    </div>
  );
};

export default ErrorState;
