import { sqliteTable, text, integer, blob, index } from 'drizzle-orm/sqlite-core';
import { sql, relations } from 'drizzle-orm';

export const quizzes = sqliteTable('quizzes', {
  id: text('id').primaryKey(),
  title: text('title').notNull(),
  description: text('description'),
  titleImage: blob('title_image'),
  titleImageType: text('title_image_type'),
  orderIndex: integer('order_index').notNull().default(0),
  initiallyLocked: integer('initially_locked', { mode: 'boolean' }).notNull().default(false),
  initialUnlockedQuestions: integer('initial_unlocked_questions').notNull().default(2),
  createdAt: text('created_at').default(sql`CURRENT_TIMESTAMP`)
}, (table) => [
  index('idx_quizzes_order').on(table.orderIndex)
]);


export const questions = sqliteTable('questions', {
  id: integer('id').primaryKey(),
  quizId: text('quiz_id').notNull().references(() => quizzes.id, { onDelete: 'cascade' }),
  answer: text('answer').notNull(),
  alternativeAnswers: text('alternative_answers'), // JSON string
  funFact: text('fun_fact'),
  wikipediaName: text('wikipedia_name'),
  title: text('title'),
  orderIndex: integer('order_index').notNull(),
  createdAt: text('created_at').default(sql`CURRENT_TIMESTAMP`)
}, (table) => [
  index('idx_questions_quiz_id').on(table.quizId),
  index('idx_questions_order').on(table.quizId, table.orderIndex)
]);


export const questionImages = sqliteTable('question_images', {
  questionId: integer('question_id').primaryKey().references(() => questions.id, { onDelete: 'cascade' }),
  imageData: blob('image_data').notNull(),
  imageType: text('image_type').notNull(),
  thumbnailData: blob('thumbnail_data'),
  thumbnailType: text('thumbnail_type'),
  unsolvedImageData: blob('unsolved_image_data'),
  unsolvedImageType: text('unsolved_image_type'),
  unsolvedThumbnailData: blob('unsolved_thumbnail_data'),
  unsolvedThumbnailType: text('unsolved_thumbnail_type'),
  imageSize: integer('image_size'),
  imageWidth: integer('image_width'),
  imageHeight: integer('image_height'),
  createdAt: text('created_at').default(sql`CURRENT_TIMESTAMP`)
});


export const hintDefinitions = sqliteTable('hint_definitions', {
  id: text('id').primaryKey(),
  questionId: integer('question_id').notNull().references(() => questions.id, { onDelete: 'cascade' }),
  type: text('type').notNull(),
  title: text('title'),
  content: text('content').notNull(),
  cost: integer('cost'),
  triggers: text('triggers'), // JSON string
  triggerAfterAttempts: integer('trigger_after_attempts'),
  triggerSpecificContent: text('trigger_specific_content'),
  createdAt: text('created_at').default(sql`CURRENT_TIMESTAMP`)
}, (table) => [index("idx_hint_definitions_question").on(table.questionId)]);


export const unlockConditions = sqliteTable('unlock_conditions', {
  quizId: text('quiz_id').primaryKey().references(() => quizzes.id, { onDelete: 'cascade' }),
  type: text('type').notNull(),
  requiredQuizId: text('required_quiz_id').notNull().references(() => quizzes.id, { onDelete: 'cascade' }),
  requiredQuestionsSolved: integer('required_questions_solved'),
  description: text('description').notNull()
});


export const quizStates = sqliteTable('quiz_states', {
  quizId: text('quiz_id').primaryKey().references(() => quizzes.id, { onDelete: 'cascade' }),
  completedQuestions: integer('completed_questions').notNull().default(0),
  completedAt: text('completed_at'),
  lastPlayedAt: text('last_played_at').default(sql`CURRENT_TIMESTAMP`)
}, (table) => [index("idx_quiz_states_completed").on(table.completedQuestions)]);


export const questionStates = sqliteTable('question_states', {
  questionId: integer('question_id').primaryKey().references(() => questions.id, { onDelete: 'cascade' }),
  status: text('status').notNull().default('inactive'),
  solvedAt: text('solved_at')
}, (table) => [index("idx_question_states_status").on(table.status)]);


export const hintStates = sqliteTable('hint_states', {
  questionId: integer('question_id').primaryKey().references(() => questions.id, { onDelete: 'cascade' }),
  wrongAttempts: integer('wrong_attempts').notNull().default(0)
});


export const usedHints = sqliteTable('used_hints', {
  id: integer('id').primaryKey({ autoIncrement: true }),
  questionId: integer('question_id').notNull().references(() => questions.id, { onDelete: 'cascade' }),
  hintId: text('hint_id').notNull(),
  hintTitle: text('hint_title').notNull(),
  hintContent: text('hint_content').notNull(),
  usedAt: text('used_at').default(sql`CURRENT_TIMESTAMP`)
}, (table) => [index("idx_used_hints_question").on(table.questionId)]);


export const autoFreeHintsUsed = sqliteTable('auto_free_hints_used', {
  questionId: integer('question_id').notNull().references(() => questions.id, { onDelete: 'cascade' }),
  hintId: text('hint_id').notNull(),
  activatedAt: text('activated_at').default(sql`CURRENT_TIMESTAMP`)
}, (table) => [index("auto_free_hints_used_pk").on(table.questionId, table.hintId)]);


export const pointTransactions = sqliteTable('point_transactions', {
  id: integer('id').primaryKey({ autoIncrement: true }),
  type: text('type').notNull(),
  amount: integer('amount').notNull(),
  reason: text('reason').notNull(),
  quizId: text('quiz_id').references(() => quizzes.id, { onDelete: 'set null' }),
  questionId: integer('question_id').references(() => questions.id, { onDelete: 'set null' }),
  hintId: text('hint_id'),
  createdAt: text('created_at').default(sql`CURRENT_TIMESTAMP`)
}, (table) => [index("idx_point_transactions_date").on(table.createdAt)]);


export const userPoints = sqliteTable('user_points', {
  id: integer('id').primaryKey().default(1),
  totalPoints: integer('total_points').notNull().default(50),
  earnedPoints: integer('earned_points').notNull().default(50),
  spentPoints: integer('spent_points').notNull().default(0),
  lastUpdated: text('last_updated').default(sql`CURRENT_TIMESTAMP`)
});


export const pendingUnlocks = sqliteTable('pending_unlocks', {
  id: integer('id').primaryKey({ autoIncrement: true }),
  quizId: text('quiz_id').notNull().references(() => quizzes.id, { onDelete: 'cascade' }),
  quizTitle: text('quiz_title').notNull(),
  unlockedAt: text('unlocked_at').default(sql`CURRENT_TIMESTAMP`),
  shown: integer('shown', { mode: 'boolean' }).notNull().default(false)
}, (table) => ({
  shownIdx: index('idx_pending_unlocks_shown').on(table.shown)
}));

export const navigationHistory = sqliteTable('navigation_history', {
  id: integer('id').primaryKey({ autoIncrement: true }),
  quizId: text('quiz_id').notNull().references(() => quizzes.id, { onDelete: 'cascade' }),
  visitedAt: text('visited_at').default(sql`CURRENT_TIMESTAMP`)
}, (table) => [index("idx_navigation_history_date").on(table.visitedAt)]);


export const quizzesRelations = relations(quizzes, ({ many, one }) => ({
  questions: many(questions),
  quizState: one(quizStates),
  unlockCondition: one(unlockConditions, {
    fields: [quizzes.id],
    references: [unlockConditions.quizId]
  }),
  requiredByUnlockConditions: many(unlockConditions, {
    relationName: 'requiredQuiz'
  }),
  pointTransactions: many(pointTransactions),
  pendingUnlocks: many(pendingUnlocks),
  navigationHistory: many(navigationHistory)
}));

export const questionsRelations = relations(questions, ({ one, many }) => ({
  quiz: one(quizzes, {
    fields: [questions.quizId],
    references: [quizzes.id]
  }),
  questionImage: one(questionImages),
  questionState: one(questionStates),
  hintState: one(hintStates),
  hintDefinitions: many(hintDefinitions),
  usedHints: many(usedHints),
  autoFreeHintsUsed: many(autoFreeHintsUsed),
  pointTransactions: many(pointTransactions)
}));

export const questionImagesRelations = relations(questionImages, ({ one }) => ({
  question: one(questions, {
    fields: [questionImages.questionId],
    references: [questions.id]
  })
}));

export const hintDefinitionsRelations = relations(hintDefinitions, ({ one }) => ({
  question: one(questions, {
    fields: [hintDefinitions.questionId],
    references: [questions.id]
  })
}));

export const unlockConditionsRelations = relations(unlockConditions, ({ one }) => ({
  quiz: one(quizzes, {
    fields: [unlockConditions.quizId],
    references: [quizzes.id]
  }),
  requiredQuiz: one(quizzes, {
    fields: [unlockConditions.requiredQuizId],
    references: [quizzes.id],
    relationName: 'requiredQuiz'
  })
}));

export const quizStatesRelations = relations(quizStates, ({ one }) => ({
  quiz: one(quizzes, {
    fields: [quizStates.quizId],
    references: [quizzes.id]
  })
}));

export const questionStatesRelations = relations(questionStates, ({ one }) => ({
  question: one(questions, {
    fields: [questionStates.questionId],
    references: [questions.id]
  })
}));

export const hintStatesRelations = relations(hintStates, ({ one }) => ({
  question: one(questions, {
    fields: [hintStates.questionId],
    references: [questions.id]
  })
}));

export const usedHintsRelations = relations(usedHints, ({ one }) => ({
  question: one(questions, {
    fields: [usedHints.questionId],
    references: [questions.id]
  })
}));

export const autoFreeHintsUsedRelations = relations(autoFreeHintsUsed, ({ one }) => ({
  question: one(questions, {
    fields: [autoFreeHintsUsed.questionId],
    references: [questions.id]
  })
}));

export const pointTransactionsRelations = relations(pointTransactions, ({ one }) => ({
  quiz: one(quizzes, {
    fields: [pointTransactions.quizId],
    references: [quizzes.id]
  }),
  question: one(questions, {
    fields: [pointTransactions.questionId],
    references: [questions.id]
  })
}));

export const pendingUnlocksRelations = relations(pendingUnlocks, ({ one }) => ({
  quiz: one(quizzes, {
    fields: [pendingUnlocks.quizId],
    references: [quizzes.id]
  })
}));

export const navigationHistoryRelations = relations(navigationHistory, ({ one }) => ({
  quiz: one(quizzes, {
    fields: [navigationHistory.quizId],
    references: [quizzes.id]
  })
}));

// Type exports
export type Quiz = typeof quizzes.$inferSelect;
export type Question = typeof questions.$inferSelect;
export type QuestionImage = typeof questionImages.$inferSelect;
export type HintDefinition = typeof hintDefinitions.$inferSelect;
export type UnlockCondition = typeof unlockConditions.$inferSelect;
export type QuizState = typeof quizStates.$inferSelect;
export type QuestionState = typeof questionStates.$inferSelect;
export type HintState = typeof hintStates.$inferSelect;
export type UsedHint = typeof usedHints.$inferSelect;
export type AutoFreeHintUsed = typeof autoFreeHintsUsed.$inferSelect;
export type PointTransaction = typeof pointTransactions.$inferSelect;
export type UserPoints = typeof userPoints.$inferSelect;
export type PendingUnlock = typeof pendingUnlocks.$inferSelect;
export type NavigationHistory = typeof navigationHistory.$inferSelect;

// Insert types
export type NewQuiz = typeof quizzes.$inferInsert;
export type NewQuestion = typeof questions.$inferInsert;
export type NewQuestionImage = typeof questionImages.$inferInsert;
export type NewHintDefinition = typeof hintDefinitions.$inferInsert;
export type NewUnlockCondition = typeof unlockConditions.$inferInsert;
export type NewQuizState = typeof quizStates.$inferInsert;
export type NewQuestionState = typeof questionStates.$inferInsert;
export type NewHintState = typeof hintStates.$inferInsert;
export type NewUsedHint = typeof usedHints.$inferInsert;
export type NewAutoFreeHintUsed = typeof autoFreeHintsUsed.$inferInsert;
export type NewPointTransaction = typeof pointTransactions.$inferInsert;
export type NewUserPoints = typeof userPoints.$inferInsert;
export type NewPendingUnlock = typeof pendingUnlocks.$inferInsert;
export type NewNavigationHistory = typeof navigationHistory.$inferInsert;