import {
  sqliteTable,
  text,
  integer,
  index,
} from 'drizzle-orm/sqlite-core';
import { relations } from 'drizzle-orm';

export enum QuestionStatus {
  INACTIVE = "inactive",
  ACTIVE = "active",
  SOLVED = "solved",
}

export enum HintType {
  LETTER_COUNT = "letter_count",
  FIRST_LETTER = "first_letter",
  CUSTOM = "custom",
  CONTEXTUAL = "contextual",
  AUTO_FREE = "auto_free",
}

export interface QuizImages {
  imageUrl: number;
  thumbnailUrl?: number;
  unsolvedImageUrl?: number;
  unsolvedThumbnailUrl?: number;
}

export interface PlaythroughCondition {
  type: "playthrough";
  requiredQuizId: string;
  description: string;
}

export interface ProgressCondition {
  type: "progress";
  requiredQuizId: string;
  requiredQuestionsSolved: number;
  description: string;
}

export type UnlockCondition = PlaythroughCondition | ProgressCondition;

export interface ToastState {
  visible: boolean;
  message: string;
  type: "success" | "error" | "info" | "warning";
  duration?: number;
}

export interface PendingUnlock {
  quizId: string;
  quizTitle: string;
  unlockedAt: number;
  shown: boolean;
}

export interface UsedHint {
  id: string;
  title: string;
  content: string;
}

export interface PointTransaction {
  id: string;
  type: "earned" | "spent";
  amount: number;
  reason: string;
  timestamp: number;
  questionId?: number;
  hintId?: string;
  quizId?: string;
}

export const quiz = sqliteTable('quiz', {
  id: text('id').primaryKey(),
  title: text('title').notNull(),
  description: text('description'),
  titleImage: integer('title_image'),
  createdAt: integer('created_at', { mode: 'timestamp' }).$default(() => new Date()),
  updatedAt: integer('updated_at', { mode: 'timestamp' }).$default(() => new Date()).$onUpdateFn(() => new Date()),
});


export const quizConfig = sqliteTable('quiz_config', {
  id: text('id').primaryKey().references(() => quiz.id, { onDelete: 'cascade' }),
  initiallyLocked: integer('initially_locked', { mode: 'boolean' }).default(false),
  unlockCondition: text('unlock_condition', { mode: 'json' }).$type<UnlockCondition>(),
  order: integer('order').default(1),
  initialUnlockedQuestions: integer('initial_unlocked_questions').default(2),
}, (table) => [
  index('quiz_config_order_idx').on(table.order),
]);

export const questions = sqliteTable('questions', {
  id: integer('id').primaryKey(),
  quizId: text('quiz_id').notNull().references(() => quiz.id, { onDelete: 'cascade' }),
  images: text('images', { mode: 'json' }).$type<QuizImages>().notNull(),
  answer: text('answer').notNull(),
  alternativeAnswers: text('alternative_answers', { mode: 'json' }).$type<string[]>(),
  funFact: text('fun_fact'),
  wikipediaName: text('wikipedia_name'),
  title: text('title'),
  customHints: text('custom_hints', { mode: 'json' }).$type<any[]>().default([]),
  contextualHints: text('contextual_hints', { mode: 'json' }).$type<any[]>().default([]),
  autoFreeHints: text('auto_free_hints', { mode: 'json' }).$type<any[]>().default([]),
}, (table) => [index("questions_quiz_idx").on(table.quizId)]);


export const quizState = sqliteTable('quiz_state', {
  quizId: text('quiz_id').primaryKey().references(() => quiz.id, { onDelete: 'cascade' }),
  title: text('title').notNull(),
  completedQuestions: integer('completed_questions').default(0),
  createdAt: integer('created_at', { mode: 'timestamp' }).$default(() => new Date()),
  updatedAt: integer('updated_at', { mode: 'timestamp' }).$default(() => new Date()).$onUpdateFn(() => new Date()),
});

export const questionState = sqliteTable('question_state', {
  questionId: integer('question_id').primaryKey().references(() => questions.id, { onDelete: 'cascade' }),
  quizId: text('quiz_id').notNull().references(() => quiz.id, { onDelete: 'cascade' }),
  status: text('status').$type<QuestionStatus>().notNull().default(QuestionStatus.INACTIVE),
}, (table) => ({
  quizIdx: index('question_state_quiz_idx').on(table.quizId),
}));

export const hintState = sqliteTable('hint_state', {
  questionId: integer('question_id').primaryKey().references(() => questions.id, { onDelete: 'cascade' }),
  usedHints: text('used_hints', { mode: 'json' }).$type<UsedHint[]>().default([]),
  wrongAttempts: integer('wrong_attempts').default(0),
  autoFreeHintsUsed: text('auto_free_hints_used', { mode: 'json' }).$type<string[]>().default([]),
});

export const userPointsState = sqliteTable('user_points_state', {
  id: integer('id').primaryKey({ autoIncrement: true }), // Singleton table
  totalPoints: integer('total_points').default(50),
  earnedPoints: integer('earned_points').default(50),
  spentPoints: integer('spent_points').default(0),
  pointsHistory: text('points_history', { mode: 'json' }).$type<PointTransaction[]>().default([]),
  updatedAt: integer('updated_at', { mode: 'timestamp' }).$default(() => new Date()).$onUpdateFn(() => new Date()),
});

export const uiState = sqliteTable('ui_state', {
  id: integer('id').primaryKey({ autoIncrement: true }), // Singleton table
  currentQuizId: text('current_quiz_id').references(() => quiz.id),
  isLoading: integer('is_loading', { mode: 'boolean' }).default(false),
  loadingOperations: text('loading_operations', { mode: 'json' }).$type<string[]>().default([]),
  toast: text('toast', { mode: 'json' }).$type<ToastState>(),
  navigationHistory: text('navigation_history', { mode: 'json' }).$type<string[]>().default([]),
  pendingUnlocks: text('pending_unlocks', { mode: 'json' }).$type<PendingUnlock[]>().default([]),
  updatedAt: integer('updated_at', { mode: 'timestamp' }).$default(() => new Date()).$onUpdateFn(() => new Date()),
});

export const quizRelations = relations(quiz, ({ one, many }) => ({
  config: one(quizConfig),
  questions: many(questions),
  state: one(quizState),
}));

export const quizConfigRelations = relations(quizConfig, ({ one }) => ({
  quiz: one(quiz, {
    fields: [quizConfig.id],
    references: [quiz.id],
  }),
}));

export const questionsRelations = relations(questions, ({ one }) => ({
  quiz: one(quiz, {
    fields: [questions.quizId],
    references: [quiz.id],
  }),
  state: one(questionState),
  hintState: one(hintState),
}));

export const quizStateRelations = relations(quizState, ({ one, many }) => ({
  quiz: one(quiz, {
    fields: [quizState.quizId],
    references: [quiz.id],
  }),
  questions: many(questionState),
}));

export const questionStateRelations = relations(questionState, ({ one }) => ({
  quiz: one(quiz, {
    fields: [questionState.quizId],
    references: [quiz.id],
  }),
  question: one(questions, {
    fields: [questionState.questionId],
    references: [questions.id],
  }),
  hintState: one(hintState, {
    fields: [questionState.questionId],
    references: [hintState.questionId],
  }),
}));

export const hintStateRelations = relations(hintState, ({ one }) => ({
  question: one(questions, {
    fields: [hintState.questionId],
    references: [questions.id],
  }),
}));

export const uiStateRelations = relations(uiState, ({ one }) => ({
  currentQuiz: one(quiz, {
    fields: [uiState.currentQuizId],
    references: [quiz.id],
  }),
}));

export type Quiz = typeof quiz.$inferSelect;
export type QuizConfig = typeof quizConfig.$inferSelect;
export type Question = typeof questions.$inferSelect;
export type QuizState = typeof quizState.$inferSelect;
export type QuestionState = typeof questionState.$inferSelect;
export type HintState = typeof hintState.$inferSelect;
export type UserPointsState = typeof userPointsState.$inferSelect;
export type UiState = typeof uiState.$inferSelect;

export type InsertQuiz = typeof quiz.$inferInsert;
export type InsertQuizConfig = typeof quizConfig.$inferInsert;
export type InsertQuestion = typeof questions.$inferInsert;
export type InsertQuizState = typeof quizState.$inferInsert;
export type InsertQuestionState = typeof questionState.$inferInsert;
export type InsertHintState = typeof hintState.$inferInsert;

