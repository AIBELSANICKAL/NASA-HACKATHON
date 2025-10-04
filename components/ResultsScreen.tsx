
import React from 'react';
import type { QuizQuestion, UserAnswers } from '../types';

interface ResultsScreenProps {
  score: number;
  totalQuestions: number;
  quizData: QuizQuestion[];
  userAnswers: UserAnswers;
  onRestart: () => void;
}

const ResultsScreen: React.FC<ResultsScreenProps> = ({ score, totalQuestions, quizData, userAnswers, onRestart }) => {
  const scorePercentage = Math.round((score / totalQuestions) * 100);

  const getResultColor = (percentage: number) => {
    if (percentage >= 80) return 'text-green-400';
    if (percentage >= 50) return 'text-yellow-400';
    return 'text-red-400';
  };

  return (
    <div className="w-full max-w-4xl mx-auto p-4 md:p-8">
      <div className="bg-gray-800/50 backdrop-blur-sm rounded-2xl shadow-2xl p-8 text-center border border-gray-700">
        <h2 className="text-4xl font-bold text-transparent bg-clip-text bg-gradient-to-r from-blue-400 to-teal-300 mb-2">Quiz Complete!</h2>
        <p className="text-gray-300 mb-6">Here's how you did:</p>
        <div className="mb-8">
          <p className={`text-7xl font-bold ${getResultColor(scorePercentage)}`}>{scorePercentage}%</p>
          <p className="text-xl text-gray-400 mt-2">You answered {score} out of {totalQuestions} questions correctly.</p>
        </div>
        
        <div className="text-left my-8 max-h-[40vh] overflow-y-auto pr-4">
          <h3 className="text-2xl font-semibold mb-4 text-gray-200">Review Your Answers</h3>
          {quizData.map((question, index) => {
            const userAnswer = userAnswers[index];
            const correctAnswer = question.correctAnswer;
            const isCorrect = userAnswer === correctAnswer;
            return (
              <div key={index} className="mb-6 p-4 bg-gray-900/70 rounded-lg border border-gray-700">
                <p className="font-semibold text-lg text-gray-100">{index + 1}. {question.question}</p>
                <div className="mt-3 space-y-2">
                  {Object.entries(question.options).map(([key, value]) => {
                    const optionKey = key as 'a' | 'b' | 'c' | 'd';
                    let optionClass = 'text-gray-300';
                    if (optionKey === correctAnswer) {
                      optionClass = 'text-green-400 font-bold';
                    }
                    if (optionKey === userAnswer && !isCorrect) {
                      optionClass = 'text-red-400 line-through';
                    }
                    return (
                      <p key={key} className={`pl-4 ${optionClass}`}>
                        {key.toUpperCase()}. {value}
                      </p>
                    );
                  })}
                </div>
              </div>
            );
          })}
        </div>
        
        <button
          onClick={onRestart}
          className="mt-6 w-full md:w-auto px-8 py-4 bg-blue-600 text-white font-bold rounded-lg hover:bg-blue-700 transition-all duration-300 transform hover:scale-105 focus:outline-none focus:ring-4 focus:ring-blue-500/50"
        >
          Generate New Quiz
        </button>
      </div>
    </div>
  );
};

export default ResultsScreen;
