import {
  QuestionStatus,
  QuizQuestion,
  QuizState,
  Quiz,
  QuizConfig,
  UnlockCondition
} from './types';
import { isAnswerCorrect } from './utils/answerComparison';
import { normalizeString } from './utils/normalizeString';

/**
 * Erstellt eine Quiz-Konfiguration aus Quiz-Inhalt und Konfigurationsoptionen
 * Trennt sauber zwischen Inhalt (Quiz) und Konfiguration (QuizConfig)
 */
export const createQuizConfig = (
  quiz: Quiz,
  config: Partial<Omit<QuizConfig, keyof Quiz>> = {}
): QuizConfig => ({
  ...quiz,
  initiallyLocked: config.initiallyLocked ?? false,
  unlockCondition: config.unlockCondition,
  order: config.order ?? 1,
  initialUnlockedQuestions: config.initialUnlockedQuestions ?? 2,
});

/**
 * Extrahiert Quiz-Inhalt aus QuizConfig
 */
export const extractQuizContent = (config: QuizConfig): Quiz => ({
  id: config.id,
  title: config.title,
  questions: config.questions,
  titleImage: config.titleImage,
});

/**
 * Erstellt Unlock-Bedingung
 */
export const createUnlockCondition = (
  requiredQuizId: string,
  description?: string
): UnlockCondition => ({
  requiredQuizId,
  description: description || `Schließe das Quiz "${requiredQuizId}" ab, um dieses Quiz freizuschalten.`
});

/**
 * Berechnet initiale Fragen-Status basierend auf Quiz-Konfiguration
 */
export const calculateInitialQuestionStatus = (
  questionCount: number,
  initialUnlockedQuestions: number
): QuestionStatus[] => {
  return Array.from({ length: questionCount }, (_, index) => {
    return index < initialUnlockedQuestions ?
      QuestionStatus.ACTIVE :
      QuestionStatus.INACTIVE;
  });
};

/**
 * Erstellt Quiz-State aus Quiz-Inhalt und Konfiguration
 */
export const createQuizState = (
  quiz: Quiz,
  config: Pick<QuizConfig, 'initialUnlockedQuestions'> = {}
): QuizState => {
  const initialUnlockedQuestions = config.initialUnlockedQuestions || 2;

  const questionStatus = calculateInitialQuestionStatus(
    quiz.questions.length,
    initialUnlockedQuestions
  );

  return {
    id: quiz.id,
    title: quiz.title,
    questions: quiz.questions.map((q, i) => ({
      ...q,
      status: questionStatus[i],
    })) as QuizQuestion[],
    completedQuestions: 0,
  };
};

export const normalizeAnswer = (answer: string): string => {
  return normalizeString(answer);
};

export const findNextInactiveQuestionIndex = (questions: QuizQuestion[]): number => {
  return questions.findIndex(q => q.status === QuestionStatus.INACTIVE);
};

export const calculateNewQuestionsAfterCorrectAnswer = (
  questions: QuizQuestion[],
  questionIndex: number,
): QuizQuestion[] => {
  const newQuestions = questions.map((q, index) => {
    if (index === questionIndex) {
      return { ...q, status: QuestionStatus.SOLVED };
    }
    return q;
  });


  const nextInactiveIndex = findNextInactiveQuestionIndex(newQuestions);
  if (nextInactiveIndex !== -1) {
    newQuestions[nextInactiveIndex] = {
      ...newQuestions[nextInactiveIndex],
      status: QuestionStatus.ACTIVE
    };

  }

  return newQuestions;
};

export const calculateAnswerResult = (
  state: QuizState,
  questionId: number,
  answer: string
): { newState: QuizState; isCorrect: boolean } => {
  const questionIndex = state.questions.findIndex(q => q.id === questionId);
  if (questionIndex === -1) {
    throw new Error(`Frage mit ID ${questionId} nicht gefunden`);
  }

  const question = state.questions[questionIndex];
  const isCorrect = isAnswerCorrect(answer, question.answer, question.alternativeAnswers);

  if (!isCorrect) {
    return { newState: state, isCorrect };
  }

  const newQuestions = calculateNewQuestionsAfterCorrectAnswer(
    state.questions,
    questionIndex,
  );

  return {
    newState: {
      ...state,
      questions: newQuestions,
      completedQuestions: state.completedQuestions + 1
    },
    isCorrect
  };
};

export const sortQuestionsByIds = (questions: QuizQuestion[]): QuizQuestion[] => {
  return [...questions].sort((a, b) => a.id - b.id);
};

export const findNextUnsolvedQuestionForward = (
  sortedQuestions: QuizQuestion[],
  currentIndex: number
): QuizQuestion | null => {
  for (let i = currentIndex + 1; i < sortedQuestions.length; i++) {
    if (sortedQuestions[i].status !== 'solved') {
      return sortedQuestions[i];
    }
  }
  return null;
};

export const findNextUnsolvedQuestionBackward = (
  sortedQuestions: QuizQuestion[],
  currentIndex: number
): QuizQuestion | null => {
  for (let i = 0; i < currentIndex; i++) {
    if (sortedQuestions[i].status !== 'solved') {
      return sortedQuestions[i];
    }
  }
  return null;
};

export const findFirstUnsolvedQuestion = (questions: QuizQuestion[]): QuizQuestion | null => {
  return questions.find(q => q.status !== 'solved') || null;
};

export const getNextActiveQuestionId = (
  state: QuizState,
  currentQuestionId?: number
): number | null => {
  const sortedQuestions = sortQuestionsByIds(state.questions);

  if (currentQuestionId !== undefined) {
    const currentIndex = sortedQuestions.findIndex(q => q.id === currentQuestionId);

    if (currentIndex !== -1) {
      // Suche vorwärts
      const nextForward = findNextUnsolvedQuestionForward(sortedQuestions, currentIndex);
      if (nextForward) return nextForward.id;

      // Suche rückwärts
      const nextBackward = findNextUnsolvedQuestionBackward(sortedQuestions, currentIndex);
      if (nextBackward) return nextBackward.id;
    }
  }

  // Finde erste ungelöste Frage
  const firstUnsolved = findFirstUnsolvedQuestion(sortedQuestions);
  return firstUnsolved ? firstUnsolved.id : null;
};

export const isCompleted = (state: QuizState): boolean => {
  return state.completedQuestions === state.questions.length;
};

export const checkUnlockCondition = (
  condition: UnlockCondition,
  quizStates: Record<string, QuizState>
): { isMet: boolean; progress: number } => {
  const requiredQuizState = quizStates[condition.requiredQuizId];
  const isRequiredQuizCompleted = requiredQuizState ? isCompleted(requiredQuizState) : false;

  return {
    isMet: isRequiredQuizCompleted,
    progress: isRequiredQuizCompleted ? 100 : 0
  };
};

export const canUnlockQuiz = (
  config: QuizConfig,
  quizStates: Record<string, QuizState>
): boolean => {
  if (!config.initiallyLocked || !config.unlockCondition) {
    return true;
  }

  const { isMet } = checkUnlockCondition(config.unlockCondition, quizStates);
  return isMet;
};

export const calculateQuizProgress = (state: QuizState): number => {
  if (!state.questions?.length) return 0;
  return Math.round((state.completedQuestions / state.questions.length) * 100);
};

export const createProgressString = (state: QuizState): string | null => {
  if (!state.questions?.length) return null;
  return `${state.completedQuestions}/${state.questions.length}`;
};