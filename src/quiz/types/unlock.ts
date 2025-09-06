export interface BaseUnlockCondition {
  type: string;
  description: string;
}

export interface PlaythroughCondition extends BaseUnlockCondition {
  type: "playthrough";
  requiredQuizId: string;
}

export interface MultiplePlaythroughCondition extends BaseUnlockCondition {
  type: "multipleplaythrough";
  requiredQuizId: string[];
}

export interface ProgressCondition extends BaseUnlockCondition {
  type: "progress";
  requiredQuizId: string;
  requiredQuestionsSolved: number;
}

export type MultipleUnlockConditions = MultiplePlaythroughCondition;
export type SingleUnlockCondition = PlaythroughCondition | ProgressCondition;
export type UnlockCondition = SingleUnlockCondition | MultipleUnlockConditions;

export interface UnlockConditionProgress {
  condition: UnlockCondition;
  currentProgress: number;
  isMet: boolean;
}

export function hasMultipleQuizIds(condition: UnlockCondition): condition is MultipleUnlockConditions {
  return Array.isArray(condition.requiredQuizId);
}

export function isQuizPlaythroughCondition(
  condition: UnlockCondition
): condition is PlaythroughCondition {
  return !hasMultipleQuizIds(condition) && condition.type === "playthrough";
}

export function isQuizProgressCondition(
  condition: UnlockCondition
): condition is ProgressCondition {
  return !hasMultipleQuizIds(condition) && condition.type === "progress";
}

export function isMultiplePlaythroughCondition(
  condition: UnlockCondition
): condition is MultiplePlaythroughCondition {
  return hasMultipleQuizIds(condition) && condition.type === "multipleplaythrough";
}

// export function isAnotherFutureCondition(
//   condition: UnlockCondition
// ): condition is AnotherFutureCondition {
//   return condition.type === "anotherFutureCondition";
// }