import React, { useState } from 'react';

interface QuestionInputProps {
  onSubmit: (question: string) => void;
  isLoading: boolean;
}

const sampleQuestions = [
  "What is the capital of France?",
  "Explain quantum computing in simple terms",
  "Write a Python function to reverse a string",
  "What are the benefits of meditation?",
  "How does blockchain technology work?",
];

const QuestionInput: React.FC<QuestionInputProps> = ({ onSubmit, isLoading }) => {
  const [question, setQuestion] = useState('');

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (question.trim() && !isLoading) {
      onSubmit(question.trim());
    }
  };

  const handleSampleClick = (sample: string) => {
    setQuestion(sample);
  };

  return (
    <div className="w-full max-w-4xl mx-auto">
      {/* Input Form */}
      <form onSubmit={handleSubmit} className="card animate-fade-in">
        <div className="space-y-4">
          <div>
            <label htmlFor="question" className="block text-sm font-medium text-gray-700 mb-2">
              Ask your question
            </label>
            <textarea
              id="question"
              value={question}
              onChange={(e) => setQuestion(e.target.value)}
              placeholder="Type your question here... (e.g., What is the meaning of life?)"
              rows={4}
              className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent outline-none transition-all duration-200 resize-none"
              disabled={isLoading}
            />
          </div>

          <div className="flex items-center justify-between">
            <span className="text-xs text-gray-500">
              {question.length} / 1000 characters
            </span>
            <button
              type="submit"
              disabled={!question.trim() || isLoading}
              className={`px-6 py-3 rounded-lg font-semibold transition-all duration-200 flex items-center space-x-2 ${
                !question.trim() || isLoading
                  ? 'bg-gray-300 text-gray-500 cursor-not-allowed'
                  : 'bg-gradient-to-r from-blue-600 to-purple-600 text-white hover:from-blue-700 hover:to-purple-700 hover:shadow-lg transform hover:scale-105'
              }`}
            >
              <span>{isLoading ? 'Searching...' : 'Ask TriLLM'}</span>
              {!isLoading && <span>✨</span>}
            </button>
          </div>
        </div>
      </form>

      {/* Sample Questions */}
      {!isLoading && (
        <div className="mt-6">
          <p className="text-sm font-medium text-gray-700 mb-3">Try these sample questions:</p>
          <div className="flex flex-wrap gap-2">
            {sampleQuestions.map((sample, index) => (
              <button
                key={index}
                onClick={() => handleSampleClick(sample)}
                className="px-4 py-2 bg-white border border-gray-300 rounded-full text-sm text-gray-700 hover:bg-blue-50 hover:border-blue-300 transition-all duration-200 hover:shadow-md"
              >
                {sample}
              </button>
            ))}
          </div>
        </div>
      )}
    </div>
  );
};

export default QuestionInput;
