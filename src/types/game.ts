export type QuestionType = 
  | 'multiple_choice' 
  | 'true_false' 
  | 'fill_blank' 
  | 'classify' 
  | 'find_error';

export type QuestionLevel = 'easy' | 'medium' | 'hard';

export interface BaseQuestion {
  id: number;
  level: QuestionLevel;
  type: QuestionType;
  prompt: string;
  contextText?: string; // Đoạn văn hoặc câu trích dẫn
  explanation: string; // Giải thích chi tiết vì sao đúng, vì sao sai
  points: number;
}

export interface MultipleChoiceQuestion extends BaseQuestion {
  type: 'multiple_choice';
  options: {
    id: string;
    text: string;
  }[];
  correctAnswerId: string;
}

export interface TrueFalseQuestion extends BaseQuestion {
  type: 'true_false';
  statement: string;
  isCorrect: boolean;
  notes?: string;
}

export interface FillBlankQuestion extends BaseQuestion {
  type: 'fill_blank';
  sentenceWithBlank: string; // "Hôm nay là ngày [...] của hội đồng."
  blankOptions: string[];
  correctAnswer: string;
}

export interface ClassifyQuestion extends BaseQuestion {
  type: 'classify';
  categories: {
    id: string;
    label: string;
    description?: string;
  }[];
  items: {
    id: string;
    word: string;
    correctCategoryId: string;
    hint?: string;
  }[];
}

export interface FindErrorQuestion extends BaseQuestion {
  type: 'find_error';
  words: {
    id: string;
    word: string;
    isError: boolean;
  }[];
  correctionExplanation: string;
}

export type Question = 
  | MultipleChoiceQuestion 
  | TrueFalseQuestion 
  | FillBlankQuestion 
  | ClassifyQuestion 
  | FindErrorQuestion;

export interface Badge {
  id: string;
  title: string;
  description: string;
  icon: string;
  unlockedAt?: string;
}

export interface UserStats {
  xp: number;
  streak: number;
  maxStreak: number;
  correctCount: number;
  totalAnswered: number;
  completedLevels: Record<QuestionLevel, boolean>;
  unlockedBadges: string[];
}

export interface AppliedScenario {
  id: string;
  title: string;
  subtitle: string;
  icon: string;
  description: string;
  instructions: string;
  paragraphs: {
    id: string;
    textBefore: string;
    textAfter: string;
    targetSlotPlaceholder: string;
    options: string[];
    correctAnswer: string;
    explanation: string;
  }[];
}
