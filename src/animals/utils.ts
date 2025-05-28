import { createQuiz, createUnlockCondition } from '../quiz/utils';
import { Question, Quiz } from '../quiz/types';

export function createSimpleAnimalQuiz(
  id: string,
  title: string,
  questions: Question[]
): Quiz {
  return createQuiz({
    id,
    title,
    questions,
    order: 1,
    initiallyLocked: false,
  });
}

export function createLockedAnimalQuiz(
  id: string,
  title: string,
  questions: Question[],
  requiredQuizId: string,
  order: number = 1,
  requiredDescription?: string
): Quiz {
  return createQuiz({
    id,
    title,
    questions,
    order,
    initiallyLocked: true,
    unlockCondition: createUnlockCondition(
      requiredQuizId,
      requiredDescription
    )
  });
}
