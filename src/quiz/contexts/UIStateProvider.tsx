import React, { createContext, useContext, useState, useCallback, ReactNode } from 'react';
import { Toast, ToastProps } from '../components/Toast';

interface UIState {
  isGlobalLoading: boolean;
  loadingOperations: Set<string>;
  
  toastVisible: boolean;
  toastData: Omit<ToastProps, 'visible' | 'onHide'> | null;
  
  lastNavigatedQuizId: string | null;
  navigationHistory: string[];
}

interface UIStateContextValue {
  isGlobalLoading: boolean;
  isOperationLoading: (operation: string) => boolean;
  startLoading: (operation?: string) => void;
  stopLoading: (operation?: string) => void;
  
  showToast: (message: string, type?: 'success' | 'error' | 'info' | 'warning', duration?: number) => void;
  showSuccessToast: (message: string, duration?: number) => void;
  showErrorToast: (message: string, duration?: number) => void;
  showInfoToast: (message: string, duration?: number) => void;
  showWarningToast: (message: string, duration?: number) => void;
  hideToast: () => void;
  
  lastNavigatedQuizId: string | null;
  navigationHistory: string[];
  trackNavigation: (quizId: string) => void;
  clearNavigationHistory: () => void;
}

const UIStateContext = createContext<UIStateContextValue | null>(null);

export function UIStateProvider({ children }: { children: ReactNode }) {
  const [uiState, setUIState] = useState<UIState>({
    isGlobalLoading: false,
    loadingOperations: new Set(),
    toastVisible: false,
    toastData: null,
    lastNavigatedQuizId: null,
    navigationHistory: [],
  });

  const updateUIState = useCallback((updater: (prev: UIState) => UIState) => {
    setUIState(updater);
  }, []);

  const startLoading = useCallback((operation: string = 'global') => {
    updateUIState(prev => {
      const newOperations = new Set(prev.loadingOperations);
      newOperations.add(operation);
      
      return {
        ...prev,
        loadingOperations: newOperations,
        isGlobalLoading: operation === 'global' || prev.isGlobalLoading,
      };
    });
  }, [updateUIState]);

  const stopLoading = useCallback((operation: string = 'global') => {
    updateUIState(prev => {
      const newOperations = new Set(prev.loadingOperations);
      newOperations.delete(operation);
      
      return {
        ...prev,
        loadingOperations: newOperations,
        isGlobalLoading: operation === 'global' ? false : prev.isGlobalLoading,
      };
    });
  }, [updateUIState]);

  const isOperationLoading = useCallback((operation: string): boolean => {
    return uiState.loadingOperations.has(operation);
  }, [uiState.loadingOperations]);

  const showToast = useCallback((
    message: string, 
    type: 'success' | 'error' | 'info' | 'warning' = 'info', 
    duration?: number
  ) => {
    console.log(`[UIStateProvider] Showing ${type} toast: ${message}`);
    
    updateUIState(prev => ({
      ...prev,
      toastVisible: true,
      toastData: { message, type, duration }
    }));
  }, [updateUIState]);

  const hideToast = useCallback(() => {
    updateUIState(prev => ({
      ...prev,
      toastVisible: false,
      toastData: null
    }));
  }, [updateUIState]);

  const showSuccessToast = useCallback((message: string, duration?: number) => {
    showToast(message, 'success', duration);
  }, [showToast]);

  const showErrorToast = useCallback((message: string, duration?: number) => {
    showToast(message, 'error', duration);
  }, [showToast]);

  const showInfoToast = useCallback((message: string, duration?: number) => {
    showToast(message, 'info', duration);
  }, [showToast]);

  const showWarningToast = useCallback((message: string, duration?: number) => {
    showToast(message, 'warning', duration);
  }, [showToast]);

  const trackNavigation = useCallback((quizId: string) => {
    console.log(`[UIStateProvider] Tracking navigation to quiz: ${quizId}`);
    
    updateUIState(prev => {
      const newHistory = [...prev.navigationHistory];
      
      const existingIndex = newHistory.indexOf(quizId);
      if (existingIndex > -1) {
        newHistory.splice(existingIndex, 1);
      }
      
      newHistory.unshift(quizId);
      
      if (newHistory.length > 10) {
        newHistory.splice(10);
      }
      
      return {
        ...prev,
        lastNavigatedQuizId: quizId,
        navigationHistory: newHistory,
      };
    });
  }, [updateUIState]);

  const clearNavigationHistory = useCallback(() => {
    console.log('[UIStateProvider] Clearing navigation history');
    
    updateUIState(prev => ({
      ...prev,
      lastNavigatedQuizId: null,
      navigationHistory: [],
    }));
  }, [updateUIState]);

  const contextValue: UIStateContextValue = {
    isGlobalLoading: uiState.isGlobalLoading,
    isOperationLoading,
    startLoading,
    stopLoading,
    
    showToast,
    showSuccessToast,
    showErrorToast,
    showInfoToast,
    showWarningToast,
    hideToast,
    
    lastNavigatedQuizId: uiState.lastNavigatedQuizId,
    navigationHistory: uiState.navigationHistory,
    trackNavigation,
    clearNavigationHistory,
  };

  return (
    <UIStateContext.Provider value={contextValue}>
      {children}
      {uiState.toastData && (
        <Toast
          visible={uiState.toastVisible}
          onHide={hideToast}
          {...uiState.toastData}
        />
      )}
    </UIStateContext.Provider>
  );
}

export function useUIState() {
  const context = useContext(UIStateContext);
  if (!context) {
    throw new Error('useUIState must be used within a UIStateProvider');
  }
  return context;
}

export type { UIStateContextValue };

export function useOperationLoading(operationName: string) {
  const { isOperationLoading, startLoading, stopLoading } = useUIState();
  
  return {
    isLoading: isOperationLoading(operationName),
    startLoading: () => startLoading(operationName),
    stopLoading: () => stopLoading(operationName),
  };
}

export function useToastNotifications() {
  const { 
    showSuccessToast, 
    showErrorToast, 
    showInfoToast, 
    showWarningToast 
  } = useUIState();
  
  return {
    notifySuccess: showSuccessToast,
    notifyError: showErrorToast,
    notifyInfo: showInfoToast,
    notifyWarning: showWarningToast,
  };
}

export function useNavigationTracking() {
  const { 
    lastNavigatedQuizId, 
    navigationHistory, 
    trackNavigation, 
    clearNavigationHistory 
  } = useUIState();
  
  return {
    lastQuizId: lastNavigatedQuizId,
    history: navigationHistory,
    trackQuizNavigation: trackNavigation,
    clearHistory: clearNavigationHistory,
  };
}