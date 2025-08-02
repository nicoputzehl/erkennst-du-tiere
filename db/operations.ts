import { eq, and, asc, isNotNull } from 'drizzle-orm';
import { db } from './client';
import * as schema from './schema';
import { QuizUtils } from '@/src/quiz/domain/quiz';

export const QuizOperations = {
  // Quiz Registration (entspricht registerQuiz aus Store)
  async registerQuiz(quizData: {
    quiz: schema.InsertQuiz;
    config: Omit<schema.InsertQuizConfig, 'id'>;
    questions: schema.InsertQuestion[];
  }) {
    return await db.transaction(async (tx) => {
      const [quiz] = await tx.insert(schema.quiz).values(quizData.quiz).returning();

      await tx.insert(schema.quizConfig).values({
        ...quizData.config,
        id: quiz.id,
      });

      if (quizData.questions.length > 0) {
        await tx.insert(schema.questions).values(
          quizData.questions.map(q => ({ ...q, quizId: quiz.id }))
        );
      }

      return quiz;
    });
  },

  // Quiz State Initialization (entspricht initializeQuizState)
  async initializeQuizState(quizId: string) {
    const quiz = await db.query.quiz.findFirst({
      where: eq(schema.quiz.id, quizId),
      with: { config: true, questions: true },
    });

    if (!quiz) return null;

    // Check if already initialized
    const existingState = await db.query.quizState.findFirst({
      where: eq(schema.quizState.quizId, quizId)
    });

    if (existingState) return existingState;

    return await db.transaction(async (tx) => {
      // Create quiz state
      const [quizStateResult] = await tx.insert(schema.quizState).values({
        quizId,
        title: quiz.title,
        completedQuestions: 0,
      }).returning();

      // Initialize question states
      const questionStates = quiz.questions.map((question, index) => ({
        questionId: question.id,
        quizId,
        status: index < (quiz.config?.initialUnlockedQuestions || 2)
          ? schema.QuestionStatus.ACTIVE
          : schema.QuestionStatus.INACTIVE,
      }));

      if (questionStates.length > 0) {
        await tx.insert(schema.questionState).values(questionStates);
      }

      // Initialize hint states
      const hintStates = quiz.questions.map(question => ({
        questionId: question.id,
        usedHints: [],
        wrongAttempts: 0,
        autoFreeHintsUsed: [],
      }));

      if (hintStates.length > 0) {
        await tx.insert(schema.hintState).values(hintStates);
      }

      return quizStateResult;
    });
  },

  // Answer Question (entspricht answerQuestion aus Store)
  async answerQuestion(quizId: string, questionId: number, answer: string) {
    // Ihre bestehende isAnswerCorrect Logik hier verwenden
    const question = await db.query.questions.findFirst({
      where: eq(schema.questions.id, questionId)
    });

    if (!question) {
      return { isCorrect: false, unlockedQuizzes: [], completedQuiz: false };
    }

    // Hier Ihre bestehende Antwort-Validierung einsetzen
    const isCorrect = QuizUtils.isAnswerCorrect(
      answer,
      question.answer,
      question.alternativeAnswers
    )

    if (!isCorrect) {
      await this.recordWrongAnswer(questionId);
      return { isCorrect: false, unlockedQuizzes: [], completedQuiz: false };
    }

    return await db.transaction(async (tx) => {
      // Mark question as solved
      await tx.update(schema.questionState)
        .set({ status: schema.QuestionStatus.SOLVED })
        .where(eq(schema.questionState.questionId, questionId));

      // Update quiz progress
      const quizState = await tx.query.quizState.findFirst({
        where: eq(schema.quizState.quizId, quizId)
      });

      const newCompletedCount = (quizState?.completedQuestions || 0) + 1;

      await tx.update(schema.quizState)
        .set({
          completedQuestions: newCompletedCount,
          updatedAt: new Date()
        })
        .where(eq(schema.quizState.quizId, quizId));

      // Award points
      await PointsOperations.addPoints(10, "Correct answer", quizId, questionId);

      // Activate next inactive question
      const nextInactive = await tx.query.questionState.findFirst({
        where: and(
          eq(schema.questionState.quizId, quizId),
          eq(schema.questionState.status, schema.QuestionStatus.INACTIVE)
        ),
        orderBy: [asc(schema.questionState.questionId)],
      });

      if (nextInactive) {
        await tx.update(schema.questionState)
          .set({ status: schema.QuestionStatus.ACTIVE })
          .where(eq(schema.questionState.questionId, nextInactive.questionId));
      }

      // Check for unlocks
      const unlockedQuizzes = await UnlockOperations.checkForUnlocks();

      const quiz = await tx.query.quiz.findFirst({
        where: eq(schema.quiz.id, quizId),
        with: { questions: true }
      });

      return {
        isCorrect: true,
        unlockedQuizzes,
        completedQuiz: newCompletedCount === quiz?.questions?.length,
      };
    });
  },

  async recordWrongAnswer(questionId: number) {
    const hintState = await db.query.hintState.findFirst({
      where: eq(schema.hintState.questionId, questionId)
    });

    if (hintState) {
      await db.update(schema.hintState)
        .set({ wrongAttempts: hintState.wrongAttempts === null ? 1 : hintState.wrongAttempts + 1 })
        .where(eq(schema.hintState.questionId, questionId));
    }
  },

  // Get all quizzes with state
  async getAllQuizzesWithState() {
    return await db.query.quiz.findMany({
      with: {
        config: true,
        questions: {
          with: {
            state: true,
          },
        },
        state: true,
      },
      orderBy: [asc(schema.quiz.createdAt)],
    });
  },

  // Get specific quiz state (entspricht getQuizState)
  async getQuizState(quizId: string) {
    return await db.query.quizState.findFirst({
      where: eq(schema.quizState.quizId, quizId),
      with: {
        quiz: {
          with: {
            questions: {
              with: {
                state: true,
                hintState: true,
              },
            },
          },
        },
      },
    });
  },
};

export const PointsOperations = {
  // Initialize points (entspricht getInitialUserPoints)
  async initializePoints() {
    // Check if already initialized
    const existing = await db.query.userPointsState.findFirst();
    if (existing) return existing;

    const initialTransaction: schema.PointTransaction = {
      id: `${Date.now()}_${Math.random()}`,
      type: "earned",
      amount: 50,
      reason: "Startguthaben",
      timestamp: Date.now(),
    };

    const [result] = await db.insert(schema.userPointsState).values({
      totalPoints: 50,
      earnedPoints: 50,
      spentPoints: 0,
      pointsHistory: [initialTransaction],
    }).returning();

    return result;
  },

  async addPoints(amount: number, reason: string, quizId?: string, questionId?: number, hintId?: string) {
    const transaction: schema.PointTransaction = {
      id: `${Date.now()}_${Math.random()}`,
      type: "earned",
      amount,
      reason,
      timestamp: Date.now(),
      quizId,
      questionId,
      hintId,
    };

    const currentPoints = await db.query.userPointsState.findFirst();

    return await db.update(schema.userPointsState)
      .set({
        totalPoints: (currentPoints?.totalPoints || 0) + amount,
        earnedPoints: (currentPoints?.earnedPoints || 0) + amount,
        pointsHistory: [...(currentPoints?.pointsHistory || []), transaction],
        updatedAt: new Date(),
      })
      .where(eq(schema.userPointsState.id, currentPoints?.id || 1));
  },

  async deductPoints(amount: number, reason: string, quizId?: string, questionId?: number, hintId?: string) {
    const transaction: schema.PointTransaction = {
      id: `${Date.now()}_${Math.random()}`,
      type: "spent",
      amount,
      reason,
      timestamp: Date.now(),
      quizId,
      questionId,
      hintId,
    };

    const currentPoints = await db.query.userPointsState.findFirst();

    return await db.update(schema.userPointsState)
      .set({
        totalPoints: (currentPoints?.totalPoints || 0) - amount,
        spentPoints: (currentPoints?.spentPoints || 0) + amount,
        pointsHistory: [...(currentPoints?.pointsHistory || []), transaction],
        updatedAt: new Date(),
      })
      .where(eq(schema.userPointsState.id, currentPoints?.id || 1));
  },

  async getPointsBalance(): Promise<number> {
    const points = await db.query.userPointsState.findFirst();
    return points?.totalPoints || 0;
  },
};

export const HintOperations = {
  async applyHint(questionId: number, hintId: string) {
    return await db.transaction(async (tx) => {
      const question = await tx.query.questions.findFirst({
        where: eq(schema.questions.id, questionId)
      });

      if (!question) {
        return { success: false, error: "Question not found" };
      }

      // Generate all hints for this question
      const allHints = [
        ...question.customHints || [],
        ...question.contextualHints || [],
        ...question.autoFreeHints || [],
        ...this.generateStandardHints(question),
      ];

      const hint = allHints.find(h => h.id === hintId);
      if (!hint) {
        return { success: false, error: "Hint not found" };
      }

      // Validate hint usage
      const canUse = await this.canUseHint(hint, questionId);
      if (!canUse.success) {
        return { success: false, error: canUse.reason };
      }

      // Add to used hints
      const currentHintState = await tx.query.hintState.findFirst({
        where: eq(schema.hintState.questionId, questionId)
      });

      if (!currentHintState) {
        return { success: false, error: "Hint state not found" };
      }

      const usedHint: schema.UsedHint = {
        id: hint.id,
        title: hint.title,
        content: hint.content,
      };

      await tx.update(schema.hintState)
        .set({
          usedHints: [...currentHintState.usedHints || [], usedHint],
          ...(hint.type === 'auto_free' && {
            autoFreeHintsUsed: [...currentHintState.autoFreeHintsUsed || [], hint.id]
          })
        })
        .where(eq(schema.hintState.questionId, questionId));

      // Deduct points if needed
      if (hint.cost > 0) {
        await PointsOperations.deductPoints(
          hint.cost,
          `Hint verwendet: ${hint.title}`,
          undefined,
          questionId,
          hintId
        );
      }

      return {
        success: true,
        hintContent: hint.content,
        pointsDeducted: hint.cost || 0,
      };
    });
  },

  generateStandardHints(question: any) {
    return [
      {
        id: `${question.id}_letter_count`,
        type: 'letter_count',
        title: 'Buchstabenanzahl',
        content: `Das gesuchte Tier hat ${question.answer.length} Buchstaben`,
        cost: 5,
      },
      {
        id: `${question.id}_first_letter`,
        type: 'first_letter',
        title: 'Erster Buchstabe',
        content: `Das gesuchte Tier beginnt mit "${question.answer[0].toUpperCase()}"`,
        cost: 10,
      }
    ];
  },

  async canUseHint(hint: any, questionId: number) {
    const hintState = await db.query.hintState.findFirst({
      where: eq(schema.hintState.questionId, questionId)
    });

    const userPoints = await db.query.userPointsState.findFirst();

    // Already used?
    if ((hintState?.usedHints ?? []).some(h => h.id === hint.id)) {
      return { success: false, reason: "Hint bereits verwendet" };
    }

    // Auto-free hint validation
    if (hint.type === 'auto_free') {
      if (hintState && (hintState.wrongAttempts ?? 0) < hint.triggerAfterAttempts) {
        return { success: false, reason: `Erst nach ${hint.triggerAfterAttempts} falschen Versuchen` };
      }
    }

    // Points validation
    if (hint.cost > 0 && (!userPoints?.totalPoints || userPoints.totalPoints < hint.cost)) {
      return { success: false, reason: "Nicht genug Punkte" };
    }

    return { success: true };
  },
};

export const UnlockOperations = {
  async checkForUnlocks() {
    const configs = await db.query.quizConfig.findMany({
      where: isNotNull(schema.quizConfig.unlockCondition),
      with: { quiz: true },
    });

    const unlockedQuizzes = [];

    for (const config of configs) {
      if (!config.unlockCondition) continue;

      const isUnlocked = await this.isUnlockConditionMet(config.unlockCondition);

      if (isUnlocked) {
        // Check if already in pending unlocks
        const uiState = await db.query.uiState.findFirst();
        const alreadyUnlocked = uiState?.pendingUnlocks?.some(
          unlock => unlock.quizId === config.id
        );

        if (!alreadyUnlocked) {
          unlockedQuizzes.push(config.quiz);
          await UIOperations.addPendingUnlock(config.id, config.quiz.title);
        }
      }
    }

    return unlockedQuizzes;
  },

  async isUnlockConditionMet(condition: schema.UnlockCondition): Promise<boolean> {
    if (condition.type === 'playthrough') {
      const quizState = await db.query.quizState.findFirst({
        where: eq(schema.quizState.quizId, condition.requiredQuizId),
        with: {
          quiz: {
            with: { questions: true },
          },
        },
      });

      return quizState ?
        quizState.completedQuestions === quizState.quiz.questions.length :
        false;
    }

    if (condition.type === 'progress') {
      const quizState = await db.query.quizState.findFirst({
        where: eq(schema.quizState.quizId, condition.requiredQuizId)
      });

      return quizState ?
        !!quizState.completedQuestions && quizState.completedQuestions >= condition.requiredQuestionsSolved :
        false;
    }

    return false;
  },
};

export const UIOperations = {
  async setCurrentQuiz(quizId: string | null) {
    const existing = await db.query.uiState.findFirst();

    if (existing) {
      return await db.update(schema.uiState)
        .set({
          currentQuizId: quizId,
          updatedAt: new Date(),
        })
        .where(eq(schema.uiState.id, existing.id));
    }
    return await db.insert(schema.uiState).values({
      currentQuizId: quizId,
    });

  },

  async addToNavigationHistory(quizId: string) {
    const existing = await db.query.uiState.findFirst();
    const currentHistory = existing?.navigationHistory || [];
    const newHistory = [quizId, ...currentHistory.filter(id => id !== quizId)].slice(0, 10);

    if (existing) {
      return await db.update(schema.uiState)
        .set({
          navigationHistory: newHistory,
          updatedAt: new Date(),
        })
        .where(eq(schema.uiState.id, existing.id));
    }
    return await db.insert(schema.uiState).values({
      navigationHistory: newHistory,
    });

  },

  async addPendingUnlock(quizId: string, quizTitle: string) {
    const existing = await db.query.uiState.findFirst();
    const pendingUnlocks = existing?.pendingUnlocks || [];

    // Check if already exists
    if (pendingUnlocks.some(unlock => unlock.quizId === quizId)) {
      return;
    }

    const newUnlock: schema.PendingUnlock = {
      quizId,
      quizTitle,
      unlockedAt: Date.now(),
      shown: false,
    };

    if (existing) {
      return await db.update(schema.uiState)
        .set({
          pendingUnlocks: [...pendingUnlocks, newUnlock],
          updatedAt: new Date(),
        })
        .where(eq(schema.uiState.id, existing.id));
    }
    return await db.insert(schema.uiState).values({
      pendingUnlocks: [newUnlock],
    });

  },

  async getUiState() {
    let uiState = await db.query.uiState.findFirst();

    // Initialize if not exists
    if (!uiState) {
      const [newState] = await db.insert(schema.uiState).values({}).returning();
      uiState = newState;
    }

    return uiState;
  },
};
