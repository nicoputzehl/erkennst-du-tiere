import { normalizeString } from "@/utils/helper";
import { Question, QuestionStatus, QuizMode, QuizQuestion, QuizState } from "../types";
import { ContentKey } from "@/src/core/content/types";

/**
 * Erstellt einen neuen Quiz-Zustand mit den gegebenen Fragen
 */
const createQuizState = <T extends ContentKey = ContentKey>(
  questions: Question<T>[], 
  id: string, 
  title: string = "Generic Quiz",
  quizMode: QuizMode = QuizMode.SEQUENTIAL,
  initialUnlockedQuestions: number = 2
): QuizState<T> => {
  
  // Status für jede Frage bestimmen, abhängig vom Quiz-Modus
  const questionStatus = questions.map((_, index) => {
    // Bei ALL_UNLOCKED sind alle Fragen von Anfang an aktiviert
    if (quizMode === QuizMode.ALL_UNLOCKED) {
      return QuestionStatus.ACTIVE;
    }
    
    // Bei SEQUENTIAL sind nur die ersten X Fragen aktiv
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
};

/**
 * Prüft, ob eine Antwort für eine Textfrage korrekt ist
 */
const isTextAnswerCorrect = <T extends ContentKey = ContentKey>(
  question: QuizQuestion<T>,
  answer: string
): boolean => {
  const normalizedAnswer = normalizeString(answer);
  return normalizedAnswer === normalizeString(question.answer) ||
    !!question.alternativeAnswers?.some(alt => normalizeString(alt) === normalizedAnswer);
};

/**
 * Verarbeitet eine Antwort und berechnet den neuen Zustand
 */
const calculateAnswerResult = <T extends ContentKey = ContentKey>(
  state: QuizState<T>,
  questionId: number,
  answer: string
): { newState: QuizState<T>; isCorrect: boolean } => {
  const questionIndex = state.questions.findIndex(q => q.id === questionId);
  if (questionIndex === -1) {
    throw new Error(`Frage mit ID ${questionId} nicht gefunden`);
  }

  const question = state.questions[questionIndex];
  
  // Prüfe, ob die Antwort korrekt ist
  const isCorrect = isTextAnswerCorrect(question, answer);

  // Bei falscher Antwort unveränderten Zustand zurückgeben
  if (!isCorrect) {
    return { newState: state, isCorrect };
  }

  // Nur bei richtiger Antwort neuen Zustand erstellen
  const newQuestions = state.questions.map((q, index) => {
    if (index === questionIndex) {
      return { ...q, status: QuestionStatus.SOLVED, isCorrect: true };
    }
    return q;
  });

  // Nächste inaktive Frage aktivieren, aber nur im SEQUENTIAL Modus
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
};

/**
 * Findet die ID der nächsten nicht gelösten Frage in der Reihenfolge der IDs
 */
const getNextActiveQuestionId = <T extends ContentKey = ContentKey>(
  state: QuizState<T>, 
  currentQuestionId?: number
): number | null => {
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
};

/**
 * Prüft ob ein Quiz vollständig beantwortet wurde
 */
const isCompleted = <T extends ContentKey = ContentKey>(state: QuizState<T>): boolean => {
  return state.completedQuestions === state.questions.length;
};

export {
  createQuizState,
  calculateAnswerResult,
  getNextActiveQuestionId,
  isCompleted,
  isTextAnswerCorrect
};