import { normalizeString } from '../../utils/helper';
import { ContentKey } from '../common/utils';
import { 
  Question, 
  QuestionStatus, 
  QuizMode, 
  QuizQuestion, 
  QuizState, 
  Quiz,
  QuizConfig,
  SimpleUnlockCondition 
} from './types';

// ====== QUIZ CREATION UTILITIES ======

export function createQuiz<T extends ContentKey = ContentKey>(
  config: QuizConfig<T>
): Quiz<T> {
  return {
    id: config.id,
    title: config.title,
    questions: config.questions,
    initiallyLocked: config.initiallyLocked ?? false,
    unlockCondition: config.unlockCondition,
    order: config.order ?? 1,
    quizMode: config.quizMode ?? QuizMode.SEQUENTIAL,
    initialUnlockedQuestions: config.initialUnlockedQuestions ?? 2,
  };
}

export function createUnlockCondition(
  requiredQuizId: string, 
  description?: string
): SimpleUnlockCondition {
  return {
    requiredQuizId,
    description: description || `Schließe das Quiz "${requiredQuizId}" ab, um dieses Quiz freizuschalten.`
  };
}

// ====== QUIZ STATE LOGIC ======

export function createQuizState<T extends ContentKey = ContentKey>(
  questions: Question<T>[], 
  id: string, 
  title: string = "Generic Quiz",
  quizMode: QuizMode = QuizMode.SEQUENTIAL,
  initialUnlockedQuestions: number = 2
): QuizState<T> {
  
  const questionStatus = questions.map((_, index) => {
    if (quizMode === QuizMode.ALL_UNLOCKED) {
      return QuestionStatus.ACTIVE;
    }
    return index < initialUnlockedQuestions ? 
      QuestionStatus.ACTIVE : 
      QuestionStatus.INACTIVE;
  });
  
  return {
    id,
    title,
    questions: questions.map((q, i) => ({
      ...q,
      status: questionStatus[i],
    })) as QuizQuestion<T>[],
    completedQuestions: 0,
    quizMode
  };
}

function isTextAnswerCorrect<T extends ContentKey = ContentKey>(
  question: QuizQuestion<T>,
  answer: string
): boolean {
  const normalizedAnswer = normalizeString(answer);
  return normalizedAnswer === normalizeString(question.answer) ||
    !!question.alternativeAnswers?.some(alt => normalizeString(alt) === normalizedAnswer);
}

export function calculateAnswerResult<T extends ContentKey = ContentKey>(
  state: QuizState<T>,
  questionId: number,
  answer: string
): { newState: QuizState<T>; isCorrect: boolean } {
  const questionIndex = state.questions.findIndex(q => q.id === questionId);
  if (questionIndex === -1) {
    throw new Error(`Frage mit ID ${questionId} nicht gefunden`);
  }

  const question = state.questions[questionIndex];
  const isCorrect = isTextAnswerCorrect(question, answer);

  if (!isCorrect) {
    return { newState: state, isCorrect };
  }

  const newQuestions = state.questions.map((q, index) => {
    if (index === questionIndex) {
      return { ...q, status: QuestionStatus.SOLVED, isCorrect: true };
    }
    return q;
  });

  if (!state.quizMode || state.quizMode === QuizMode.SEQUENTIAL) {
    const nextInactiveIndex = newQuestions.findIndex(q => q.status === QuestionStatus.INACTIVE);
    if (nextInactiveIndex !== -1) {
      newQuestions[nextInactiveIndex] = {
        ...newQuestions[nextInactiveIndex],
        status: QuestionStatus.ACTIVE
      };
    }
  }

  return {
    newState: {
      ...state,
      questions: newQuestions,
      completedQuestions: state.completedQuestions + 1
    },
    isCorrect
  };
}

export function getNextActiveQuestionId<T extends ContentKey = ContentKey>(
  state: QuizState<T>, 
  currentQuestionId?: number
): number | null {
  const sortedQuestions = [...state.questions].sort((a, b) => a.id - b.id);
  
  if (currentQuestionId !== undefined) {
    const currentIndex = sortedQuestions.findIndex(q => q.id === currentQuestionId);
    
    if (currentIndex !== -1) {
      for (let i = currentIndex + 1; i < sortedQuestions.length; i++) {
        if (sortedQuestions[i].status !== 'solved') {
          return sortedQuestions[i].id;
        }
      }
      
      for (let i = 0; i < currentIndex; i++) {
        if (sortedQuestions[i].status !== 'solved') {
          return sortedQuestions[i].id;
        }
      }
    }
  }
  
  const unsolvedQuestion = sortedQuestions.find(q => q.status !== 'solved');
  return unsolvedQuestion ? unsolvedQuestion.id : null;
}

export function isCompleted<T extends ContentKey = ContentKey>(state: QuizState<T>): boolean {
  return state.completedQuestions === state.questions.length;
}

// ====== UNLOCK LOGIC ======

export function checkSimpleUnlockCondition(
  condition: SimpleUnlockCondition,
  quizStates: Record<string, QuizState>
): { isMet: boolean; progress: number } {
  const requiredQuizState = quizStates[condition.requiredQuizId];
  const isRequiredQuizCompleted = requiredQuizState ? isCompleted(requiredQuizState) : false;
  
  return {
    isMet: isRequiredQuizCompleted,
    progress: isRequiredQuizCompleted ? 100 : 0
  };
}

export function canUnlockQuiz(
  quiz: Quiz,
  quizStates: Record<string, QuizState>
): boolean {
  if (!quiz.initiallyLocked || !quiz.unlockCondition) {
    return true;
  }
  
  const { isMet } = checkSimpleUnlockCondition(quiz.unlockCondition, quizStates);
  return isMet;
}