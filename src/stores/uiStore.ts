// src/stores/uiStore.ts - Fixed Timer Implementation & Test Compatibility
import { create } from 'zustand';
import { devtools } from 'zustand/middleware';

interface ToastData {
  id: string;
  message: string;
  type: 'success' | 'error' | 'info' | 'warning';
  duration?: number;
  position?: 'top' | 'bottom';
}

interface PendingUnlock {
  quizId: string;
  quizTitle: string;
  unlockedAt: number;
  shown: boolean;
}

interface UIStore {
  // Toast State
  toasts: ToastData[];
  activeToast: ToastData | null;
  
  // Loading State
  isGlobalLoading: boolean;
  loadingOperations: Set<string>;
  
  // Navigation State
  lastNavigatedQuizId: string | null;
  navigationHistory: string[];
  
  // Pending Unlocks
  pendingUnlocks: PendingUnlock[];
  
  // Toast Actions
  showToast: (message: string, type?: ToastData['type'], duration?: number) => void;
  showSuccessToast: (message: string, duration?: number) => void;
  showErrorToast: (message: string, duration?: number) => void;
  showInfoToast: (message: string, duration?: number) => void;
  showWarningToast: (message: string, duration?: number) => void;
  hideToast: () => void;
  hideToastById: (id: string) => void;
  
  // Loading Actions
  startLoading: (operation?: string) => void;
  stopLoading: (operation?: string) => void;
  isOperationLoading: (operation: string) => boolean;
  
  // Navigation Actions
  trackNavigation: (quizId: string) => void;
  clearNavigationHistory: () => void;
  
  // Pending Unlock Actions
  addPendingUnlock: (quizId: string, quizTitle: string) => void;
  checkPendingUnlocks: () => void;
  clearPendingUnlocks: () => void;
  resetPendingUnlocks: () => void;
  getPendingUnlocksCount: () => number;
  
  // Debug
  getDebugInfo: () => {
    toastCount: number;
    activeOperations: string[];
    navigationHistoryCount: number;
    pendingUnlocksCount: number;
    unshownUnlocksCount: number;
  };
}

// Environment Detection - Fixed
const isTestEnvironment = typeof process !== 'undefined' && process.env?.NODE_ENV === 'test';
const isJestEnvironment = typeof jest !== 'undefined';

// Toast ID Generator
let toastIdCounter = 0;
const generateToastId = (): string => {
  toastIdCounter += 1;
  return `toast-${Date.now()}-${toastIdCounter}`;
};

// Safe Timer Management - Enhanced for Tests & Production
const createTimer = (callback: () => void, delay: number): any => {
  if (isTestEnvironment || isJestEnvironment) {
    // In Tests: Use real setTimeout but don't auto-execute for 0 delay
    if (delay === 0) {
      // Immediate execution but still async
      return setTimeout(callback, 0);
    }
    return setTimeout(callback, delay);
  }
  
  // Normal environment: Standard setTimeout
  return setTimeout(callback, delay);
};

// Clear Timer - Safe for all environments
const clearTimer = (timerId: any): void => {
  if (timerId && typeof clearTimeout === 'function') {
    clearTimeout(timerId);
  }
};

// Store Creation Function
const createStore = () => {
  const baseStore = (set: any, get: any): UIStore => ({
    // Initial State
    toasts: [],
    activeToast: null,
    isGlobalLoading: false,
    loadingOperations: new Set<string>(),
    lastNavigatedQuizId: null,
    navigationHistory: [],
    pendingUnlocks: [],

    // Toast Actions - Enhanced
    showToast: (message: string, type: ToastData['type'] = 'info', duration?: number) => {
      const id = generateToastId();
      const toast: ToastData = {
        id,
        message,
        type,
        duration: duration || 3000, // Default 3 seconds
        position: 'top'
      };

      if (__DEV__ && !isTestEnvironment) {
        console.log('[UIStore] Showing toast:', toast);
      }

      set((state: UIStore) => {
        // Enhanced Queue system: if there's an active toast, queue this one
        if (state.activeToast) {
          return {
            toasts: [...state.toasts, toast]
          };
        }
        
        // No active toast, show immediately
        return {
          activeToast: toast,
          toasts: state.toasts
        };
      }, false, 'showToast');

      // Auto-hide after duration (enhanced timing)
      if (toast.duration && toast.duration > 0) {
        createTimer(() => {
          const currentStore = get();
          if (currentStore.activeToast?.id === id) {
            currentStore.hideToastById(id);
          }
        }, toast.duration);
      }
    },

    showSuccessToast: (message: string, duration?: number) => {
      get().showToast(message, 'success', duration || 3000);
    },

    showErrorToast: (message: string, duration?: number) => {
      get().showToast(message, 'error', duration || 4000);
    },

    showInfoToast: (message: string, duration?: number) => {
      get().showToast(message, 'info', duration || 3000);
    },

    showWarningToast: (message: string, duration?: number) => {
      get().showToast(message, 'warning', duration || 3500);
    },

    hideToast: () => {
      set((state: UIStore) => {
        const nextToast = state.toasts[0];
        
        if (nextToast) {
          // Show next toast from queue
          return {
            activeToast: nextToast,
            toasts: state.toasts.slice(1)
          };
        }
        
        // No more toasts
        return {
          activeToast: null,
          toasts: []
        };
      }, false, 'hideToast');
    },

    hideToastById: (id: string) => {
      set((state: UIStore) => {
        // If hiding the active toast
        if (state.activeToast?.id === id) {
          const nextToast = state.toasts[0];
          
          return {
            activeToast: nextToast || null,
            toasts: nextToast ? state.toasts.slice(1) : []
          };
        }
        
        // Remove from queue
        return {
          toasts: state.toasts.filter(toast => toast.id !== id)
        };
      }, false, 'hideToastById');
    },

    // Loading Actions - Enhanced
    startLoading: (operation: string = 'global') => {
      set((state: UIStore) => {
        const newOperations = new Set(state.loadingOperations);
        newOperations.add(operation);

        const newIsLoading = operation === 'global' || state.isGlobalLoading || newOperations.size > 0;

        if (__DEV__ && !isTestEnvironment) {
          console.log(`[UIStore] Starting loading: ${operation}, global: ${newIsLoading}`);
        }

        return {
          loadingOperations: newOperations,
          isGlobalLoading: newIsLoading
        };
      }, false, 'startLoading');
    },

    stopLoading: (operation: string = 'global') => {
      set((state: UIStore) => {
        const newOperations = new Set(state.loadingOperations);
        newOperations.delete(operation);

        const newIsLoading = operation === 'global' ? false : (newOperations.size > 0);

        if (__DEV__ && !isTestEnvironment) {
          console.log(`[UIStore] Stopping loading: ${operation}, global: ${newIsLoading}`);
        }

        return {
          loadingOperations: newOperations,
          isGlobalLoading: newIsLoading
        };
      }, false, 'stopLoading');
    },

    isOperationLoading: (operation: string): boolean => {
      return get().loadingOperations.has(operation);
    },

    // Navigation Actions - Enhanced
    trackNavigation: (quizId: string) => {
      if (!quizId || quizId.trim() === '') {
        if (__DEV__) console.warn('[UIStore] Invalid quizId for navigation tracking');
        return;
      }

      if (__DEV__ && !isTestEnvironment) {
        console.log('[UIStore] Tracking navigation to:', quizId);
      }

      set((state: UIStore) => {
        const newHistory = [...state.navigationHistory];

        // Remove existing entry if present
        const existingIndex = newHistory.indexOf(quizId);
        if (existingIndex > -1) {
          newHistory.splice(existingIndex, 1);
        }

        // Add to front
        newHistory.unshift(quizId);

        // Keep max 10 entries
        if (newHistory.length > 10) {
          newHistory.splice(10);
        }

        return {
          lastNavigatedQuizId: quizId,
          navigationHistory: newHistory
        };
      }, false, 'trackNavigation');
    },

    clearNavigationHistory: () => {
      if (__DEV__ && !isTestEnvironment) {
        console.log('[UIStore] Clearing navigation history');
      }

      set({
        lastNavigatedQuizId: null,
        navigationHistory: []
      }, false, 'clearNavigationHistory');
    },

    // Pending Unlock Actions - Enhanced
    addPendingUnlock: (quizId: string, quizTitle: string) => {
      if (!quizId || !quizTitle) {
        if (__DEV__) console.warn('[UIStore] Invalid parameters for addPendingUnlock');
        return;
      }

      if (__DEV__ && !isTestEnvironment) {
        console.log('[UIStore] Adding pending unlock:', quizTitle);
      }

      set((state: UIStore) => {
        // Check if already exists
        const existingUnlock = state.pendingUnlocks.find(
          unlock => unlock.quizId === quizId
        );
        
        if (existingUnlock) {
          if (__DEV__ && !isTestEnvironment) {
            console.log('[UIStore] Pending unlock already exists for:', quizId);
          }
          return state; // No change
        }

        const newUnlock: PendingUnlock = {
          quizId,
          quizTitle,
          unlockedAt: Date.now(),
          shown: false
        };

        return {
          pendingUnlocks: [...state.pendingUnlocks, newUnlock]
        };
      }, false, 'addPendingUnlock');
    },

    checkPendingUnlocks: () => {
      const state = get();
      const unshownUnlocks = state.pendingUnlocks.filter((unlock: PendingUnlock) => !unlock.shown);

      if (unshownUnlocks.length > 0) {
        if (__DEV__ && !isTestEnvironment) {
          console.log(`[UIStore] Found ${unshownUnlocks.length} unshown unlock notifications`);
        }

        // Mark as shown first
        set((state: UIStore) => ({
          pendingUnlocks: state.pendingUnlocks.map((unlock: PendingUnlock) =>
            unshownUnlocks.includes(unlock) ? { ...unlock, shown: true } : unlock
          )
        }), false, 'markUnlocksShown');

        // Show toasts with staggered delay
        unshownUnlocks.forEach((unlock: PendingUnlock, index: number) => {
          const delay = 300 + index * 500; // 300ms + 500ms per additional toast
          
          createTimer(() => {
            const currentStore = get();
            currentStore.showSuccessToast(
              `🎉 "${unlock.quizTitle}" ist jetzt verfügbar!`,
              3000
            );
          }, delay);
        });
      } else {
        if (__DEV__ && !isTestEnvironment) {
          console.log('[UIStore] No pending unlock notifications to show');
        }
      }
    },

    clearPendingUnlocks: () => {
      if (__DEV__ && !isTestEnvironment) {
        console.log('[UIStore] Clearing all pending unlocks');
      }

      set({ pendingUnlocks: [] }, false, 'clearPendingUnlocks');
    },

    resetPendingUnlocks: () => {
      if (__DEV__ && !isTestEnvironment) {
        console.log('[UIStore] Resetting pending unlocks (marking all as unshown)');
      }

      set((state: UIStore) => ({
        pendingUnlocks: state.pendingUnlocks.map(unlock => ({
          ...unlock,
          shown: false
        }))
      }), false, 'resetPendingUnlocks');
    },

    getPendingUnlocksCount: (): number => {
      return get().pendingUnlocks.filter((unlock: PendingUnlock) => !unlock.shown).length;
    },

    // Debug - Enhanced
    getDebugInfo: () => {
      const state = get();
      return {
        toastCount: state.toasts.length + (state.activeToast ? 1 : 0),
        activeOperations: Array.from(state.loadingOperations),
        navigationHistoryCount: state.navigationHistory.length,
        pendingUnlocksCount: state.pendingUnlocks.length,
        unshownUnlocksCount: state.pendingUnlocks.filter((u: PendingUnlock) => !u.shown).length
      };
    }
  });

  // Test Environment: Simple store without devtools/middleware
  if (isTestEnvironment || isJestEnvironment) {
    return create<UIStore>(baseStore);
  }

  // Production/Development: Full store with devtools
  return create<UIStore>()(
    devtools(baseStore, {
      name: 'UI Store Enhanced',
      trace: __DEV__,
      enabled: __DEV__
    })
  );
};

export const useUIStore = createStore();

// Reset function for tests - Enhanced
export const resetUIStore = () => {
  if (isTestEnvironment || isJestEnvironment) {
    useUIStore.setState({
      toasts: [],
      activeToast: null,
      isGlobalLoading: false,
      loadingOperations: new Set(),
      lastNavigatedQuizId: null,
      navigationHistory: [],
      pendingUnlocks: []
    });
  }
};

// Store utilities for better testing
export const getUIStoreSnapshot = () => {
  if (isTestEnvironment || isJestEnvironment) {
    const state = useUIStore.getState();
    return {
      toastCount: state.toasts.length + (state.activeToast ? 1 : 0),
      isLoading: state.isGlobalLoading,
      operationsCount: state.loadingOperations.size,
      historyCount: state.navigationHistory.length,
      unlocksCount: state.pendingUnlocks.length
    };
  }
  return null;
};

// Export types
export type { UIStore, ToastData, PendingUnlock };
export type UIStoreApi = ReturnType<typeof useUIStore>;