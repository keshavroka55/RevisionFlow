export type Flashcard = {
  id: string;
  noteId: string;
  question: string;
  answer: string;
  hint: string | null;
  sortOrder: number;
  isAiGenerated: boolean;
};

export type MockTest = {
  id: string;
  noteId: string;
  title: string;
  totalQuestions: number;
  isAiGenerated: boolean;
  questions: MockTestQuestion[];
};

export type MockTestQuestion = {
  id: string;
  questionText: string;
  questionType: "MCQ" | "TRUE_FALSE";
  options: { id: string; text: string; isCorrect: boolean }[];
  explanation: string | null;
  sortOrder: number;
};

export type SubmitAnswer = {
  questionId: string;
  selectedOption: string;
};

export type TestResult = {
  score: number;
  correct: number;
  total: number;
  attempt: {
    id: string;
    score: number;
    correctAnswers: number;
    totalQuestions: number;
    completedAt: string;
    answers: { questionId: string; selectedOption: string; isCorrect: boolean }[];
  };
};