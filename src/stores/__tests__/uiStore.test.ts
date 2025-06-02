// src/stores/__tests__/uiStore.test.ts - Minimale Version für Schritt 4
import { useUIStore } from '../uiStore';

describe('UI Store - Essential Tests', () => {
  beforeEach(() => {
    // Reset store before each test
    useUIStore.setState({
      toasts: [],
      activeToast: null,
      isGlobalLoading: false,
      loadingOperations: new Set(),
      lastNavigatedQuizId: null,
      navigationHistory: [],
      pendingUnlocks: []
    });
  });

  describe('Core Functionality', () => {
    it('should manage toast state', () => {
      const store = useUIStore.getState();
      
      store.showToast('Test message', 'info');
      
      const updatedStore = useUIStore.getState();
      expect(updatedStore.activeToast).not.toBeNull();
      expect(updatedStore.activeToast!.message).toBe('Test message');
      expect(updatedStore.activeToast!.type).toBe('info');
    });

    it('should manage loading state', () => {
      const store = useUIStore.getState();
      
      // Start loading
      store.startLoading('test-operation');
      expect(useUIStore.getState().isGlobalLoading).toBe(true);
      
      // Stop loading
      store.stopLoading('test-operation');
      expect(useUIStore.getState().isGlobalLoading).toBe(false);
    });

    it('should track navigation', () => {
      const store = useUIStore.getState();
      
      store.trackNavigation('quiz-1');
      
      const updatedStore = useUIStore.getState();
      expect(updatedStore.lastNavigatedQuizId).toBe('quiz-1');
      expect(updatedStore.navigationHistory).toEqual(['quiz-1']);
    });

    it('should manage pending unlocks', () => {
      const store = useUIStore.getState();
      
      store.addPendingUnlock('quiz-2', 'Quiz 2 Title');
      
      const updatedStore = useUIStore.getState();
      expect(updatedStore.pendingUnlocks).toHaveLength(1);
      expect(store.getPendingUnlocksCount()).toBe(1);
    });
  });

  describe('Debug Information', () => {
    it('should provide debug info', () => {
      const store = useUIStore.getState();
      
      const debugInfo = store.getDebugInfo();
      
      expect(debugInfo).toEqual(
        expect.objectContaining({
          toastCount: expect.any(Number),
          activeOperations: expect.any(Array),
          navigationHistoryCount: expect.any(Number),
          pendingUnlocksCount: expect.any(Number),
          unshownUnlocksCount: expect.any(Number)
        })
      );
    });
  });

  describe('State Consistency', () => {
    it('should maintain consistent state during operations', () => {
      const store = useUIStore.getState();
      
      // Setup state
      store.showToast('Test toast', 'info');
      store.startLoading('test-op');
      store.trackNavigation('test-quiz');
      store.addPendingUnlock('unlock-quiz', 'Unlock Quiz');
      
      // Verify state is consistent
      const state = useUIStore.getState();
      expect(state.activeToast).not.toBeNull();
      expect(state.isGlobalLoading).toBe(true);
      expect(state.lastNavigatedQuizId).toBe('test-quiz');
      expect(state.pendingUnlocks).toHaveLength(1);
    });
  });
});

// Note: Dies sind minimale Tests für Schritt 4 der Store-Migration
// Vollständige Tests werden nach Abschluss der UI-State Migration hinzugefügt