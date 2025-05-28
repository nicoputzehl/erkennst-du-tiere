// src/quiz/contexts/PersistenceProvider.tsx - Neuer vereinfachter Persistence-Layer
import React, { createContext, useContext, useCallback, ReactNode } from 'react';
import AsyncStorage from '@react-native-async-storage/async-storage';

interface PersistenceContextValue {
  saveQuizStates: (quizStates: Record<string, any>) => Promise<void>;
  loadQuizStates: () => Promise<Record<string, any> | null>;
  clearQuizStates: () => Promise<void>;
  
  saveUIState: (uiState: any) => Promise<void>;
  loadUIState: () => Promise<any | null>;
  clearUIState: () => Promise<void>;
  
  clearAllData: () => Promise<void>;
}

const PersistenceContext = createContext<PersistenceContextValue | null>(null);

// Storage Keys - zentral verwaltet
const STORAGE_KEYS = {
  QUIZ_STATES: 'quiz_states_v3',
  UI_STATE: 'ui_state_v1',
} as const;

interface PersistedData {
  version: number;
  lastUpdated: number;
  data: any;
}

export function PersistenceProvider({ children }: { children: ReactNode }) {
  // Generische Save-Funktion
  const saveData = useCallback(async (key: string, data: any): Promise<void> => {
    try {
      console.log(`[PersistenceProvider] Saving data for key: ${key}`);
      
      const persistedData: PersistedData = {
        version: 1,
        lastUpdated: Date.now(),
        data,
      };
      
      const jsonValue = JSON.stringify(persistedData);
      await AsyncStorage.setItem(key, jsonValue);
      
      console.log(`[PersistenceProvider] Data saved successfully for key: ${key}`);
    } catch (error) {
      console.error(`[PersistenceProvider] Error saving data for key ${key}:`, error);
      throw error;
    }
  }, []);

  // Generische Load-Funktion
  const loadData = useCallback(async (key: string): Promise<any | null> => {
    try {
      console.log(`[PersistenceProvider] Loading data for key: ${key}`);
      
      const jsonValue = await AsyncStorage.getItem(key);
      if (jsonValue === null) {
        console.log(`[PersistenceProvider] No data found for key: ${key}`);
        return null;
      }
      
      const persistedData: PersistedData = JSON.parse(jsonValue);
      
      // Version check für zukünftige Migrationen
      if (persistedData.version !== 1) {
        console.warn(`[PersistenceProvider] Version mismatch for ${key}: ${persistedData.version} vs 1`);
      }
      
      console.log(`[PersistenceProvider] Data loaded successfully for key: ${key}`);
      return persistedData.data;
    } catch (error) {
      console.error(`[PersistenceProvider] Error loading data for key ${key}:`, error);
      return null;
    }
  }, []);

  // Generische Remove-Funktion
  const removeData = useCallback(async (key: string): Promise<void> => {
    try {
      console.log(`[PersistenceProvider] Removing data for key: ${key}`);
      await AsyncStorage.removeItem(key);
      console.log(`[PersistenceProvider] Data removed successfully for key: ${key}`);
    } catch (error) {
      console.error(`[PersistenceProvider] Error removing data for key ${key}:`, error);
      throw error;
    }
  }, []);

  // Quiz States Persistence
  const saveQuizStates = useCallback(async (quizStates: Record<string, any>): Promise<void> => {
    await saveData(STORAGE_KEYS.QUIZ_STATES, quizStates);
  }, [saveData]);

  const loadQuizStates = useCallback(async (): Promise<Record<string, any> | null> => {
    return await loadData(STORAGE_KEYS.QUIZ_STATES);
  }, [loadData]);

  const clearQuizStates = useCallback(async (): Promise<void> => {
    await removeData(STORAGE_KEYS.QUIZ_STATES);
  }, [removeData]);

  // UI State Persistence  
  const saveUIState = useCallback(async (uiState: any): Promise<void> => {
    await saveData(STORAGE_KEYS.UI_STATE, uiState);
  }, [saveData]);

  const loadUIState = useCallback(async (): Promise<any | null> => {
    return await loadData(STORAGE_KEYS.UI_STATE);
  }, [loadData]);

  const clearUIState = useCallback(async (): Promise<void> => {
    await removeData(STORAGE_KEYS.UI_STATE);
  }, [removeData]);

  // Master Clear Function
  const clearAllData = useCallback(async (): Promise<void> => {
    console.log('[PersistenceProvider] Clearing all persisted data');
    
    try {
      await Promise.all([
        clearQuizStates(),
        clearUIState(),
      ]);
      
      console.log('[PersistenceProvider] All data cleared successfully');
    } catch (error) {
      console.error('[PersistenceProvider] Error clearing all data:', error);
      throw error;
    }
  }, [clearQuizStates, clearUIState]);

  const contextValue: PersistenceContextValue = {
    saveQuizStates,
    loadQuizStates,
    clearQuizStates,
    
    saveUIState,
    loadUIState,
    clearUIState,
    
    clearAllData,
  };

  return (
    <PersistenceContext.Provider value={contextValue}>
      {children}
    </PersistenceContext.Provider>
  );
}

export function usePersistence() {
  const context = useContext(PersistenceContext);
  if (!context) {
    throw new Error('usePersistence must be used within a PersistenceProvider');
  }
  return context;
}

export type { PersistenceContextValue };