// src/stores/__tests__/uiStore.test.ts
import { useUIStore } from '../uiStore';

describe('UI Store', () => {
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

  describe('Toast System', () => {
    beforeEach(() => {
      // Clear any existing timers
      jest.clearAllTimers();
      jest.useFakeTimers();
    });

    afterEach(() => {
      jest.useRealTimers();
    });

    it('should show a toast immediately when none are active', () => {
      const store = useUIStore.getState();
      
      store.showToast('Test message', 'info');
      
      const updatedStore = useUIStore.getState();
      expect(updatedStore.activeToast).not.toBeNull();
      expect(updatedStore.activeToast!.message).toBe('Test message');
      expect(updatedStore.activeToast!.type).toBe('info');
    });

    it('should queue toasts when one is already active', () => {
      const store = useUIStore.getState();
      
      // Show first toast
      store.showToast('First toast', 'info');
      
      // Show second toast (should be queued)
      store.showToast('Second toast', 'success');
      
      const updatedStore = useUIStore.getState();
      expect(updatedStore.activeToast!.message).toBe('First toast');
      expect(updatedStore.toasts).toHaveLength(1);
      expect(updatedStore.toasts[0].message).toBe('Second toast');
    });

    it('should show next toast from queue when hiding current', () => {
      const store = useUIStore.getState();
      
      // Add toasts
      store.showToast('First toast', 'info');
      store.showToast('Second toast', 'success');
      store.showToast('Third toast', 'warning');
      
      // Hide current toast
      store.hideToast();
      
      const updatedStore = useUIStore.getState();
      expect(updatedStore.activeToast!.message).toBe('Second toast');
      expect(updatedStore.toasts).toHaveLength(1);
      expect(updatedStore.toasts[0].message).toBe('Third toast');
    });

    it('should auto-hide toast after duration', () => {
      const store = useUIStore.getState();
      
      store.showToast('Auto hide toast', 'info', 1000);
      
      // Should be visible immediately
      expect(useUIStore.getState().activeToast).not.toBeNull();
      
      // Fast-forward time
      jest.advanceTimersByTime(1000);
      
      // Should be hidden after duration
      expect(useUIStore.getState().activeToast).toBeNull();
    });

    it('should not auto-hide when duration is 0', () => {
      const store = useUIStore.getState();
      
      store.showToast('Persistent toast', 'info', 0);
      
      // Fast-forward a long time
      jest.advanceTimersByTime(10000);
      
      // Should still be visible
      expect(useUIStore.getState().activeToast).not.toBeNull();
    });

    it('should provide convenience methods for different toast types', () => {
      const store = useUIStore.getState();
      
      store.showSuccessToast('Success message');
      expect(useUIStore.getState().activeToast!.type).toBe('success');
      
      store.hideToast();
      store.showErrorToast('Error message');
      expect(useUIStore.getState().activeToast!.type).toBe('error');
      
      store.hideToast();
      store.showWarningToast('Warning message');
      expect(useUIStore.getState().activeToast!.type).toBe('warning');
    });

    it('should hide specific toast by ID', () => {
      const store = useUIStore.getState();
      
      store.showToast('First toast', 'info');
      const firstToastId = useUIStore.getState().activeToast!.id;
      
      store.showToast('Second toast', 'success');
      store.showToast('Third toast', 'warning');
      
      // Hide first toast (currently active)
      store.hideToastById(firstToastId);
      
      const updatedStore = useUIStore.getState();
      expect(updatedStore.activeToast!.message).toBe('Second toast');
      expect(updatedStore.toasts).toHaveLength(1);
    });
  });

  describe('Loading State Management', () => {
    it('should manage global loading state', () => {
      const store = useUIStore.getState();
      
      // Start global loading
      store.startLoading('global');
      expect(useUIStore.getState().isGlobalLoading).toBe(true);
      
      // Stop global loading
      store.stopLoading('global');
      expect(useUIStore.getState().isGlobalLoading).toBe(false);
    });

    it('should manage operation-specific loading', () => {
      const store = useUIStore.getState();
      
      // Start specific operation
      store.startLoading('test-operation');
      
      const stateAfterStart = useUIStore.getState();
      expect(stateAfterStart.isOperationLoading('test-operation')).toBe(true);
      expect(stateAfterStart.isGlobalLoading).toBe(true); // Any operation sets global loading
      
      // Stop specific operation
      store.stopLoading('test-operation');
      
      const stateAfterStop = useUIStore.getState();
      expect(stateAfterStop.isOperationLoading('test-operation')).toBe(false);
      expect(stateAfterStop.isGlobalLoading).toBe(false);
    });

    it('should handle multiple concurrent operations', () => {
      const store = useUIStore.getState();
      
      // Start multiple operations
      store.startLoading('operation-1');
      store.startLoading('operation-2');
      store.startLoading('operation-3');
      
      const stateWithOperations = useUIStore.getState();
      expect(stateWithOperations.isOperationLoading('operation-1')).toBe(true);
      expect(stateWithOperations.isOperationLoading('operation-2')).toBe(true);
      expect(stateWithOperations.isOperationLoading('operation-3')).toBe(true);
      expect(stateWithOperations.isGlobalLoading).toBe(true);
      
      // Stop one operation
      store.stopLoading('operation-1');
      
      const stateAfterOne = useUIStore.getState();
      expect(stateAfterOne.isOperationLoading('operation-1')).toBe(false);
      expect(stateAfterOne.isOperationLoading('operation-2')).toBe(true);
      expect(stateAfterOne.isGlobalLoading).toBe(true); // Still other operations
      
      // Stop all remaining operations
      store.stopLoading('operation-2');
      store.stopLoading('operation-3');
      
      const stateAfterAll = useUIStore.getState();
      expect(stateAfterAll.isGlobalLoading).toBe(false);
    });
  });

  describe('Navigation Tracking', () => {
    it('should track navigation to quiz', () => {
      const store = useUIStore.getState();
      
      store.trackNavigation('quiz-1');
      
      const updatedStore = useUIStore.getState();
      expect(updatedStore.lastNavigatedQuizId).toBe('quiz-1');
      expect(updatedStore.navigationHistory).toEqual(['quiz-1']);
    });

    it('should maintain navigation history order', () => {
      const store = useUIStore.getState();
      
      store.trackNavigation('quiz-1');
      store.trackNavigation('quiz-2');
      store.trackNavigation('quiz-3');
      
      const updatedStore = useUIStore.getState();
      expect(updatedStore.lastNavigatedQuizId).toBe('quiz-3');
      expect(updatedStore.navigationHistory).toEqual(['quiz-3', 'quiz-2', 'quiz-1']);
    });

    it('should move existing quiz to front when re-visited', () => {
      const store = useUIStore.getState();
      
      store.trackNavigation('quiz-1');
      store.trackNavigation('quiz-2');
      store.trackNavigation('quiz-3');
      store.trackNavigation('quiz-1'); // Revisit quiz-1
      
      const updatedStore = useUIStore.getState();
      expect(updatedStore.lastNavigatedQuizId).toBe('quiz-1');
      expect(updatedStore.navigationHistory).toEqual(['quiz-1', 'quiz-3', 'quiz-2']);
    });

    it('should limit navigation history to 10 entries', () => {
      const store = useUIStore.getState();
      
      // Add 15 entries
      for (let i = 1; i <= 15; i++) {
        store.trackNavigation(`quiz-${i}`);
      }
      
      const updatedStore = useUIStore.getState();
      expect(updatedStore.navigationHistory).toHaveLength(10);
      expect(updatedStore.navigationHistory[0]).toBe('quiz-15');
      expect(updatedStore.navigationHistory[9]).toBe('quiz-6');
    });

    it('should clear navigation history', () => {
      const store = useUIStore.getState();
      
      store.trackNavigation('quiz-1');
      store.trackNavigation('quiz-2');
      
      store.clearNavigationHistory();
      
      const updatedStore = useUIStore.getState();
      expect(updatedStore.lastNavigatedQuizId).toBeNull();
      expect(updatedStore.navigationHistory).toEqual([]);
    });
  });

  describe('Pending Unlocks Management', () => {
    it('should add pending unlock', () => {
      const store = useUIStore.getState();
      
      store.addPendingUnlock('quiz-2', 'Quiz 2 Title');
      
      const updatedStore = useUIStore.getState();
      expect(updatedStore.pendingUnlocks).toHaveLength(1);
      expect(updatedStore.pendingUnlocks[0]).toEqual({
        quizId: 'quiz-2',
        quizTitle: 'Quiz 2 Title',
        unlockedAt: expect.any(Number),
        shown: false
      });
    });

    it('should not add duplicate pending unlocks', () => {
      const store = useUIStore.getState();
      
      store.addPendingUnlock('quiz-2', 'Quiz 2 Title');
      store.addPendingUnlock('quiz-2', 'Quiz 2 Title'); // Duplicate
      
      const updatedStore = useUIStore.getState();
      expect(updatedStore.pendingUnlocks).toHaveLength(1);
    });

    it('should check and show pending unlocks', () => {
      jest.useFakeTimers();
      const store = useUIStore.getState();
      
      // Add some pending unlocks
      store.addPendingUnlock('quiz-2', 'Quiz 2');
      store.addPendingUnlock('quiz-3', 'Quiz 3');
      
      // Check pending unlocks
      store.checkPendingUnlocks();
      
      // Should mark as shown
      const stateAfterCheck = useUIStore.getState();
      expect(stateAfterCheck.pendingUnlocks.every(u => u.shown)).toBe(true);
      
      // Should have scheduled toasts
      jest.advanceTimersByTime(300);
      expect(useUIStore.getState().activeToast).not.toBeNull();
      
      jest.useRealTimers();
    });

    it('should count unshown pending unlocks', () => {
      const store = useUIStore.getState();
      
      store.addPendingUnlock('quiz-2', 'Quiz 2');
      store.addPendingUnlock('quiz-3', 'Quiz 3');
      
      expect(store.getPendingUnlocksCount()).toBe(2);
      
      store.checkPendingUnlocks();
      expect(store.getPendingUnlocksCount()).toBe(0);
    });

    it('should clear pending unlocks', () => {
      const store = useUIStore.getState();
      
      store.addPendingUnlock('quiz-2', 'Quiz 2');
      store.addPendingUnlock('quiz-3', 'Quiz 3');
      
      store.clearPendingUnlocks();
      
      const updatedStore = useUIStore.getState();
      expect(updatedStore.pendingUnlocks).toHaveLength(0);
    });

    it('should reset pending unlocks to unshown state', () => {
      const store = useUIStore.getState();
      
      store.addPendingUnlock('quiz-2', 'Quiz 2');
      store.checkPendingUnlocks(); // Mark as shown
      
      expect(store.getPendingUnlocksCount()).toBe(0);
      
      store.resetPendingUnlocks();
      
      expect(store.getPendingUnlocksCount()).toBe(1);
    });
  });

  describe('Debug Information', () => {
    it('should provide comprehensive debug info', () => {
      const store = useUIStore.getState();
      
      // Setup some state
      store.showToast('Toast 1', 'info');
      store.showToast('Toast 2', 'success');
      store.startLoading('operation-1');
      store.startLoading('operation-2');
      store.trackNavigation('quiz-1');
      store.trackNavigation('quiz-2');
      store.addPendingUnlock('quiz-3', 'Quiz 3');
      
      const debugInfo = store.getDebugInfo();
      
      expect(debugInfo).toEqual({
        toastCount: 2, // 1 active + 1 queued
        activeOperations: ['operation-1', 'operation-2'],
        navigationHistoryCount: 2,
        pendingUnlocksCount: 1,
        unshownUnlocksCount: 1
      });
    });

    it('should update debug info correctly as state changes', () => {
      const store = useUIStore.getState();
      
      // Initial state
      expect(store.getDebugInfo().toastCount).toBe(0);
      
      // Add toast
      store.showToast('Test toast', 'info');
      expect(store.getDebugInfo().toastCount).toBe(1);
      
      // Hide toast
      store.hideToast();
      expect(store.getDebugInfo().toastCount).toBe(0);
    });
  });

  describe('Integration Scenarios', () => {
    it('should handle complex workflow with multiple features', () => {
      jest.useFakeTimers();
      const store = useUIStore.getState();
      
      // Start loading
      store.startLoading('quiz-load');
      expect(useUIStore.getState().isGlobalLoading).toBe(true);
      
      // Track navigation
      store.trackNavigation('quiz-1');
      
      // Add pending unlock
      store.addPendingUnlock('quiz-2', 'Quiz 2');
      
      // Show success toast
      store.showSuccessToast('Quiz completed!');
      expect(useUIStore.getState().activeToast!.type).toBe('success');
      
      // Check unlocks (should queue toast)
      store.checkPendingUnlocks();
      
      // Hide current toast to show unlock toast
      store.hideToast();
      jest.advanceTimersByTime(300);
      
      const finalState = useUIStore.getState();
      expect(finalState.activeToast!.message).toContain('Quiz 2');
      expect(finalState.lastNavigatedQuizId).toBe('quiz-1');
      expect(finalState.isGlobalLoading).toBe(true);
      
      // Stop loading
      store.stopLoading('quiz-load');
      expect(useUIStore.getState().isGlobalLoading).toBe(false);
      
      jest.useRealTimers();
    });

    it('should maintain state consistency during rapid operations', () => {
      const store = useUIStore.getState();
      
      // Rapid-fire operations
      for (let i = 0; i < 10; i++) {
        store.showToast(`Toast ${i}`, 'info');
        store.startLoading(`operation-${i}`);
        store.trackNavigation(`quiz-${i}`);
      }
      
      const state = useUIStore.getState();
      
      // Should have 1 active toast + 9 queued
      expect(state.toasts.length + (state.activeToast ? 1 : 0)).toBe(10);
      
      // Should have 10 loading operations
      expect(state.loadingOperations.size).toBe(10);
      
      // Should have quiz-9 as last navigated (newest first)
      expect(state.lastNavigatedQuizId).toBe('quiz-9');
      expect(state.navigationHistory[0]).toBe('quiz-9');
    });
  });

  describe('Edge Cases', () => {
    it('should handle hiding toast when none is active', () => {
      const store = useUIStore.getState();
      
      // Should not crash
      expect(() => store.hideToast()).not.toThrow();
      expect(useUIStore.getState().activeToast).toBeNull();
    });

    it('should handle stopping non-existent loading operation', () => {
      const store = useUIStore.getState();
      
      // Should not crash
      expect(() => store.stopLoading('non-existent')).not.toThrow();
      expect(useUIStore.getState().isGlobalLoading).toBe(false);
    });

    it('should handle checking pending unlocks when none exist', () => {
      const store = useUIStore.getState();
      
      // Should not crash
      expect(() => store.checkPendingUnlocks()).not.toThrow();
      expect(store.getPendingUnlocksCount()).toBe(0);
    });

    it('should handle navigation tracking with empty string', () => {
      const store = useUIStore.getState();
      
      store.trackNavigation('');
      
      const updatedStore = useUIStore.getState();
      expect(updatedStore.lastNavigatedQuizId).toBe('');
      expect(updatedStore.navigationHistory).toEqual(['']);
    });
  });
});