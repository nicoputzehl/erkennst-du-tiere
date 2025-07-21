import { useLiveQuery } from "drizzle-orm/expo-sqlite";
import { useCallback } from "react";
import { liveDb } from "../client";
import { UIOperations } from "../operations";

export function useUI() {
  const { data: uiState } = useLiveQuery(
    liveDb.query.uiState.findFirst()
  );

  const setCurrentQuiz = useCallback(async (quizId: string | null) => {
    await UIOperations.setCurrentQuiz(quizId);
  }, []);

  const addToNavigationHistory = useCallback(async (quizId: string) => {
    await UIOperations.addToNavigationHistory(quizId);
  }, []);

  return {
    currentQuizId: uiState?.currentQuizId,
    navigationHistory: uiState?.navigationHistory || [],
    pendingUnlocks: uiState?.pendingUnlocks || [],

    // Actions
    setCurrentQuiz,
    addToNavigationHistory,
  };
}