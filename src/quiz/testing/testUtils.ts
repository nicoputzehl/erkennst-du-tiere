import { Question, QuizQuestion, QuizState, Quiz, QuestionStatus, QuizMode } from '../types';

// ====== TEST DATA FACTORIES (PURE FUNCTIONS) ======

/**
 * Erstellt Test-Frage - reine Factory-Funktion
 */
export const createTestQuestion = (overrides: Partial<Question> = {}): Question => ({
  id: 1,
  images: {
    imageUrl: 'test-image.jpg',
    thumbnailUrl: 'test-thumb.jpg',
  },
  answer: 'Test Answer',
  alternativeAnswers: ['Alt Answer'],
  funFact: 'Test fun fact',
  wikipediaName: 'Test_Wikipedia',
  contentKey: 'test-content',
  ...overrides,
});

/**
 * Erstellt Test-Quiz-Frage mit Status - reine Factory-Funktion
 */
export const createTestQuizQuestion = (
  overrides: Partial<QuizQuestion> = {}
): QuizQuestion => ({
  id: 1,
  images: {
    imageUrl: 'test-image.jpg',
    thumbnailUrl: 'test-thumb.jpg',
  },
  answer: 'Test Answer',
  alternativeAnswers: ['Alt Answer'],
  funFact: 'Test fun fact',
  wikipediaName: 'Test_Wikipedia',
  contentKey: 'test-content',
  status: QuestionStatus.ACTIVE,
  ...overrides,
});

/**
 * Erstellt Test-Quiz - reine Factory-Funktion
 */
export const createTestQuiz = (overrides: Partial<Quiz> = {}): Quiz => ({
  id: 'test-quiz',
  title: 'Test Quiz',
  questions: [createTestQuestion()],
  initiallyLocked: false,
  order: 1,
  quizMode: QuizMode.SEQUENTIAL,
  initialUnlockedQuestions: 2,
  ...overrides,
});

/**
 * Erstellt Test-Quiz-State - reine Factory-Funktion
 */
export const createTestQuizState = (overrides: Partial<QuizState> = {}): QuizState => ({
  id: 'test-quiz-state',
  title: 'Test Quiz State',
  questions: [createTestQuizQuestion()],
  completedQuestions: 0,
  quizMode: QuizMode.SEQUENTIAL,
  ...overrides,
});

// ====== TEST DATA BUILDERS (FUNCTIONAL COMPOSITION) ======

/**
 * Builder für komplexe Quiz-States - funktionale Komposition
 */
export const quizStateBuilder = (baseState: Partial<QuizState> = {}) => ({
  withQuestions: (count: number) => {
    const questions = Array.from({ length: count }, (_, i) => 
      createTestQuizQuestion({ id: i + 1 })
    );
    return quizStateBuilder({ ...baseState, questions });
  },
  
  withCompletedQuestions: (count: number) => {
    return quizStateBuilder({ ...baseState, completedQuestions: count });
  },
  
  withSolvedQuestions: (solvedIndices: number[]) => {
    const questions = (baseState.questions || [createTestQuizQuestion()]).map((q, i) => 
      solvedIndices.includes(i) 
        ? { ...q, status: QuestionStatus.SOLVED }
        : { ...q, status: QuestionStatus.ACTIVE }
    );
    return quizStateBuilder({ ...baseState, questions });
  },
  
  withMode: (mode: QuizMode) => {
    return quizStateBuilder({ ...baseState, quizMode: mode });
  },
  
  build: (): QuizState => createTestQuizState(baseState),
});

/**
 * Builder für Quiz-Collections - funktionale Komposition
 */
export const quizCollectionBuilder = () => {
  let quizzes: Quiz[] = [];
  
  return {
    addQuiz: (quiz: Partial<Quiz> = {}) => {
      quizzes.push(createTestQuiz(quiz));
      return quizCollectionBuilder();
    },
    
    addLockedQuiz: (requiredQuizId: string, quiz: Partial<Quiz> = {}) => {
      quizzes.push(createTestQuiz({
        ...quiz,
        initiallyLocked: true,
        unlockCondition: {
          requiredQuizId,
          description: `Complete ${requiredQuizId} to unlock`
        }
      }));
      return quizCollectionBuilder();
    },
    
    build: (): Quiz[] => quizzes,
  };
};

// ====== MOCK FACTORIES (PURE FUNCTIONS) ======

/**
 * Erstellt Mock Quiz-States - reine Funktion
 */
export const createMockQuizStates = (
  quizIds: string[], 
  completedQuizIds: string[] = []
): Record<string, QuizState> => {
  return quizIds.reduce((acc, quizId) => {
    const isCompleted = completedQuizIds.includes(quizId);
    acc[quizId] = quizStateBuilder()
      .withQuestions(5)
      .withCompletedQuestions(isCompleted ? 5 : 2)
      .withSolvedQuestions(isCompleted ? [0, 1, 2, 3, 4] : [0, 1])
      .build();
    return acc;
  }, {} as Record<string, QuizState>);
};

/**
 * Erstellt Mock Unlock-Chain - reine Funktion
 */
export const createMockUnlockChain = (): Quiz[] => {
  return quizCollectionBuilder()
    .addQuiz({ id: 'quiz1', title: 'First Quiz' })
    .addLockedQuiz('quiz1', { id: 'quiz2', title: 'Second Quiz' })
    .addLockedQuiz('quiz2', { id: 'quiz3', title: 'Third Quiz' })
    .build();
};

// ====== TEST ASSERTION HELPERS (PURE FUNCTIONS) ======

/**
 * Prüft ob Quiz-State korrekt ist - reine Funktion
 */
export const assertQuizStateValid = (state: QuizState): boolean => {
  return (
    state.id.length > 0 &&
    state.title.length > 0 &&
    state.questions.length > 0 &&
    state.completedQuestions >= 0 &&
    state.completedQuestions <= state.questions.length
  );
};

/**
 * Prüft ob Quiz korrekt konfiguriert ist - reine Funktion
 */
export const assertQuizValid = (quiz: Quiz): boolean => {
  return (
    quiz.id.length > 0 &&
    quiz.title.length > 0 &&
    quiz.questions.length > 0 &&
    (quiz.order || 0) >= 0 &&
    (quiz.initialUnlockedQuestions || 0) >= 0
  );
};

/**
 * Vergleicht zwei Quiz-States - reine Funktion
 */
export const areQuizStatesEqual = (state1: QuizState, state2: QuizState): boolean => {
  return (
    state1.id === state2.id &&
    state1.completedQuestions === state2.completedQuestions &&
    state1.questions.length === state2.questions.length &&
    state1.questions.every((q1, i) => {
      const q2 = state2.questions[i];
      return q1.id === q2.id && q1.status === q2.status;
    })
  );
};

// ====== SCENARIO BUILDERS (FUNCTIONAL COMPOSITION) ======

/**
 * Baut Test-Szenarien für verschiedene Quiz-Zustände
 */
export const scenarioBuilder = {
  /**
   * Szenario: Leeres Quiz
   */
  emptyQuiz: () => createTestQuizState({
    questions: [],
    completedQuestions: 0,
  }),
  
  /**
   * Szenario: Quiz in Bearbeitung
   */
  quizInProgress: () => quizStateBuilder()
    .withQuestions(5)
    .withCompletedQuestions(2)
    .withSolvedQuestions([0, 1])
    .build(),
  
  /**
   * Szenario: Abgeschlossenes Quiz
   */
  completedQuiz: () => quizStateBuilder()
    .withQuestions(3)
    .withCompletedQuestions(3)
    .withSolvedQuestions([0, 1, 2])
    .build(),
  
  /**
   * Szenario: Unlock-Kette
   */
  unlockChain: () => ({
    quizzes: createMockUnlockChain(),
    quizStates: createMockQuizStates(['quiz1'], ['quiz1']), // quiz1 abgeschlossen
  }),
};
