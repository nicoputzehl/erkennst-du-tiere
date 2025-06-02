// src/stores/__tests__/useUIStoreBridge.test.ts - Native Jest Tests ohne Testing Library
import { useUIStore, resetUIStore } from '../uiStore';

// Direct Store Testing - Keine React Hooks in Tests
describe('UI Store Bridge - Direct Store Tests', () => {
  beforeEach(() => {
    resetUIStore();
  });

  describe('UI Store Direct Access', () => {
    it('should provide all required store methods', () => {
      const store = useUIStore.getState();

      // Check that all essential methods exist
      expect(typeof store.isGlobalLoading).toBe('boolean');
      expect(typeof store.showToast).toBe('function');
      expect(typeof store.showSuccessToast).toBe('function');
      expect(typeof store.startLoading).toBe('function');
      expect(typeof store.trackNavigation).toBe('function');
      expect(typeof store.addPendingUnlock).toBe('function');
      expect(typeof store.getDebugInfo).toBe('function');
    });

    it('should handle basic toast operations via store', () => {
      const store = useUIStore.getState();

      // Show toast
      store.showToast('Test message', 'info');
      
      // Check updated state
      const updatedState = useUIStore.getState();
      expect(updatedState.activeToast).not.toBeNull();
      expect(updatedState.activeToast!.message).toBe('Test message');
      expect(updatedState.activeToast!.type).toBe('info');
    });

    it('should handle basic loading operations via store', () => {
      const store = useUIStore.getState();

      // Start loading
      store.startLoading('test-op');
      
      let state = useUIStore.getState();
      expect(state.isGlobalLoading).toBe(true);
      expect(state.isOperationLoading('test-op')).toBe(true);

      // Stop loading
      store.stopLoading('test-op');
      
      state = useUIStore.getState();
      expect(state.isGlobalLoading).toBe(false);
      expect(state.isOperationLoading('test-op')).toBe(false);
    });

    it('should handle navigation tracking via store', () => {
      const store = useUIStore.getState();

      store.trackNavigation('quiz-1');
      
      const state = useUIStore.getState();
      expect(state.lastNavigatedQuizId).toBe('quiz-1');
      expect(state.navigationHistory).toEqual(['quiz-1']);
    });

    it('should handle pending unlocks via store', () => {
      const store = useUIStore.getState();

      store.addPendingUnlock('quiz-2', 'Next Quiz');
      
      const state = useUIStore.getState();
      expect(state.pendingUnlocks).toHaveLength(1);
      expect(store.getPendingUnlocksCount()).toBe(1);
    });
  });

  describe('Toast Queue Management', () => {
    it('should queue multiple toasts correctly', () => {
      const store = useUIStore.getState();

      // Add multiple toasts
      store.showToast('First toast', 'info');
      store.showToast('Second toast', 'success');
      
      const state = useUIStore.getState();
      expect(state.activeToast!.message).toBe('First toast');
      expect(state.toasts).toHaveLength(1);
      expect(state.toasts[0].message).toBe('Second toast');
    });

    it('should show next toast when hiding current', () => {
      const store = useUIStore.getState();

      store.showToast('First toast', 'info');
      store.showToast('Second toast', 'success');
      
      // Hide current toast
      store.hideToast();
      
      const state = useUIStore.getState();
      expect(state.activeToast!.message).toBe('Second toast');
      expect(state.toasts).toHaveLength(0);
    });
  });

  describe('Loading State Management', () => {
    it('should handle multiple concurrent operations', () => {
      const store = useUIStore.getState();

      // Start multiple operations
      store.startLoading('op1');
      store.startLoading('op2');
      
      let state = useUIStore.getState();
      expect(state.isGlobalLoading).toBe(true);
      expect(state.isOperationLoading('op1')).toBe(true);
      expect(state.isOperationLoading('op2')).toBe(true);

      // Stop one operation
      store.stopLoading('op1');
      
      state = useUIStore.getState();
      expect(state.isGlobalLoading).toBe(true); // Still has op2
      expect(state.isOperationLoading('op1')).toBe(false);
      expect(state.isOperationLoading('op2')).toBe(true);

      // Stop last operation
      store.stopLoading('op2');
      
      state = useUIStore.getState();
      expect(state.isGlobalLoading).toBe(false);
    });
  });

  describe('Bridge Compatibility Properties', () => {
    it('should provide toastVisible property logic', () => {
      const store = useUIStore.getState();
      
      // Initially no toast
      let state = useUIStore.getState();
      const toastVisible = !!state.activeToast;
      expect(toastVisible).toBe(false);

      // Show toast
      store.showToast('Test', 'info');
      
      state = useUIStore.getState();
      const toastVisibleAfter = !!state.activeToast;
      expect(toastVisibleAfter).toBe(true);
    });

    it('should provide toastData compatibility format', () => {
      const store = useUIStore.getState();

      store.showToast('Test message', 'success', 5000);
      
      const state = useUIStore.getState();
      
      // Simulate toastData format for legacy compatibility
      const toastData = state.activeToast ? {
        message: state.activeToast.message,
        type: state.activeToast.type,
        duration: state.activeToast.duration,
        position: state.activeToast.position
      } : null;

      expect(toastData).not.toBeNull();
      expect(toastData!.message).toBe('Test message');
      expect(toastData!.type).toBe('success');
      expect(toastData!.duration).toBe(5000);
    });
  });

  describe('Integration Scenarios', () => {
    it('should handle typical workflow', () => {
      const store = useUIStore.getState();

      // Typical usage scenario
      store.startLoading('quiz-load');
      store.showSuccessToast('Quiz loaded');
      store.trackNavigation('quiz-1');
      store.addPendingUnlock('quiz-2', 'Next Quiz');
      store.stopLoading('quiz-load');

      // Verify final state
      const state = useUIStore.getState();
      expect(state.isGlobalLoading).toBe(false);
      expect(state.activeToast).not.toBeNull();
      expect(state.lastNavigatedQuizId).toBe('quiz-1');
      expect(store.getPendingUnlocksCount()).toBe(1);
    });

    it('should handle cleanup operations', () => {
      const store = useUIStore.getState();

      // Setup state
      store.showToast('Test', 'info');
      store.trackNavigation('quiz-1');
      store.addPendingUnlock('quiz-2', 'Test Quiz');

      // Cleanup
      store.hideToast();
      store.clearNavigationHistory();
      store.clearPendingUnlocks();

      const state = useUIStore.getState();
      expect(state.activeToast).toBeNull();
      expect(state.lastNavigatedQuizId).toBeNull();
      expect(state.navigationHistory).toEqual([]);
      expect(state.pendingUnlocks).toEqual([]);
    });
  });

  describe('Error Handling', () => {
    it('should handle edge cases gracefully', () => {
      const store = useUIStore.getState();

      // Should not crash with edge cases
      expect(() => store.stopLoading('non-existent')).not.toThrow();
      expect(() => store.hideToast()).not.toThrow();
      expect(() => store.trackNavigation('')).not.toThrow();
      expect(() => store.clearNavigationHistory()).not.toThrow();
      expect(() => store.addPendingUnlock('', '')).not.toThrow();
    });
  });

  describe('Debug Information', () => {
    it('should provide accurate debug info', () => {
      const store = useUIStore.getState();

      // Setup some state
      store.showToast('Debug toast', 'info');
      store.startLoading('debug-op');
      store.trackNavigation('debug-quiz');
      store.addPendingUnlock('debug-unlock', 'Debug Quiz');

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

      expect(debugInfo.toastCount).toBe(1);
      expect(debugInfo.activeOperations).toContain('debug-op');
      expect(debugInfo.navigationHistoryCount).toBe(1);
      expect(debugInfo.pendingUnlocksCount).toBe(1);
    });
  });
});

// Note: Diese Tests verwenden direkten Store-Zugriff ohne React Testing Library
// Perfekt für Schritt 4 der Migration - minimale, stabile Tests