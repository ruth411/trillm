import React from 'react';

interface ErrorStateProps {
  message: string;
  onRetry?: () => void;
  isNetworkError?: boolean;
}

const ErrorState: React.FC<ErrorStateProps> = ({ message, onRetry, isNetworkError }) => {
  if (isNetworkError) {
    return (
      <div className="card border-blue-500/20 bg-card max-w-2xl mx-auto">
        <div className="flex flex-col items-center text-center space-y-4">
          {/* Info Icon */}
          <div className="w-16 h-16 bg-blue-500/10 rounded-full flex items-center justify-center">
            <span className="text-4xl">🚧</span>
          </div>

          {/* Message */}
          <div>
            <h3 className="text-lg font-semibold text-foreground mb-2">Backend Coming Soon!</h3>
            <p className="text-sm text-muted mb-4">
              The AI backend is currently being deployed. The frontend is ready and looking great!
            </p>
            <div className="bg-background/50 rounded-lg p-4 text-left">
              <p className="text-xs text-muted mb-2">What's Ready:</p>
              <ul className="text-sm text-foreground space-y-1">
                <li>✅ Beautiful dark theme interface</li>
                <li>✅ Responsive design</li>
                <li>✅ Question input system</li>
                <li>🔄 Backend deployment in progress...</li>
              </ul>
            </div>
          </div>

          {/* Coming Soon Badge */}
          <div className="px-4 py-2 bg-gradient-to-r from-accent to-accent2 text-white rounded-full text-sm font-medium">
            🚀 AI Features Coming Soon
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="card border-red-500/20 bg-card max-w-2xl mx-auto">
      <div className="flex flex-col items-center text-center space-y-4">
        {/* Error Icon */}
        <div className="w-16 h-16 bg-red-500/10 rounded-full flex items-center justify-center">
          <span className="text-4xl">⚠️</span>
        </div>

        {/* Error Message */}
        <div>
          <h3 className="text-lg font-semibold text-foreground mb-2">Oops! Something went wrong</h3>
          <p className="text-sm text-muted">{message}</p>
        </div>

        {/* Retry Button */}
        {onRetry && (
          <button
            onClick={onRetry}
            className="px-6 py-2 bg-accent text-white rounded-lg hover:bg-accent/80 transition-colors duration-200 font-medium"
          >
            Try Again
          </button>
        )}

        {/* Help Text */}
        <p className="text-xs text-muted mt-4">
          If the problem persists, please check your connection or try again later.
        </p>
      </div>
    </div>
  );
};

export default ErrorState;
