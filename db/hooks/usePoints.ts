import { useLiveQuery } from "drizzle-orm/expo-sqlite";
import { useCallback } from "react";
import { liveDb } from "../client";
import { PointsOperations } from "../operations";

export function usePoints() {
  const { data: points } = useLiveQuery(
    liveDb.query.userPointsState.findFirst()
  );

  const addPoints = useCallback(async (amount: number, reason: string) => {
    return await PointsOperations.addPoints(amount, reason);
  }, []);

  const deductPoints = useCallback(async (amount: number, reason: string) => {
    return await PointsOperations.deductPoints(amount, reason);
  }, []);

  return {
    totalPoints: points?.totalPoints || 0,
    earnedPoints: points?.earnedPoints || 0,
    spentPoints: points?.spentPoints || 0,
    pointsHistory: points?.pointsHistory || [],

    // Actions
    addPoints,
    deductPoints,
  };
}
