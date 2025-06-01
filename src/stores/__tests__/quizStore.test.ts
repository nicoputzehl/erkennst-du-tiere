import { useQuizStore } from '../quizStore';
import { createTestQuiz } from '@/src/quiz/testing/testUtils';

describe('QuizStore - Basic Functionality', () => {
  beforeEach(() => {
    // Reset store vor jedem Test
    useQuizStore.setState({
      quizzes: {},
      quizStates: {},
      currentQuizId: null
    });
  });

  it('should register quizzes correctly', () => {
    const store = useQuizStore.getState();
    const testQuiz = createTestQuiz({ id: 'test-quiz', title: 'Test Quiz' });

    store.registerQuiz(testQuiz);

    const updatedStore = useQuizStore.getState();
    expect(updatedStore.quizzes['test-quiz']).toEqual(testQuiz);
    expect(updatedStore.getDebugInfo().quizzesCount).toBe(1);
  });

  it('should set current quiz correctly', () => {
    const store = useQuizStore.getState();
    const testQuiz = createTestQuiz({ id: 'test-quiz' });

    store.registerQuiz(testQuiz);
    store.setCurrentQuiz('test-quiz');

    const updatedStore = useQuizStore.getState();
    expect(updatedStore.currentQuizId).toBe('test-quiz');
    expect(updatedStore.getDebugInfo().currentQuiz).toBe('test-quiz');
  });

  it('should handle multiple quiz registrations', () => {
    const store = useQuizStore.getState();
    const quiz1 = createTestQuiz({ id: 'quiz-1', title: 'Quiz 1' });
    const quiz2 = createTestQuiz({ id: 'quiz-2', title: 'Quiz 2' });

    store.registerQuiz(quiz1);
    store.registerQuiz(quiz2);

    const updatedStore = useQuizStore.getState();
    expect(Object.keys(updatedStore.quizzes)).toHaveLength(2);
    expect(updatedStore.quizzes['quiz-1']).toEqual(quiz1);
    expect(updatedStore.quizzes['quiz-2']).toEqual(quiz2);
  });

  it('should persist currentQuizId structure', () => {
    const store = useQuizStore.getState();
    
    store.setCurrentQuiz('persisted-quiz');

    const updatedStore = useQuizStore.getState();
    expect(updatedStore.currentQuizId).toBe('persisted-quiz');
  });
});