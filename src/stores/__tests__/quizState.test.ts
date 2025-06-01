// src/stores/__tests__/quizState.test.ts
import { useQuizStore } from '../quizStore';
import { createTestQuiz, createTestQuestion } from '@/src/quiz/testing/testUtils';
import { QuestionStatus } from '@/src/quiz/types';

describe('Quiz State Management', () => {
  beforeEach(() => {
    // Reset store vor jedem Test
    useQuizStore.setState({
      quizzes: {},
      quizStates: {},
      currentQuizId: null,
      isLoading: false,
      loadingOperations: new Set()
    });
  });

  describe('Quiz State Initialization', () => {
    it('should initialize quiz state correctly', () => {
      const store = useQuizStore.getState();
      const testQuiz = createTestQuiz({
        id: 'init-test',
        title: 'Init Test Quiz',
        questions: [
          createTestQuestion({ id: 1, answer: 'Answer 1' }),
          createTestQuestion({ id: 2, answer: 'Answer 2' }),
          createTestQuestion({ id: 3, answer: 'Answer 3' })
        ]
      });

      // Quiz registrieren
      store.registerQuiz(testQuiz);

      // State initialisieren
      const quizState = store.initializeQuizState('init-test');

      expect(quizState).not.toBeNull();
      expect(quizState!.id).toBe('init-test');
      expect(quizState!.questions).toHaveLength(3);
      expect(quizState!.completedQuestions).toBe(0);
      
      // Erste 2 Fragen sollten aktiv sein
      expect(quizState!.questions[0].status).toBe(QuestionStatus.ACTIVE);
      expect(quizState!.questions[1].status).toBe(QuestionStatus.ACTIVE);
      expect(quizState!.questions[2].status).toBe(QuestionStatus.INACTIVE);
    });

    it('should return existing state if already initialized', () => {
      const store = useQuizStore.getState();
      const testQuiz = createTestQuiz({ id: 'existing-test' });

      store.registerQuiz(testQuiz);
      
      // Erste Initialisierung
      const firstState = store.initializeQuizState('existing-test');
      
      // Zweite Initialisierung sollte gleichen State zurückgeben
      const secondState = store.initializeQuizState('existing-test');
      
      expect(firstState).toBe(secondState);
    });

    it('should return null for non-existent quiz', () => {
      const store = useQuizStore.getState();
      const result = store.initializeQuizState('non-existent');
      
      expect(result).toBeNull();
    });
  });

  describe('Answer Processing', () => {
    it('should process correct answer correctly', () => {
      const store = useQuizStore.getState();
      const testQuiz = createTestQuiz({
        id: 'answer-test',
        questions: [
          createTestQuestion({ id: 1, answer: 'Correct Answer' })
        ]
      });

      store.registerQuiz(testQuiz);
      store.initializeQuizState('answer-test');

      // Richtige Antwort einreichen
      const result = store.submitAnswer('answer-test', 1, 'Correct Answer');

      expect(result.isCorrect).toBe(true);
      expect(result.newState).toBeDefined();
      expect(result.newState!.completedQuestions).toBe(1);
      
      // Frage sollte als gelöst markiert sein
      const question = result.newState!.questions.find(q => q.id === 1);
      expect(question!.status).toBe(QuestionStatus.SOLVED);
    });

    it('should process incorrect answer correctly', () => {
      const store = useQuizStore.getState();
      const testQuiz = createTestQuiz({
        id: 'wrong-answer-test',
        questions: [
          createTestQuestion({ id: 1, answer: 'Correct Answer' })
        ]
      });

      store.registerQuiz(testQuiz);
      store.initializeQuizState('wrong-answer-test');

      // Falsche Antwort einreichen
      const result = store.submitAnswer('wrong-answer-test', 1, 'Wrong Answer');

      expect(result.isCorrect).toBe(false);
      expect(result.newState).toBeUndefined();
    });

    it('should handle alternative answers', () => {
      const store = useQuizStore.getState();
      const testQuiz = createTestQuiz({
        id: 'alt-answer-test',
        questions: [
          createTestQuestion({ 
            id: 1, 
            answer: 'Primary Answer',
            alternativeAnswers: ['Alternative Answer', 'Another Answer']
          })
        ]
      });

      store.registerQuiz(testQuiz);
      store.initializeQuizState('alt-answer-test');

      // Alternative Antwort einreichen
      const result = store.submitAnswer('alt-answer-test', 1, 'Alternative Answer');

      expect(result.isCorrect).toBe(true);
      expect(result.newState!.completedQuestions).toBe(1);
    });

    it('should unlock next question after correct answer', () => {
      const store = useQuizStore.getState();
      const testQuiz = createTestQuiz({
        id: 'unlock-test',
        questions: [
          createTestQuestion({ id: 1, answer: 'Answer 1' }),
          createTestQuestion({ id: 2, answer: 'Answer 2' }),
          createTestQuestion({ id: 3, answer: 'Answer 3' }),
          createTestQuestion({ id: 4, answer: 'Answer 4' })
        ]
      });

      store.registerQuiz(testQuiz);
      const initialState = store.initializeQuizState('unlock-test');

      // Initial sollten nur 2 Fragen aktiv sein
      expect(initialState!.questions[0].status).toBe(QuestionStatus.ACTIVE);
      expect(initialState!.questions[1].status).toBe(QuestionStatus.ACTIVE);
      expect(initialState!.questions[2].status).toBe(QuestionStatus.INACTIVE);
      expect(initialState!.questions[3].status).toBe(QuestionStatus.INACTIVE);

      // Erste Frage beantworten
      const result1 = store.submitAnswer('unlock-test', 1, 'Answer 1');
      expect(result1.isCorrect).toBe(true);
      
      // Dritte Frage sollte jetzt aktiv sein
      expect(result1.newState!.questions[2].status).toBe(QuestionStatus.ACTIVE);
      expect(result1.newState!.questions[3].status).toBe(QuestionStatus.INACTIVE);

      // Zweite Frage beantworten
      const result2 = store.submitAnswer('unlock-test', 2, 'Answer 2');
      expect(result2.isCorrect).toBe(true);
      
      // Vierte Frage sollte jetzt aktiv sein
      expect(result2.newState!.questions[3].status).toBe(QuestionStatus.ACTIVE);
    });
  });

  describe('Progress Calculation', () => {
    it('should calculate progress correctly', () => {
      const store = useQuizStore.getState();
      const testQuiz = createTestQuiz({
        id: 'progress-test',
        questions: [
          createTestQuestion({ id: 1, answer: 'Answer 1' }),
          createTestQuestion({ id: 2, answer: 'Answer 2' }),
          createTestQuestion({ id: 3, answer: 'Answer 3' }),
          createTestQuestion({ id: 4, answer: 'Answer 4' })
        ]
      });

      store.registerQuiz(testQuiz);
      store.initializeQuizState('progress-test');

      // Initial sollte 0% sein
      expect(store.getQuizProgress('progress-test')).toBe(0);
      expect(store.getQuizProgressString('progress-test')).toBe('0/4');
      expect(store.isQuizCompleted('progress-test')).toBe(false);

      // Eine Frage beantworten (25%)
      store.submitAnswer('progress-test', 1, 'Answer 1');
      expect(store.getQuizProgress('progress-test')).toBe(25);
      expect(store.getQuizProgressString('progress-test')).toBe('1/4');

      // Zwei weitere Fragen beantworten (75%)
      store.submitAnswer('progress-test', 2, 'Answer 2');
      store.submitAnswer('progress-test', 3, 'Answer 3');
      expect(store.getQuizProgress('progress-test')).toBe(75);
      expect(store.getQuizProgressString('progress-test')).toBe('3/4');

      // Letzte Frage beantworten (100%)
      store.submitAnswer('progress-test', 4, 'Answer 4');
      expect(store.getQuizProgress('progress-test')).toBe(100);
      expect(store.getQuizProgressString('progress-test')).toBe('4/4');
      expect(store.isQuizCompleted('progress-test')).toBe(true);
    });

    it('should return 0 progress for non-existent quiz', () => {
      const store = useQuizStore.getState();
      
      expect(store.getQuizProgress('non-existent')).toBe(0);
      expect(store.getQuizProgressString('non-existent')).toBeNull();
      expect(store.isQuizCompleted('non-existent')).toBe(false);
    });
  });

  describe('Quiz State Reset', () => {
    it('should reset quiz state correctly', () => {
      const store = useQuizStore.getState();
      const testQuiz = createTestQuiz({
        id: 'reset-test',
        questions: [
          createTestQuestion({ id: 1, answer: 'Answer 1' }),
          createTestQuestion({ id: 2, answer: 'Answer 2' })
        ]
      });

      store.registerQuiz(testQuiz);
      store.initializeQuizState('reset-test');
      
      // Fortschritt machen
      store.submitAnswer('reset-test', 1, 'Answer 1');
      expect(store.getQuizProgress('reset-test')).toBe(50);

      // Reset
      const resetState = store.resetQuizState('reset-test');
      
      expect(resetState).not.toBeNull();
      expect(resetState!.completedQuestions).toBe(0);
      expect(store.getQuizProgress('reset-test')).toBe(0);
      
      // Erste 2 Fragen sollten wieder aktiv sein
      expect(resetState!.questions[0].status).toBe(QuestionStatus.ACTIVE);
      expect(resetState!.questions[1].status).toBe(QuestionStatus.ACTIVE);
    });

    it('should return null when resetting non-existent quiz', () => {
      const store = useQuizStore.getState();
      const result = store.resetQuizState('non-existent');
      
      expect(result).toBeNull();
    });
  });

  describe('Loading State Management', () => {
    it('should manage loading states correctly', () => {
      const store = useQuizStore.getState();

      // Initial kein Loading
      expect(store.isLoading).toBe(false);
      expect(store.isOperationLoading('test-op')).toBe(false);

      // Start Loading
      store.setLoading('test-op', true);
      
      // Store State nach Update abfragen
      const storeAfterStart = useQuizStore.getState();
      expect(storeAfterStart.isLoading).toBe(true);
      expect(storeAfterStart.isOperationLoading('test-op')).toBe(true);

      // Weitere Operation
      storeAfterStart.setLoading('second-op', true);
      
      const storeAfterSecond = useQuizStore.getState();
      expect(storeAfterSecond.isLoading).toBe(true);
      expect(storeAfterSecond.isOperationLoading('second-op')).toBe(true);

      // Eine Operation beenden
      storeAfterSecond.setLoading('test-op', false);
      
      const storeAfterFirstEnd = useQuizStore.getState();
      expect(storeAfterFirstEnd.isLoading).toBe(true); // Noch eine aktive Operation
      expect(storeAfterFirstEnd.isOperationLoading('test-op')).toBe(false);
      expect(storeAfterFirstEnd.isOperationLoading('second-op')).toBe(true);

      // Alle Operationen beenden
      storeAfterFirstEnd.setLoading('second-op', false);
      
      const storeAfterAllEnd = useQuizStore.getState();
      expect(storeAfterAllEnd.isLoading).toBe(false);
      expect(storeAfterAllEnd.isOperationLoading('second-op')).toBe(false);
    });

    it('should handle multiple operations of same name correctly', () => {
      const store = useQuizStore.getState();

      // Mehrfach gleiche Operation starten sollte kein Problem sein
      store.setLoading('same-op', true);
      store.setLoading('same-op', true);
      
      const storeAfterStart = useQuizStore.getState();
      expect(storeAfterStart.isLoading).toBe(true);
      expect(storeAfterStart.isOperationLoading('same-op')).toBe(true);

      // Einmal beenden reicht
      storeAfterStart.setLoading('same-op', false);
      
      const storeAfterEnd = useQuizStore.getState();
      expect(storeAfterEnd.isLoading).toBe(false);
      expect(storeAfterEnd.isOperationLoading('same-op')).toBe(false);
    });
  });

  describe('Enhanced Debug Info', () => {
    it('should provide comprehensive debug information', () => {
      const store = useQuizStore.getState();
      const quiz1 = createTestQuiz({
        id: 'debug-quiz-1',
        questions: [
          createTestQuestion({ id: 1, answer: 'Answer 1' }),
          createTestQuestion({ id: 2, answer: 'Answer 2' })
        ]
      });
      const quiz2 = createTestQuiz({
        id: 'debug-quiz-2',
        questions: [
          createTestQuestion({ id: 1, answer: 'Answer 1' }),
          createTestQuestion({ id: 2, answer: 'Answer 2' }),
          createTestQuestion({ id: 3, answer: 'Answer 3' })
        ]
      });

      // Setup
      store.registerQuiz(quiz1);
      store.registerQuiz(quiz2);
      store.initializeQuizState('debug-quiz-1');
      store.initializeQuizState('debug-quiz-2');
      
      // Quiz 1 teilweise abschließen
      store.submitAnswer('debug-quiz-1', 1, 'Answer 1');
      
      // Quiz 2 komplett abschließen
      store.submitAnswer('debug-quiz-2', 1, 'Answer 1');
      store.submitAnswer('debug-quiz-2', 2, 'Answer 2');
      store.submitAnswer('debug-quiz-2', 3, 'Answer 3');

      const debugInfo = store.getDebugInfo();

      expect(debugInfo.quizzesCount).toBe(2);
      expect(debugInfo.statesCount).toBe(2);
      expect(debugInfo.totalQuestions).toBe(5); // 2 + 3 Fragen
      expect(debugInfo.completedQuestions).toBe(4); // 1 + 3 abgeschlossen
      expect(debugInfo.completedQuizzes).toBe(1); // Nur Quiz 2 komplett
      expect(debugInfo.allQuizIds).toEqual(['debug-quiz-1', 'debug-quiz-2']);
    });
  });

  describe('Selectors', () => {
    it('should provide correct selector results', () => {
      const store = useQuizStore.getState();
      const testQuiz = createTestQuiz({ id: 'selector-test', title: 'Selector Test' });

      store.registerQuiz(testQuiz);
      store.initializeQuizState('selector-test');
      store.setCurrentQuiz('selector-test');

      // Test Selectors
      expect(store.getAllQuizzes()).toHaveLength(1);
      expect(store.getQuizById('selector-test')).toEqual(testQuiz);
      expect(store.getCurrentQuiz()).toEqual(testQuiz);
      expect(store.getCurrentQuizState()).toBeDefined();
      expect(store.getCurrentQuizState()!.id).toBe('selector-test');
    });

    it('should handle null current quiz correctly', () => {
      const store = useQuizStore.getState();
      
      expect(store.getCurrentQuiz()).toBeNull();
      expect(store.getCurrentQuizState()).toBeNull();
    });

    it('should handle non-existent quiz ID correctly', () => {
      const store = useQuizStore.getState();
      
      expect(store.getQuizById('non-existent')).toBeUndefined();
    });
  });

  describe('Next Active Question', () => {
    it('should find next active question correctly', () => {
      const store = useQuizStore.getState();
      const testQuiz = createTestQuiz({
        id: 'next-question-test',
        questions: [
          createTestQuestion({ id: 1, answer: 'Answer 1' }),
          createTestQuestion({ id: 2, answer: 'Answer 2' }),
          createTestQuestion({ id: 3, answer: 'Answer 3' }),
          createTestQuestion({ id: 4, answer: 'Answer 4' })
        ]
      });

      store.registerQuiz(testQuiz);
      store.initializeQuizState('next-question-test');

      // Erste aktive Frage sollte 1 sein
      expect(store.getNextActiveQuestion('next-question-test')).toBe(1);

      // Nach Beantwortung von Frage 1
      store.submitAnswer('next-question-test', 1, 'Answer 1');
      expect(store.getNextActiveQuestion('next-question-test')).toBe(2);

      // Nach Beantwortung von Frage 2
      store.submitAnswer('next-question-test', 2, 'Answer 2');
      expect(store.getNextActiveQuestion('next-question-test')).toBe(3);
    });

    it('should return null when no active questions left', () => {
      const store = useQuizStore.getState();
      const testQuiz = createTestQuiz({
        id: 'no-next-test',
        questions: [
          createTestQuestion({ id: 1, answer: 'Answer 1' })
        ]
      });

      store.registerQuiz(testQuiz);
      store.initializeQuizState('no-next-test');
      
      // Einzige Frage beantworten
      store.submitAnswer('no-next-test', 1, 'Answer 1');
      
      expect(store.getNextActiveQuestion('no-next-test')).toBeNull();
    });

    it('should return null for non-existent quiz', () => {
      const store = useQuizStore.getState();
      
      expect(store.getNextActiveQuestion('non-existent')).toBeNull();
    });
  });

  describe('Quiz Completion Detection', () => {
    it('should detect quiz completion correctly', () => {
      const store = useQuizStore.getState();
      const testQuiz = createTestQuiz({
        id: 'completion-test',
        questions: [
          createTestQuestion({ id: 1, answer: 'Answer 1' }),
          createTestQuestion({ id: 2, answer: 'Answer 2' })
        ]
      });

      store.registerQuiz(testQuiz);
      store.initializeQuizState('completion-test');

      // Nicht komplett
      expect(store.isQuizCompleted('completion-test')).toBe(false);

      // Erste Frage
      const result1 = store.submitAnswer('completion-test', 1, 'Answer 1');
      expect(result1.wasCompleted).toBe(false);
      expect(store.isQuizCompleted('completion-test')).toBe(false);

      // Zweite Frage - sollte Quiz abschließen
      const result2 = store.submitAnswer('completion-test', 2, 'Answer 2');
      expect(result2.wasCompleted).toBe(true);
      expect(store.isQuizCompleted('completion-test')).toBe(true);
    });
  });
});