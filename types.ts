
export interface QuizQuestion {
  question: string;
  options: {
    a: string;
    b: string;
    c: string;
    d: string;
  };
  correctAnswer: 'a' | 'b' | 'c' | 'd';
}

export type UserAnswers = {
  [key: number]: 'a' | 'b' | 'c' | 'd';
};

export type QuizState = 'idle' | 'loading' | 'active' | 'finished';
