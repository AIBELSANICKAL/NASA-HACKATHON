
import React, { useState, useCallback } from 'react';
import { generateNasaQuiz } from './services/geminiService';
import type { QuizQuestion, UserAnswers, QuizState } from './types';
import LoadingSpinner from './components/LoadingSpinner';
import QuizCard from './components/QuizCard';
import ResultsScreen from './components/ResultsScreen';

const App: React.FC = () => {
  const [quizData, setQuizData] = useState<QuizQuestion[] | null>(null);
  const [userAnswers, setUserAnswers] = useState<UserAnswers>({});
  const [currentQuestionIndex, setCurrentQuestionIndex] = useState<number>(0);
  const [score, setScore] = useState<number>(0);
  const [quizState, setQuizState] = useState<QuizState>('idle');
  const [error, setError] = useState<string | null>(null);

  const fetchQuiz = useCallback(async () => {
    setQuizState('loading');
    setError(null);
    try {
      const data = await generateNasaQuiz();
      setQuizData(data);
      setQuizState('active');
    } catch (err) {
      setError(err instanceof Error ? err.message : 'An unknown error occurred.');
      setQuizState('idle');
    }
  }, []);
  
  const handleAnswerSelect = (answer: 'a' | 'b' | 'c' | 'd') => {
    setUserAnswers(prev => ({
      ...prev,
      [currentQuestionIndex]: answer,
    }));
  };

  const handleNextQuestion = () => {
    if (quizData && currentQuestionIndex < quizData.length - 1) {
      setCurrentQuestionIndex(prev => prev + 1);
    } else {
      // This is the submit action
      calculateScore();
      setQuizState('finished');
    }
  };

  const calculateScore = () => {
    if (!quizData) return;
    let newScore = 0;
    quizData.forEach((question, index) => {
      if (question.correctAnswer === userAnswers[index]) {
        newScore++;
      }
    });
    setScore(newScore);
  };

  const handleRestart = () => {
    setQuizData(null);
    setUserAnswers({});
    setCurrentQuestionIndex(0);
    setScore(0);
    setQuizState('idle');
    setError(null);
  };
  
  const renderContent = () => {
    switch (quizState) {
      case 'loading':
        return <LoadingSpinner />;
      case 'active':
        if (!quizData) return null;
        return (
          <QuizCard
            questionData={quizData[currentQuestionIndex]}
            questionNumber={currentQuestionIndex + 1}
            totalQuestions={quizData.length}
            onAnswerSelect={handleAnswerSelect}
            selectedAnswer={userAnswers[currentQuestionIndex] || null}
            onNext={handleNextQuestion}
            isLastQuestion={currentQuestionIndex === quizData.length - 1}
          />
        );
      case 'finished':
        if (!quizData) return null;
        return (
          <ResultsScreen
            score={score}
            totalQuestions={quizData.length}
            quizData={quizData}
            userAnswers={userAnswers}
            onRestart={handleRestart}
          />
        );
      case 'idle':
      default:
        return (
          <div className="text-center bg-gray-800/50 backdrop-blur-sm p-10 rounded-2xl border border-gray-700 shadow-2xl">
            <h1 className="text-5xl font-extrabold mb-4 text-transparent bg-clip-text bg-gradient-to-r from-blue-400 to-teal-300">
              NASA Earth Observation Quiz
            </h1>
            <p className="text-gray-300 text-lg mb-8 max-w-2xl mx-auto">
              Test your knowledge on satellites, natural hazards, and how NASA monitors our changing planet. A new set of 20 questions is generated every time!
            </p>
            {error && <p className="text-red-400 bg-red-900/50 p-3 rounded-lg mb-6">{error}</p>}
            <button
              onClick={fetchQuiz}
              className="px-10 py-5 bg-blue-600 text-white font-bold text-xl rounded-lg hover:bg-blue-700 transition-all duration-300 transform hover:scale-105 focus:outline-none focus:ring-4 focus:ring-blue-500/50"
            >
              Generate Quiz
            </button>
          </div>
        );
    }
  };

  return (
    <main className="min-h-screen w-full bg-gradient-to-b from-gray-900 via-blue-900/40 to-gray-900 flex items-center justify-center p-4">
      <div className="container mx-auto">
        {renderContent()}
      </div>
    </main>
  );
};

export default App;
