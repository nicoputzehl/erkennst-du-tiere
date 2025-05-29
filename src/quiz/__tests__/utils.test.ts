import {
  calculateAnswerResult,
  isAnswerCorrect,
  calculateQuizProgress,
  isCompleted,
  getNextActiveQuestionId,
  calculateInitialQuestionStatus,
  findNextInactiveQuestionIndex,
  checkUnlockCondition,
} from '../utils';

import {
  createTestQuizState,
  createTestQuizQuestion,
  createTestQuiz,
  quizStateBuilder,
  scenarioBuilder,
  createMockQuizStates,
} from '../testing/testUtils';

import { processAnswerLogic } from '../hooks/useAnswerProcessing';
import { stateOperations } from '../contexts/QuizStateProvider';

import { QuestionStatus, QuizMode } from '../types';

describe('Quiz Utils', () => {

  describe('isAnswerCorrect', () => {
    it('should return true for exact match', () => {
      const result = isAnswerCorrect('Elefant', 'Elefant');
      expect(result).toBe(true);
    });

    it('should return true for case insensitive match', () => {
      const result = isAnswerCorrect('elefant', 'Elefant');
      expect(result).toBe(true);
    });

    it('should return true for alternative answer', () => {
      const result = isAnswerCorrect('Aye-Aye', 'Fingertier', ['Aye-Aye']);
      expect(result).toBe(true);
    });

    it('should return false for wrong answer', () => {
      const result = isAnswerCorrect('Giraffe', 'Elefant');
      expect(result).toBe(false);
    });

    // TODO later
    it.skip('should handle normalized strings', () => {
      const result = isAnswerCorrect('Käänguru', 'Känguru');
      expect(result).toBe(true);
    });
  });

  describe('calculateQuizProgress', () => {
    it('should return 0 for empty quiz', () => {
      const state = scenarioBuilder.emptyQuiz();
      const progress = calculateQuizProgress(state);
      expect(progress).toBe(0);
    });

    it('should calculate correct progress percentage', () => {
      const state = quizStateBuilder()
        .withQuestions(5)
        .withCompletedQuestions(2)
        .build();

      const progress = calculateQuizProgress(state);
      expect(progress).toBe(40); // 2/5 = 40%
    });

    it('should return 100 for completed quiz', () => {
      const state = scenarioBuilder.completedQuiz();
      const progress = calculateQuizProgress(state);
      expect(progress).toBe(100);
    });
  });

  describe('isCompleted', () => {
    it('should return false for quiz in progress', () => {
      const state = scenarioBuilder.quizInProgress();
      const result = isCompleted(state);
      expect(result).toBe(false);
    });

    it('should return true for completed quiz', () => {
      const state = scenarioBuilder.completedQuiz();
      const result = isCompleted(state);
      expect(result).toBe(true);
    });
  });

  describe('calculateInitialQuestionStatus', () => {
    it('should create correct initial status for sequential mode', () => {
      const statuses = calculateInitialQuestionStatus(5, QuizMode.SEQUENTIAL, 2);

      expect(statuses).toEqual([
        QuestionStatus.ACTIVE,
        QuestionStatus.ACTIVE,
        QuestionStatus.INACTIVE,
        QuestionStatus.INACTIVE,
        QuestionStatus.INACTIVE,
      ]);
    });

    it('should create all active for all_unlocked mode', () => {
      const statuses = calculateInitialQuestionStatus(3, QuizMode.ALL_UNLOCKED, 1);

      expect(statuses).toEqual([
        QuestionStatus.ACTIVE,
        QuestionStatus.ACTIVE,
        QuestionStatus.ACTIVE,
      ]);
    });
  });

  describe('getNextActiveQuestionId', () => {
    it('should return first unsolved question', () => {
      const state = quizStateBuilder()
        .withQuestions(3)
        .withSolvedQuestions([0])
        .build();

      const nextId = getNextActiveQuestionId(state);
      expect(nextId).toBe(2);
    });

    it('should return null for completed quiz', () => {
      const state = scenarioBuilder.completedQuiz();
      const nextId = getNextActiveQuestionId(state);
      expect(nextId).toBe(null);
    });

    it('should find next question after current', () => {
      const state = quizStateBuilder()
        .withQuestions(5)
        .withSolvedQuestions([0, 2])
        .build();

      const nextId = getNextActiveQuestionId(state, 1);
      expect(nextId).toBe(2);
    });
  });

  describe('checkUnlockCondition', () => {
    it('should return false when required quiz not completed', () => {
      const condition = { requiredQuizId: 'quiz1', description: 'Complete quiz1' };
      const quizStates = createMockQuizStates(['quiz1'], []);

      const result = checkUnlockCondition(condition, quizStates);

      expect(result.isMet).toBe(false);
      expect(result.progress).toBe(0);
    });

    it('should return true when required quiz completed', () => {
      const condition = { requiredQuizId: 'quiz1', description: 'Complete quiz1' };
      const quizStates = createMockQuizStates(['quiz1'], ['quiz1']);

      const result = checkUnlockCondition(condition, quizStates);

      expect(result.isMet).toBe(true);
      expect(result.progress).toBe(100);
    });
  });

  describe('calculateAnswerResult', () => {
    it('should return incorrect result for wrong answer', () => {
      const state = createTestQuizState({
        questions: [createTestQuizQuestion({ id: 1, answer: 'Elefant' })],
      });

      const result = calculateAnswerResult(state, 1, 'Giraffe');

      expect(result.isCorrect).toBe(false);
      expect(result.newState).toBe(state);
    });

    it('should update state correctly for right answer', () => {
      const state = quizStateBuilder()
        .withQuestions(3)
        .withCompletedQuestions(0)
        .build();

      const result = calculateAnswerResult(state, 1, state.questions[0].answer);

      expect(result.isCorrect).toBe(true);
      expect(result.newState.completedQuestions).toBe(1);
      expect(result.newState.questions[0].status).toBe(QuestionStatus.SOLVED);
    });

    it('should unlock next question in sequential mode', () => {
      const state = quizStateBuilder()
        .withQuestions(3)
        .withMode(QuizMode.SEQUENTIAL)
        .build();

      // Erste Frage ist bereits active, zweite inactive
      const result = calculateAnswerResult(state, 1, state.questions[0].answer);

      expect(result.newState.questions[1].status).toBe(QuestionStatus.ACTIVE);
    });

    it('should throw error for non-existent question', () => {
      const state = createTestQuizState();

      expect(() => {
        calculateAnswerResult(state, 999, 'any answer');
      }).toThrow('Frage mit ID 999 nicht gefunden');
    });
  });


  describe('findNextInactiveQuestionIndex', () => {
    it('should find first inactive question', () => {
      const questions = [
        createTestQuizQuestion({ status: QuestionStatus.ACTIVE }),
        createTestQuizQuestion({ status: QuestionStatus.SOLVED }),
        createTestQuizQuestion({ status: QuestionStatus.INACTIVE }),
      ];

      const index = findNextInactiveQuestionIndex(questions);
      expect(index).toBe(2);
    });

    it('should return -1 when no inactive questions', () => {
      const questions = [
        createTestQuizQuestion({ status: QuestionStatus.ACTIVE }),
        createTestQuizQuestion({ status: QuestionStatus.SOLVED }),
      ];

      const index = findNextInactiveQuestionIndex(questions);
      expect(index).toBe(-1);
    });
  });
});


describe('Quiz Utils - Integration Tests', () => {

  describe('Quiz State Lifecycle', () => {
    it('should handle complete quiz workflow', () => {
      // Arrange: Quiz mit 3 Fragen erstellen
      let state = quizStateBuilder()
        .withQuestions(3)
        .build();

      expect(state.completedQuestions).toBe(0);
      expect(isCompleted(state)).toBe(false);

      // Act 1: Erste Frage beantworten
      state = calculateAnswerResult(state, 1, state.questions[0].answer).newState;

      // Assert 1
      expect(state.completedQuestions).toBe(1);
      expect(state.questions[0].status).toBe(QuestionStatus.SOLVED);
      expect(state.questions[1].status).toBe(QuestionStatus.ACTIVE);

      // Act 2: Zweite Frage beantworten
      state = calculateAnswerResult(state, 2, state.questions[1].answer).newState;

      // Assert 2
      expect(state.completedQuestions).toBe(2);
      expect(state.questions[2].status).toBe(QuestionStatus.ACTIVE);

      // Act 3: Letzte Frage beantworten
      state = calculateAnswerResult(state, 3, state.questions[2].answer).newState;

      // Assert 3: Quiz abgeschlossen
      expect(state.completedQuestions).toBe(3);
      expect(isCompleted(state)).toBe(true);
      expect(calculateQuizProgress(state)).toBe(100);
    });
  });

  describe('Unlock Chain Workflow', () => {
    it.skip('should handle unlock chain correctly', () => {
      // Arrange: Quiz-Chain mit Dependencies
      const { quizzes, quizStates } = scenarioBuilder.unlockChain();

      // Assert: Erstes Quiz ist freigeschaltet
      expect(checkUnlockCondition(
        quizzes[1].unlockCondition!,
        quizStates
      ).isMet).toBe(true);

      // Assert: Zweites Quiz ist noch gesperrt
      expect(checkUnlockCondition(
        quizzes[2].unlockCondition!,
        quizStates
      ).isMet).toBe(false);
    });
  });
});


describe('Answer Processing Hook - Testable Version', () => {

  describe('processAnswerLogic', () => {
    it('should process correct answer successfully', async () => {
      // Arrange: Mock Dependencies
      const mockState = createTestQuizState({
        questions: [createTestQuizQuestion({ id: 1, answer: 'Elefant' })],
      });

      const mockDependencies = {
        getCurrentState: jest.fn().mockReturnValue(mockState),
        updateState: jest.fn().mockResolvedValue(undefined),
        getAllQuizzes: jest.fn().mockReturnValue([]),
      };

      // Act
      const result = await processAnswerLogic(
        'test-quiz',
        1,
        'Elefant',
        mockDependencies
      );

      // Assert
      expect(result.isCorrect).toBe(true);
      expect(result.newState).toBeDefined();
      expect(mockDependencies.updateState).toHaveBeenCalledWith(
        'test-quiz',
        expect.any(Object)
      );
    });

    it('should handle incorrect answer', async () => {
      // Arrange
      const mockState = createTestQuizState({
        questions: [createTestQuizQuestion({ id: 1, answer: 'Elefant' })],
      });

      const mockDependencies = {
        getCurrentState: jest.fn().mockReturnValue(mockState),
        updateState: jest.fn(),
        getAllQuizzes: jest.fn().mockReturnValue([]),
      };

      // Act
      const result = await processAnswerLogic(
        'test-quiz',
        1,
        'Giraffe',
        mockDependencies
      );

      // Assert
      expect(result.isCorrect).toBe(false);
      expect(mockDependencies.updateState).not.toHaveBeenCalled();
    });

    it('should detect quiz unlocks after completion', async () => {
      // Arrange: Quiz kurz vor Abschluss
      const mockState = quizStateBuilder()
        .withQuestions(2)
        .withCompletedQuestions(1)
        .withSolvedQuestions([0])
        .build();

      const mockQuizzes = [
        createTestQuiz({
          id: 'locked-quiz',
          initiallyLocked: true,
          unlockCondition: {
            requiredQuizId: 'test-quiz',
            description: 'Complete test-quiz'
          }
        })
      ];

      const mockDependencies = {
        getCurrentState: jest.fn().mockReturnValue(mockState),
        updateState: jest.fn().mockResolvedValue(undefined),
        getAllQuizzes: jest.fn().mockReturnValue(mockQuizzes),
      };

      // Act: Beantworte letzte Frage
      const result = await processAnswerLogic(
        'test-quiz',
        2,
        mockState.questions[1].answer,
        mockDependencies
      );

      // Assert: Quiz sollte freigeschaltet werden
      expect(result.isCorrect).toBe(true);
      expect(result.unlockedQuizzes).toHaveLength(1);
      expect(result.unlockedQuizzes[0].id).toBe('locked-quiz');
      expect(result.unlockedQuizzes[0].initiallyLocked).toBe(false);
    });

  });
});


describe('QuizStateProvider - State Operations', () => {

  describe('stateOperations.initializeState', () => {
    it('should return existing state if available', () => {
      // Arrange
      const existingState = createTestQuizState({ id: 'existing' });
      const existingStates = { 'test-quiz': existingState };
      const mockGetQuiz = jest.fn();

      // Act
      const result = stateOperations.initializeState(
        'test-quiz',
        existingStates,
        mockGetQuiz
      );

      // Assert
      expect(result).toBe(existingState);
      expect(mockGetQuiz).not.toHaveBeenCalled();
    });

    it('should create new state if not exists', () => {
      // Arrange
      const mockQuiz = createTestQuiz({ id: 'new-quiz' });
      const mockGetQuiz = jest.fn().mockReturnValue(mockQuiz);

      // Act
      const result = stateOperations.initializeState(
        'new-quiz',
        {},
        mockGetQuiz
      );

      // Assert
      expect(result).toBeDefined();
      expect(result!.id).toBe('new-quiz');
      expect(mockGetQuiz).toHaveBeenCalledWith('new-quiz');
    });

    it('should return null for non-existent quiz', () => {
      // Arrange
      const mockGetQuiz = jest.fn().mockReturnValue(null);

      // Act
      const result = stateOperations.initializeState(
        'non-existent',
        {},
        mockGetQuiz
      );

      // Assert
      expect(result).toBe(null);
    });
  });

  describe('stateOperations.calculateStateUpdate', () => {
    it('should update quiz states correctly', () => {
      // Arrange
      const newState = createTestQuizState({ id: 'updated' });
      const currentStates = { 'other-quiz': createTestQuizState() };

      // Act
      const result = stateOperations.calculateStateUpdate(
        'test-quiz',
        newState,
        currentStates,
        'test-quiz'
      );

      // Assert
      expect(result.quizStates['test-quiz']).toBe(newState);
      expect(result.quizStates['other-quiz']).toBe(currentStates['other-quiz']);
      expect(result.currentQuizState).toBe(newState);
    });
  });

  describe('stateOperations.calculateStatistics', () => {
    it('should calculate correct statistics', () => {
      // Arrange
      const quizStates = {
        'quiz1': scenarioBuilder.completedQuiz(),
        'quiz2': scenarioBuilder.quizInProgress(),
        'quiz3': quizStateBuilder().withQuestions(5).withCompletedQuestions(0).build(),
      };

      // Act
      const stats = stateOperations.calculateStatistics(quizStates);

      // Assert
      expect(stats.completedCount).toBe(1); // Nur quiz1 ist abgeschlossen
      expect(stats.totalQuestions).toBe(3 + 5 + 5); // Summe aller Fragen
      expect(stats.completedQuestions).toBe(3 + 2 + 0); // Summe abgeschlossener Fragen
    });
  });
});

describe('Quiz Utils - Performance Tests', () => {

  it('should handle large quiz states efficiently', () => {
    // Arrange: Großer Quiz-State mit 1000 Fragen
    const largeState = quizStateBuilder()
      .withQuestions(1000)
      .withCompletedQuestions(500)
      .build();

    // Act & Assert: Operationen sollten schnell sein
    const startTime = performance.now();

    const progress = calculateQuizProgress(largeState);
    const completed = isCompleted(largeState);
    const nextQuestion = getNextActiveQuestionId(largeState);

    const endTime = performance.now();

    expect(progress).toBe(50);
    expect(completed).toBe(false);
    expect(nextQuestion).toBeDefined();
    expect(endTime - startTime).toBeLessThan(10); // Sollte unter 10ms sein
  });

  it('should handle many unlock conditions efficiently', () => {
    // Arrange: Viele Quiz-States für Unlock-Prüfung
    const manyQuizStates = createMockQuizStates(
      Array.from({ length: 100 }, (_, i) => `quiz${i}`),
      Array.from({ length: 50 }, (_, i) => `quiz${i}`) // Hälfte abgeschlossen
    );

    const condition = { requiredQuizId: 'quiz25', description: 'Test' };

    // Act & Assert
    const startTime = performance.now();
    const result = checkUnlockCondition(condition, manyQuizStates);
    const endTime = performance.now();

    expect(result.isMet).toBe(true);
    expect(endTime - startTime).toBeLessThan(5); // Sollte sehr schnell sein
  });
});


describe('Quiz Utils - Edge Cases', () => {

  it('should handle empty answers gracefully', () => {
    expect(isAnswerCorrect('', 'Elefant')).toBe(false);
    expect(isAnswerCorrect('   ', 'Elefant')).toBe(false);
  });

  // TODO implement
  it.skip('should handle special characters in answers', () => {
    expect(isAnswerCorrect('Kap-Borstenhörnchen', 'Kap Borstenhörnchen')).toBe(true);
    expect(isAnswerCorrect('Südafrikanischer Seebär', 'Suedafrikanischer Seebaer')).toBe(true);
  });

  it('should handle quiz with only one question', () => {
    const state = quizStateBuilder().withQuestions(1).build();

    const result = calculateAnswerResult(state, 1, state.questions[0].answer);

    expect(result.isCorrect).toBe(true);
    expect(isCompleted(result.newState)).toBe(true);
    expect(calculateQuizProgress(result.newState)).toBe(100);
  });

  it('should handle navigation with all questions solved', () => {
    const state = scenarioBuilder.completedQuiz();
    const nextId = getNextActiveQuestionId(state, 1);

    expect(nextId).toBe(null);
  });
});
