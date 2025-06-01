// src/stores/useQuizComparison.ts
// Hook um alte Provider-Logik mit neuem Store zu vergleichen
import { useEffect, useState } from 'react';
import { useQuizStoreEnhanced } from './QuizStoreProvider';
import { useQuiz } from '@/src/quiz/contexts/QuizProvider'; // Altes System

interface ComparisonResult {
  // Quiz Content
  quizCountMatch: boolean;
  quizIdsMatch: boolean;
  
  // Quiz States
  stateCountMatch: boolean;
  currentQuizMatch: boolean;
  
  // Progress
  progressMatches: Record<string, boolean>;
  
  // Summary
  allMatches: boolean;
  mismatches: string[];
}

export function useQuizComparison() {
  const [comparison, setComparison] = useState<ComparisonResult | null>(null);
  
  // Neues System
  const newStore = useQuizStoreEnhanced();
  
  // Altes System
  const oldSystem = useQuiz();

  useEffect(() => {
    if (!newStore.isInitialized) return;

    try {
      const newQuizzes = newStore.getAllQuizzes();

      
      const newStates = Object.keys(newStore.quizStates);
      // Für altes System - verwende verfügbare Methoden
      const oldQuizzes = oldSystem.getAllQuizzes();
      // Versuche alle Quiz-IDs zu sammeln um States zu schätzen
      const oldStates = oldQuizzes.map(q => q.id).filter(id => {
        try {
          const state = oldSystem.getQuizState(id);
          return !!state;
        } catch {
          return false;
        }
      });
      
      // Quiz Content Vergleich
      const quizCountMatch = newQuizzes.length === oldQuizzes.length;
      const newQuizIds = new Set(newQuizzes.map(q => q.id));
      const oldQuizIds = new Set(oldQuizzes.map(q => q.id));
      const quizIdsMatch = newQuizIds.size === oldQuizIds.size && 
        [...newQuizIds].every(id => oldQuizIds.has(id));
      
      // Quiz State Vergleich
      const stateCountMatch = newStates.length === oldStates.length;
      const currentQuizMatch = newStore.currentQuizId === oldSystem.currentQuizId;
      
      // Progress Vergleich
      const progressMatches: Record<string, boolean> = {};
      const allQuizIds = [...new Set([...newQuizIds, ...oldQuizIds])];
      
      allQuizIds.forEach(quizId => {
        const newProgress = newStore.getQuizProgress(quizId);
        const oldProgress = oldSystem.getQuizProgress(quizId);
        progressMatches[quizId] = newProgress === oldProgress;
      });
      
      // Sammle Mismatches
      const mismatches: string[] = [];
      if (!quizCountMatch) mismatches.push(`Quiz count: ${newQuizzes.length} vs ${oldQuizzes.length}`);
      if (!quizIdsMatch) mismatches.push('Quiz IDs unterschiedlich');
      if (!stateCountMatch) mismatches.push(`State count: ${newStates.length} vs ${oldStates.length}`);
      if (!currentQuizMatch) mismatches.push(`Current quiz: ${newStore.currentQuizId} vs ${oldSystem.currentQuizId}`);
      
      Object.entries(progressMatches).forEach(([quizId, matches]) => {
        if (!matches) {
          const newProg = newStore.getQuizProgress(quizId);
          const oldProg = oldSystem.getQuizProgress(quizId);
          mismatches.push(`Progress ${quizId}: ${newProg}% vs ${oldProg}%`);
        }
      });
      
      const allMatches = mismatches.length === 0;
      
      setComparison({
        quizCountMatch,
        quizIdsMatch,
        stateCountMatch,
        currentQuizMatch,
        progressMatches,
        allMatches,
        mismatches
      });
      
      if (__DEV__) {
        console.log('[QuizComparison] Comparison result:', {
          allMatches,
          mismatches,
          newQuizzesCount: newQuizzes.length,
          oldQuizzesCount: oldQuizzes.length,
          newStatesCount: newStates.length,
          oldStatesCount: oldStates.length
        });
      }
    } catch (error) {
      console.error('[QuizComparison] Error during comparison:', error);
    }
  }, [newStore.isInitialized, newStore, oldSystem]);

  return comparison;
}

// Test-Hook für spezifische Quiz-Operations
export function useQuizOperationComparison() {
  const newStore = useQuizStoreEnhanced();
  const oldSystem = useQuiz();
  
  return {
    // Test Answer Submission
    testAnswerSubmission: async (quizId: string, questionId: number, answer: string) => {
      if (__DEV__) {
        console.log('[OperationComparison] Testing answer submission...');
        
        // Beide Systeme sollten gleich reagieren
        const newResult = newStore.submitAnswer(quizId, questionId, answer);
        
        try {
          const oldResult = await oldSystem.answerQuizQuestion(quizId, questionId, answer);
          
          const matches = newResult.isCorrect === oldResult.isCorrect;
          
          console.log('[OperationComparison] Answer comparison:', {
            matches,
            newCorrect: newResult.isCorrect,
            oldCorrect: oldResult.isCorrect,
            newCompleted: newResult.wasCompleted,
            oldCompleted: oldResult.newState ? oldSystem.isQuizCompleted(quizId) : false
          });
          
          return { matches, newResult, oldResult };
        } catch (error) {
          console.warn('[OperationComparison] Could not test old system:', error);
          return { matches: null, newResult, oldResult: null };
        }
      }
      
      return { matches: true, newResult: newStore.submitAnswer(quizId, questionId, answer), oldResult: null };
    },
    
    // Test Quiz Progress
    testProgressCalculation: (quizId: string) => {
      const newProgress = newStore.getQuizProgress(quizId);
      const oldProgress = oldSystem.getQuizProgress(quizId);
      const matches = newProgress === oldProgress;
      
      if (__DEV__) {
        console.log('[OperationComparison] Progress comparison:', {
          quizId,
          matches,
          newProgress,
          oldProgress
        });
      }
      
      return { matches, newProgress, oldProgress };
    }
  };
}