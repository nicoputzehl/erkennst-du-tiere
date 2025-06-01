import { useQuizStore } from '../quizStore';

describe('Parallel Quiz Provider Integration', () => {
  beforeEach(() => {
    // Reset store vor jedem Test
    useQuizStore.setState({
      quizzes: {},
      quizStates: {},
      currentQuizId: null
    });
  });

  it('should work with basic store operations', () => {
    const store = useQuizStore.getState();
    
    // Test basic registration
    store.registerQuiz({
      id: 'integration-test',
      title: 'Integration Test Quiz',
      questions: []
    });

    const updatedStore = useQuizStore.getState();
    expect(updatedStore.getDebugInfo().quizzesCount).toBe(1);
    expect(updatedStore.quizzes['integration-test'].title).toBe('Integration Test Quiz');
  });

  it('should maintain store state across multiple operations', () => {
    const store = useQuizStore.getState();
    
    // Multiple operations
    store.registerQuiz({
      id: 'quiz-1',
      title: 'Quiz 1',
      questions: []
    });
    
    store.registerQuiz({
      id: 'quiz-2', 
      title: 'Quiz 2',
      questions: []
    });
    
    store.setCurrentQuiz('quiz-1');
    
    const finalStore = useQuizStore.getState();
    expect(finalStore.getDebugInfo().quizzesCount).toBe(2);
    expect(finalStore.currentQuizId).toBe('quiz-1');
  });

  it('should handle store subscription correctly', () => {
    let subscriptionCallCount = 0;
    let lastState: any = null;
    
    const unsubscribe = useQuizStore.subscribe((state) => {
      subscriptionCallCount++;
      lastState = state;
    });
    
    const store = useQuizStore.getState();
    store.registerQuiz({
      id: 'subscription-test',
      title: 'Subscription Test',
      questions: []
    });
    
    expect(subscriptionCallCount).toBeGreaterThan(0);
    expect(lastState?.quizzes['subscription-test']).toBeDefined();
    
    unsubscribe();
  });
});