// src/stores/uiStore.ts - Korrigierte Version mit Test-Support
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

// Environment Detection
const isTestEnvironment = typeof process !== 'undefined' && process.env?.NODE_ENV === 'test';
const isJestEnvironment = typeof jest !== 'undefined';

// Toast ID Generator
let toastIdCounter = 0;
const generateToastId = (): string => {
  toastIdCounter += 1;
  return `toast-${Date.now()}-${toastIdCounter}`;
};

// Timer Management for Tests
const createTimer = (callback: () => void, delay: number): number | NodeJS.Timeout => {
  if (isTestEnvironment || isJestEnvironment) {
    // In Tests: Verwende Jest Timers falls verfügbar
    if (typeof jest !== 'undefined' && jest.isMockFunction(setTimeout)) {
      return setTimeout(callback, delay) as any;
    }
    // Fallback: Sofortige Ausführung in Tests
    setTimeout(callback, 0);
    return 0;
  }
  
  // Normal environment
  return setTimeout(callback, delay);
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

    // Toast Actions
    showToast: (message: string, type: ToastData['type'] = 'info', duration?: number) => {
      const id = generateToastId();
      const toast: ToastData = {
        id,
        message,
        type,
        duration,
        position: 'top'
      };

      if (__DEV__ && !isTestEnvironment) {
        console.log('[UIStore] Showing toast:', toast);
      }

      set((state: UIStore) => {
        // Queue system: if there's an active toast, queue this one
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

      // Auto-hide after duration
      if (duration !== 0) { // 0 means don't auto-hide
        const hideAfter = duration || 3000;
        createTimer(() => {
          const currentStore = get();
          if (currentStore.activeToast?.id === id) {
            currentStore.hideToastById(id);
          }
        }, hideAfter);
      }
    },

    showSuccessToast: (message: string, duration?: number) => {
      get().showToast(message, 'success', duration);
    },

    showErrorToast: (message: string, duration?: number) => {
      get().showToast(message, 'error', duration);
    },

    showInfoToast: (message: string, duration?: number) => {
      get().showToast(message, 'info', duration);
    },

    showWarningToast: (message: string, duration?: number) => {
      get().showToast(message, 'warning', duration);
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

    // Loading Actions
    startLoading: (operation: string = 'global') => {
      set((state: UIStore) => {
        const newOperations = new Set(state.loadingOperations);
        newOperations.add(operation);

        return {
          loadingOperations: newOperations,
          isGlobalLoading: operation === 'global' || state.isGlobalLoading || newOperations.size > 0
        };
      }, false, 'startLoading');
    },

    stopLoading: (operation: string = 'global') => {
      set((state: UIStore) => {
        const newOperations = new Set(state.loadingOperations);
        newOperations.delete(operation);

        return {
          loadingOperations: newOperations,
          isGlobalLoading: operation === 'global' ? false : (newOperations.size > 0)
        };
      }, false, 'stopLoading');
    },

    isOperationLoading: (operation: string): boolean => {
      return get().loadingOperations.has(operation);
    },

    // Navigation Actions
    trackNavigation: (quizId: string) => {
      if (__DEV__ && !isTestEnvironment) {
        console.log('[UIStore] Tracking navigation to:', quizId);
      }

      set((state: UIStore) => {
        const newHistory = [...state.navigationHistory];

        // Remove existing entry
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
      set({
        lastNavigatedQuizId: null,
        navigationHistory: []
      }, false, 'clearNavigationHistory');
    },

    // Pending Unlock Actions
    addPendingUnlock: (quizId: string, quizTitle: string) => {
      if (__DEV__ && !isTestEnvironment) {
        console.log('[UIStore] Adding pending unlock:', quizTitle);
      }

      set((state: UIStore) => {
        // Check if already exists
        const existingUnlock = state.pendingUnlocks.find(
          unlock => unlock.quizId === quizId
        );
        
        if (existingUnlock) {
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
          console.log(`[UIStore] Found ${unshownUnlocks.length} unshown unlocks`);
        }

        // Mark as shown
        set((state: UIStore) => ({
          pendingUnlocks: state.pendingUnlocks.map((unlock: PendingUnlock) =>
            unshownUnlocks.includes(unlock) ? { ...unlock, shown: true } : unlock
          )
        }), false, 'markUnlocksShown');

        // Show toasts with delay
        unshownUnlocks.forEach((unlock: PendingUnlock, index: number) => {
          const delay = 300 + index * 500;
          
          createTimer(() => {
            get().showSuccessToast(
              `🎉 "${unlock.quizTitle}" ist jetzt verfügbar!`,
              3000
            );
          }, delay);
        });
      }
    },

    clearPendingUnlocks: () => {
      set({ pendingUnlocks: [] }, false, 'clearPendingUnlocks');
    },

    resetPendingUnlocks: () => {
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

    // Debug
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

  // Test Environment: Simple store without devtools
  if (isTestEnvironment || isJestEnvironment) {
    return create<UIStore>(baseStore);
  }

  // Production/Development: Full store with devtools
  return create<UIStore>()(
    devtools(baseStore, {
      name: 'UI Store',
      trace: __DEV__,
      enabled: __DEV__
    })
  );
};

export const useUIStore = createStore();

// Reset function for tests
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

// Export types
export type { UIStore, ToastData, PendingUnlock };
export type UIStoreApi = ReturnType<typeof useUIStore>;