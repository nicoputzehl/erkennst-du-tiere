import { useCallback, useEffect } from 'react';
import { useQuizData } from '../contexts/QuizDataProvider';
import { useQuizState } from '../contexts/QuizStateProvider';
import { isCompleted } from '../utils';
import { useUIStoreBridge } from '../../stores/useUIStoreBridge';

/**
 * Hook der beim Screen-Load prüft, ob bereits abgeschlossene Quizzes
 * Unlocks ausgelöst haben sollten und diese als Pending Unlocks registriert
 */
export function useUnlockDetection() {
  const { getAllQuizzes } = useQuizData();
  const { quizStates } = useQuizState();
  const uiStoreBridge = useUIStoreBridge();
  

  const detectMissedUnlocks = useCallback(() => {
    console.log('[useUnlockDetection] Checking for missed unlocks from completed quizzes');
    
    const allQuizzes = getAllQuizzes();
    let unlocksFound = 0;

    // Gehe durch alle abgeschlossenen Quizzes
    Object.entries(quizStates).forEach(([quizId, quizState]) => {
      if (isCompleted(quizState)) {
        console.log(`[useUnlockDetection] Quiz ${quizId} is completed, checking for unlocks it should trigger`);
        
        // Finde alle Quizzes, die durch dieses abgeschlossene Quiz freigeschaltet werden sollten
        const unlockedQuizzes = allQuizzes.filter(quiz => 
          quiz.initiallyLocked && 
          quiz.unlockCondition && 
          quiz.unlockCondition.requiredQuizId === quizId
        );
        
        unlockedQuizzes.forEach(unlockedQuiz => {
          console.log(`[useUnlockDetection] Quiz "${unlockedQuiz.title}" should be unlocked by completed quiz ${quizId}`);
          uiStoreBridge.addPendingUnlock(unlockedQuiz.id, unlockedQuiz.title);
          unlocksFound++;
        });
      }
    });

    console.log(`[useUnlockDetection] Detection complete - found ${unlocksFound} missed unlocks`);
  }, [getAllQuizzes, quizStates, uiStoreBridge]);

  // Führe Detection beim Mount aus
  useEffect(() => {
    // Kleine Verzögerung damit alle Quiz-States geladen sind
    const timer = setTimeout(() => {
      detectMissedUnlocks();
    }, 100);

    return () => clearTimeout(timer);
  }, [detectMissedUnlocks]);

  return {
    detectMissedUnlocks
  };
}