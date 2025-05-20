import { normalizeString } from "@/utils/helper";
import { MultipleChoiceQuestion, Question, QuestionStatus, QuestionType, QuizMode, QuizMultipleChoiceQuestion, QuizQuestion, QuizState } from "../types";

/**
 * Erstellt einen neuen Quiz-Zustand mit den gegebenen Fragen
 */
const createQuizState = <T = any>(
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
    quizMode // Speichern des Quiz-Modus im Zustand
  };
};
/**
 * Prüft, ob eine Antwort für eine Textfrage korrekt ist
 */
const isTextAnswerCorrect = <T = any>(
  question: QuizQuestion<T>,
  answer: string
): boolean => {
  const normalizedAnswer = normalizeString(answer);
  return normalizedAnswer === normalizeString(question.answer) ||
    !!question.alternativeAnswers?.some(alt => normalizeString(alt) === normalizedAnswer);
};

/**
 * Prüft, ob eine Antwort für eine Multiple-Choice-Frage korrekt ist
 * Bei Multiple-Choice vergleichen wir direkt den Wert ohne Normalisierung,
 * da die Antwort eine genaue Auswahl aus den vorgegebenen Optionen sein sollte
 */
const isMultipleChoiceAnswerCorrect = <T = any>(
  question: QuizQuestion<T> & MultipleChoiceQuestion<T>,
  answer: string
): boolean => {
  return answer === question.answer;
};

/**
 * Verarbeitet eine Antwort und berechnet den neuen Zustand
 */
const calculateAnswerResult = <T = any>(
  state: QuizState<T>,
  questionId: number,
  answer: string
): { newState: QuizState<T>; isCorrect: boolean } => {
  const questionIndex = state.questions.findIndex(q => q.id === questionId);
  if (questionIndex === -1) {
    throw new Error(`Frage mit ID ${questionId} nicht gefunden`);
  }

  const question = state.questions[questionIndex];
  
  // Prüfe je nach Fragetyp, ob die Antwort korrekt ist
  let isCorrect = false;
  if (question.questionType === QuestionType.MULTIPLE_CHOICE) {
    isCorrect = isMultipleChoiceAnswerCorrect(
      question as QuizQuestion<T> & MultipleChoiceQuestion<T>, 
      answer
    );
  } else {
    // Standardmäßig als Textfrage behandeln
    isCorrect = isTextAnswerCorrect(question, answer);
  }

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
 * Optional kann eine aktuelle Frage angegeben werden, um die nächste Frage nach dieser zu finden
 * 
 * @param state Der Quiz-Zustand
 * @param currentQuestionId Optional: Die ID der aktuellen Frage
 * @returns Die ID der nächsten Frage oder null, wenn keine weitere Frage verfügbar ist
 */
const getNextActiveQuestionId = (state: QuizState, currentQuestionId?: number): number | null => {
  // Sortiere alle Fragen nach ID
  const sortedQuestions = [...state.questions].sort((a, b) => a.id - b.id);
  
  // 1. Wenn eine aktuelle Frage angegeben wurde, finde die nächste ungelöste Frage
  if (currentQuestionId !== undefined) {
    const currentIndex = sortedQuestions.findIndex(q => q.id === currentQuestionId);
    
    if (currentIndex !== -1) {
      // Suche nach der nächsten ungelösten Frage nach der aktuellen
      for (let i = currentIndex + 1; i < sortedQuestions.length; i++) {
        if (sortedQuestions[i].status !== 'solved') {
          return sortedQuestions[i].id;
        }
      }
      
      // Wenn keine nach der aktuellen gefunden wurde, starte von vorne
      for (let i = 0; i < currentIndex; i++) {
        if (sortedQuestions[i].status !== 'solved') {
          return sortedQuestions[i].id;
        }
      }
    }
  }
  
  // 2. Wenn keine aktuelle Frage angegeben wurde oder keine nächste gefunden wurde,
  //    suche nach der ersten ungelösten Frage
  const unsolvedQuestion = sortedQuestions.find(q => q.status !== 'solved');
  return unsolvedQuestion ? unsolvedQuestion.id : null;
};

/**
 * Prüft ob ein Quiz vollständig beantwortet wurde
 */
const isCompleted = (state: QuizState): boolean => {
  return state.completedQuestions === state.questions.length;
};

// Verbesserte isMultipleChoiceQuestion-Funktion
// In quiz/domain/quizLogic.ts

/**
 * Prüft, ob eine Frage vom Typ Multiple-Choice ist
 * Mit Nullprüfung, um Fehler zu vermeiden
 */
const isMultipleChoiceQuestion = <T = any>(
  question: Question<T> | QuizQuestion<T> | null | undefined
): question is QuizMultipleChoiceQuestion<T> => {
  return !!question && question.questionType === QuestionType.MULTIPLE_CHOICE;
};

export {
  createQuizState,
  calculateAnswerResult,
  getNextActiveQuestionId,
  isCompleted,
  isMultipleChoiceQuestion,
  isTextAnswerCorrect,
  isMultipleChoiceAnswerCorrect
};