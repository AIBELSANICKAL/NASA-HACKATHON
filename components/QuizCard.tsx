
import React from 'react';
import type { QuizQuestion } from '../types';

interface QuizCardProps {
  questionData: QuizQuestion;
  questionNumber: number;
  totalQuestions: number;
  onAnswerSelect: (answer: 'a' | 'b' | 'c' | 'd') => void;
  selectedAnswer: 'a' | 'b' | 'c' | 'd' | null;
  onNext: () => void;
  isLastQuestion: boolean;
}

const QuizCard: React.FC<QuizCardProps> = ({ 
  questionData, 
  questionNumber, 
  totalQuestions, 
  onAnswerSelect, 
  selectedAnswer, 
  onNext, 
  isLastQuestion 
}) => {
  return (
    <div className="w-full max-w-2xl mx-auto bg-gray-800/50 backdrop-blur-sm rounded-2xl shadow-2xl p-6 md:p-8 border border-gray-700">
      <div className="mb-6">
        <div className="flex justify-between items-center mb-2 text-gray-400">
          <span>Question {questionNumber} of {totalQuestions}</span>
        </div>
        <div className="w-full bg-gray-700 rounded-full h-2.5">
          <div 
            className="bg-blue-500 h-2.5 rounded-full transition-all duration-500" 
            style={{ width: `${(questionNumber / totalQuestions) * 100}%` }}
          ></div>
        </div>
      </div>
      
      <h2 className="text-2xl font-semibold mb-6 text-gray-100">{questionData.question}</h2>
      
      <div className="space-y-4">
        {Object.entries(questionData.options).map(([key, value]) => {
          const optionKey = key as 'a' | 'b' | 'c' | 'd';
          const isSelected = selectedAnswer === optionKey;
          return (
            <button
              key={key}
              onClick={() => onAnswerSelect(optionKey)}
              className={`w-full text-left p-4 rounded-lg border-2 transition-all duration-200 text-lg
                ${isSelected 
                  ? 'bg-blue-500/30 border-blue-400 text-white font-semibold shadow-lg' 
                  : 'bg-gray-700/50 border-gray-600 hover:bg-gray-700/80 hover:border-gray-500 text-gray-300'
                }`}
            >
              <span className="font-bold mr-3">{key.toUpperCase()}.</span>{value}
            </button>
          );
        })}
      </div>
      
      <div className="mt-8 text-right">
        <button
          onClick={onNext}
          disabled={!selectedAnswer}
          className="px-8 py-3 bg-blue-600 text-white font-bold rounded-lg transition-all duration-300
            disabled:bg-gray-600 disabled:cursor-not-allowed
            hover:bg-blue-700 transform hover:scale-105
            focus:outline-none focus:ring-4 focus:ring-blue-500/50"
        >
          {isLastQuestion ? 'Submit Answers' : 'Next Question'}
        </button>
      </div>
    </div>
  );
};

export default QuizCard;
