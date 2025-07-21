import { useLiveQuery } from 'drizzle-orm/expo-sqlite';
import { liveDb } from '../client';
import { useCallback, useMemo } from 'react';
import { eq } from 'drizzle-orm';
import { QuizOperations, HintOperations } from '../operations';
import * as schema from '../schema';



export function useHints(quizId: string, questionId: number) {
  // Live query für hint state
  const { data: hintState } = useLiveQuery(
    liveDb.query.hintState.findFirst({
      where: eq(schema.hintState.questionId, questionId)
    })
  );

  // Live query für question
  const { data: question } = useLiveQuery(
    liveDb.query.questions.findFirst({
      where: eq(schema.questions.id, questionId)
    })
  );

  // Live query für user points
  const { data: userPoints } = useLiveQuery(
    liveDb.query.userPointsState.findFirst()
  );

  const availableHints = useMemo(() => {
    if (!question) return [];

    const allHints = [
      ...question.customHints || [],
      ...question.contextualHints || [],
      ...question.autoFreeHints || [],
      ...HintOperations.generateStandardHints(question),
    ];

    return allHints.map(hint => ({
      hint,
      canUse: !((hintState?.usedHints ?? []).some(h => h.id === hint.id)) &&
        (hint.cost === 0 || (userPoints?.totalPoints || 0) >= hint.cost),
    }));
  }, [question, hintState, userPoints]);

  const handleUseHint = useCallback(async (hintId: string) => {
    return await HintOperations.applyHint(questionId, hintId);
  }, [questionId]);

  const handleWrongAnswer = useCallback(async () => {
    return await QuizOperations.recordWrongAnswer(questionId);
  }, [questionId]);

  return {
    availableHints,
    usedHints: hintState?.usedHints || [],
    wrongAttempts: hintState?.wrongAttempts || 0,
    pointsBalance: userPoints?.totalPoints || 0,

    // Actions
    handleUseHint,
    handleWrongAnswer,
  };
}
