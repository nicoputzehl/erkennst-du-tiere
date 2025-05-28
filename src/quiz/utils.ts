import { normalizeString } from '../../utils/helper';
import { 
  Question, 
  QuestionStatus, 
  QuizMode, 
  QuizQuestion, 
  QuizState, 
  Quiz,
  QuizConfig,
  UnlockCondition 
} from './types';


/**
 * Erstellt eine Quiz-Konfiguration - reine Funktion ohne Seiteneffekte
 */
export const createQuiz = (config: QuizConfig): Quiz => ({
  id: config.id,
  title: config.title,
  questions: config.questions,
  initiallyLocked: config.initiallyLocked ?? false,
  unlockCondition: config.unlockCondition,
  order: config.order ?? 1,
  quizMode: config.quizMode ?? QuizMode.SEQUENTIAL,
  initialUnlockedQuestions: config.initialUnlockedQuestions ?? 2,
});


export const createUnlockCondition = (
  requiredQuizId: string, 
  description?: string
): UnlockCondition => ({
  requiredQuizId,
  description: description || `Schließe das Quiz "${requiredQuizId}" ab, um dieses Quiz freizuschalten.`
});

export const calculateInitialQuestionStatus = (
  questionCount: number,
  quizMode: QuizMode,
  initialUnlockedQuestions: number
): QuestionStatus[] => {
  return Array.from({ length: questionCount }, (_, index) => {
    if (quizMode === QuizMode.ALL_UNLOCKED) {
      return QuestionStatus.ACTIVE;
    }
    return index < initialUnlockedQuestions ? 
      QuestionStatus.ACTIVE : 
      QuestionStatus.INACTIVE;
  });
};


export const createQuizState = (
  questions: Question[], 
  id: string, 
  title: string = "Generic Quiz",
  quizMode: QuizMode = QuizMode.SEQUENTIAL,
  initialUnlockedQuestions: number = 2
): QuizState => {
  
  const questionStatus = calculateInitialQuestionStatus(
    questions.length, 
    quizMode, 
    initialUnlockedQuestions
  );
  
  return {
    id,
    title,
    questions: questions.map((q, i) => ({
      ...q,
      status: questionStatus[i],
    })) as QuizQuestion[],
    completedQuestions: 0,
    quizMode
  };
};

export const normalizeAnswer = (answer: string): string => {
  return normalizeString(answer);
};


export const isAnswerCorrect = (
  userAnswer: string,
  correctAnswer: string,
  alternativeAnswers?: string[]
): boolean => {
  const normalizedUserAnswer = normalizeAnswer(userAnswer);
  const normalizedCorrectAnswer = normalizeAnswer(correctAnswer);
  
  if (normalizedUserAnswer === normalizedCorrectAnswer) {
    return true;
  }
  
  if (alternativeAnswers && alternativeAnswers.length > 0) {
    return alternativeAnswers.some(alt => 
      normalizeAnswer(alt) === normalizedUserAnswer
    );
  }
  
  return false;
};


export const findNextInactiveQuestionIndex = (questions: QuizQuestion[]): number => {
  return questions.findIndex(q => q.status === QuestionStatus.INACTIVE);
};


export const calculateNewQuestionsAfterCorrectAnswer = (
  questions: QuizQuestion[],
  questionIndex: number,
  quizMode?: QuizMode
): QuizQuestion[] => {
  const newQuestions = questions.map((q, index) => {
    if (index === questionIndex) {
      return { ...q, status: QuestionStatus.SOLVED };
    }
    return q;
  });

  // Sequential Mode: Nächste Frage freischalten
  if (!quizMode || quizMode === QuizMode.SEQUENTIAL) {
    const nextInactiveIndex = findNextInactiveQuestionIndex(newQuestions);
    if (nextInactiveIndex !== -1) {
      newQuestions[nextInactiveIndex] = {
        ...newQuestions[nextInactiveIndex],
        status: QuestionStatus.ACTIVE
      };
    }
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
    state.quizMode
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
  quiz: Quiz,
  quizStates: Record<string, QuizState>
): boolean => {
  if (!quiz.initiallyLocked || !quiz.unlockCondition) {
    return true;
  }
  
  const { isMet } = checkUnlockCondition(quiz.unlockCondition, quizStates);
  return isMet;
};


export const calculateQuizProgress = (state: QuizState): number => {
  if (!state.questions?.length) return 0;
  return Math.round((state.completedQuestions / state.questions.length) * 100);
};

export const createProgressString = (state: QuizState): string | null => {
  if (!state.questions?.length) return null;
  return `${state.completedQuestions} von ${state.questions.length} gelöst`;
};
