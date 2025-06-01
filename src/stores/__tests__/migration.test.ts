// src/stores/__tests__/migration.test.ts
import { useQuizStore } from '../quizStore';
import { registerQuiz, registerMultipleQuizzes, validateQuizRegistration } from '../quizRegistry';

describe('Quiz Migration', () => {
  beforeEach(() => {
    // Reset store vor jedem Test
    useQuizStore.setState({
      quizzes: {},
      quizStates: {},
      currentQuizId: null
    });
  });

  it('should register quizzes via registry', () => {
    const testQuiz = {
      id: 'registry-test',
      title: 'Registry Test Quiz',
      questions: []
    };

    // Quiz über Registry registrieren
    registerQuiz(testQuiz);

    // Prüfen ob im Store
    const store = useQuizStore.getState();
    expect(store.quizzes['registry-test']).toEqual(testQuiz);
    expect(store.getDebugInfo().quizzesCount).toBe(1);
  });

  it('should handle multiple quiz registrations', () => {
    const quizzes = [
      { id: 'quiz-1', title: 'Quiz 1', questions: [] },
      { id: 'quiz-2', title: 'Quiz 2', questions: [] },
      { id: 'quiz-3', title: 'Quiz 3', questions: [] }
    ];

    // Mehrere Quizzes registrieren
    registerMultipleQuizzes(quizzes);

    // Prüfen
    const store = useQuizStore.getState();
    expect(store.getDebugInfo().quizzesCount).toBe(3);
    expect(store.getDebugInfo().allQuizIds).toEqual(['quiz-1', 'quiz-2', 'quiz-3']);
  });

  it('should return registered quiz for chaining', () => {
    const testQuiz = {
      id: 'chain-test',
      title: 'Chain Test',
      questions: []
    };

    const returnedQuiz = registerQuiz(testQuiz);
    
    expect(returnedQuiz).toEqual(testQuiz);
    expect(returnedQuiz.id).toBe('chain-test');
  });

  it('should handle registry validation in development', () => {
    // Mock console.log für Test
    const consoleSpy = jest.spyOn(console, 'log').mockImplementation();

    const testQuiz = {
      id: 'validation-test',
      title: 'Validation Test',
      questions: []
    };

    registerQuiz(testQuiz);
    validateQuizRegistration();

    // In Development sollte Logging stattfinden
    expect(consoleSpy).toHaveBeenCalled();
    
    consoleSpy.mockRestore();
  });

  it('should maintain store state consistency', () => {
    const quiz1 = { id: 'consistency-1', title: 'Quiz 1', questions: [] };
    const quiz2 = { id: 'consistency-2', title: 'Quiz 2', questions: [] };

    // Registriere über Registry
    registerQuiz(quiz1);
    
    // Registriere direkt über Store
    const store = useQuizStore.getState();
    store.registerQuiz(quiz2);

    // Beide sollten im Store sein
    const finalStore = useQuizStore.getState();
    expect(finalStore.getDebugInfo().quizzesCount).toBe(2);
    expect(finalStore.quizzes['consistency-1']).toEqual(quiz1);
    expect(finalStore.quizzes['consistency-2']).toEqual(quiz2);
  });
});