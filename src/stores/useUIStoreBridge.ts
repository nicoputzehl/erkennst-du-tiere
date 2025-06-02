// src/stores/useUIStoreBridge.ts - Korrigierte Version
import { useCallback } from 'react';
import { useUIStore } from './uiStore';

interface UIStoreBridgeReturn {
  // Loading State (kompatibel mit UIStateProvider)
  isGlobalLoading: boolean;
  isOperationLoading: (operation: string) => boolean;
  startLoading: (operation?: string) => void;
  stopLoading: (operation?: string) => void;
  
  // Toast System (kompatibel mit UIStateProvider)
  showToast: (message: string, type?: 'success' | 'error' | 'info' | 'warning', duration?: number) => void;
  showSuccessToast: (message: string, duration?: number) => void;
  showErrorToast: (message: string, duration?: number) => void;
  showInfoToast: (message: string, duration?: number) => void;
  showWarningToast: (message: string, duration?: number) => void;
  hideToast: () => void;
  
  // Navigation Tracking (kompatibel mit UIStateProvider)
  lastNavigatedQuizId: string | null;
  navigationHistory: string[];
  trackNavigation: (quizId: string) => void;
  clearNavigationHistory: () => void;
  
  // Pending Unlocks (kompatibel mit UIStateProvider)
  addPendingUnlock: (quizId: string, quizTitle: string) => void;
  checkPendingUnlocks: () => void;
  clearPendingUnlocks: () => void;
  resetPendingUnlocks: () => void;
  getPendingUnlocksCount: () => number;
  
  // Toast State für UI Components - FIXED für Kompatibilität
  activeToast: any | null;
  toastVisible: boolean;
  toastData: any | null; // Legacy compatibility
  
  // Debug
  getDebugInfo: () => any;
}

export function useUIStoreBridge(): UIStoreBridgeReturn {
  const uiStore = useUIStore();
  
  // Enhanced toast compatibility - wrapping für perfect compatibility
  const showToast = useCallback((
    message: string, 
    type: 'success' | 'error' | 'info' | 'warning' = 'info', 
    duration?: number
  ) => {
    uiStore.showToast(message, type, duration);
  }, [uiStore]);

  // Toast visibility derived from activeToast
  const toastVisible = !!uiStore.activeToast;
  
  // Legacy toastData compatibility
  const toastData = uiStore.activeToast ? {
    message: uiStore.activeToast.message,
    type: uiStore.activeToast.type,
    duration: uiStore.activeToast.duration
  } : null;

  return {
    // Loading State
    isGlobalLoading: uiStore.isGlobalLoading,
    isOperationLoading: uiStore.isOperationLoading,
    startLoading: uiStore.startLoading,
    stopLoading: uiStore.stopLoading,
    
    // Toast System
    showToast,
    showSuccessToast: uiStore.showSuccessToast,
    showErrorToast: uiStore.showErrorToast,
    showInfoToast: uiStore.showInfoToast,
    showWarningToast: uiStore.showWarningToast,
    hideToast: uiStore.hideToast,
    
    // Navigation Tracking
    lastNavigatedQuizId: uiStore.lastNavigatedQuizId,
    navigationHistory: uiStore.navigationHistory,
    trackNavigation: uiStore.trackNavigation,
    clearNavigationHistory: uiStore.clearNavigationHistory,
    
    // Pending Unlocks
    addPendingUnlock: uiStore.addPendingUnlock,
    checkPendingUnlocks: uiStore.checkPendingUnlocks,
    clearPendingUnlocks: uiStore.clearPendingUnlocks,
    resetPendingUnlocks: uiStore.resetPendingUnlocks,
    getPendingUnlocksCount: uiStore.getPendingUnlocksCount,
    
    // Toast State für Components - Enhanced Compatibility
    activeToast: uiStore.activeToast,
    toastVisible,
    toastData, // Legacy support
    
    // Debug
    getDebugInfo: uiStore.getDebugInfo
  };
}

// Enhanced Convenience Hooks mit besserer Kompatibilität
export function useToastNotifications() {
  const bridge = useUIStoreBridge();
  
  return {
    notifySuccess: bridge.showSuccessToast,
    notifyError: bridge.showErrorToast,
    notifyInfo: bridge.showInfoToast,
    notifyWarning: bridge.showWarningToast,
  };
}

export function useOperationLoading(operationName: string) {
  const bridge = useUIStoreBridge();
  
  return {
    isLoading: bridge.isOperationLoading(operationName),
    startLoading: () => bridge.startLoading(operationName),
    stopLoading: () => bridge.stopLoading(operationName),
  };
}

export function useNavigationTracking() {
  const bridge = useUIStoreBridge();
  
  return {
    lastQuizId: bridge.lastNavigatedQuizId,
    history: bridge.navigationHistory,
    trackQuizNavigation: bridge.trackNavigation,
    clearHistory: bridge.clearNavigationHistory,
  };
}

export function usePendingUnlocks() {
  const bridge = useUIStoreBridge();
  
  return {
    addPendingUnlock: bridge.addPendingUnlock,
    checkPendingUnlocks: bridge.checkPendingUnlocks,
    clearPendingUnlocks: bridge.clearPendingUnlocks,
    resetPendingUnlocks: bridge.resetPendingUnlocks,
    getPendingUnlocksCount: bridge.getPendingUnlocksCount,
  };
}