// src/stores/__tests__/useUIStoreBridge.test.ts - Vollständige Version
import { useUIStoreBridge } from '../useUIStoreBridge';
import { resetUIStore } from '../uiStore';
import { 
  useToastNotifications, 
  useOperationLoading, 
  useNavigationTracking, 
  usePendingUnlocks 
} from '../useUIStoreBridge';

// Mock für Jest Timers
const mockTimers = () => {
  jest.useFakeTimers();
  return () => jest.useRealTimers();
};

describe('UI Store Bridge', () => {
  let cleanup: (() => void) | undefined;

  beforeEach(() => {
    // Reset store before each test
    resetUIStore();
    cleanup = mockTimers();
  });

  afterEach(() => {
    if (cleanup) {
      cleanup();
    }
    jest.clearAllTimers();
  });

  describe('Bridge Compatibility', () => {
    it('should provide all required UIStateProvider methods', () => {
      const bridge = useUIStoreBridge();
      
      // Loading State methods
      expect(typeof bridge.isGlobalLoading).toBe('boolean');
      expect(typeof bridge.isOperationLoading).toBe('function');
      expect(typeof bridge.startLoading).toBe('function');
      expect(typeof bridge.stopLoading).toBe('function');
      
      // Toast methods
      expect(typeof bridge.showToast).toBe('function');
      expect(typeof bridge.showSuccessToast).toBe('function');
      expect(typeof bridge.showErrorToast).toBe('function');
      expect(typeof bridge.showInfoToast).toBe('function');
      expect(typeof bridge.showWarningToast).toBe('function');
      expect(typeof bridge.hideToast).toBe('function');
      
      // Navigation methods
      expect(typeof bridge.lastNavigatedQuizId).toBe('object'); // can be null
      expect(Array.isArray(bridge.navigationHistory)).toBe(true);
      expect(typeof bridge.trackNavigation).toBe('function');
      expect(typeof bridge.clearNavigationHistory).toBe('function');
      
      // Pending unlock methods
      expect(typeof bridge.addPendingUnlock).toBe('function');
      expect(typeof bridge.checkPendingUnlocks).toBe('function');
      expect(typeof bridge.clearPendingUnlocks).toBe('function');
      expect(typeof bridge.resetPendingUnlocks).toBe('function');
      expect(typeof bridge.getPendingUnlocksCount).toBe('function');
      
      // Toast state - Enhanced Compatibility
      expect(typeof bridge.toastVisible).toBe('boolean');
      expect(typeof bridge.activeToast).toBe('object'); // can be null
      expect(typeof bridge.toastData).toBe('object'); // Legacy compatibility
      
      // Debug
      expect(typeof bridge.getDebugInfo).toBe('function');
    });

    it('should maintain state synchronization with UI store', () => {
      const bridge = useUIStoreBridge();
      
      // Test loading state sync
      bridge.startLoading('test-operation');
      
      expect(bridge.isGlobalLoading).toBe(true);
      expect(bridge.isOperationLoading('test-operation')).toBe(true);
      
      // Test toast state sync
      bridge.showToast('Test message', 'success');
      
      expect(bridge.toastVisible).toBe(true);
      expect(bridge.activeToast).not.toBeNull();
      expect(bridge.activeToast!.message).toBe('Test message');
      
      // Test legacy toastData compatibility
      expect(bridge.toastData).not.toBeNull();
      expect(bridge.toastData!.message).toBe('Test message');
      expect(bridge.toastData!.type).toBe('success');
      
      // Test navigation sync
      bridge.trackNavigation('quiz-1');
      
      expect(bridge.lastNavigatedQuizId).toBe('quiz-1');
      expect(bridge.navigationHistory).toEqual(['quiz-1']);
    });
  });

  describe('Toast Compatibility - Enhanced', () => {
    it('should handle toast display compatible with old system', () => {
      const bridge = useUIStoreBridge();
      
      bridge.showToast('Compatibility test', 'warning', 5000);
      
      expect(bridge.toastVisible).toBe(true);
      expect(bridge.activeToast).toEqual(
        expect.objectContaining({
          message: 'Compatibility test',
          type: 'warning',
          duration: 5000
        })
      );
      
      // Test legacy toastData compatibility
      expect(bridge.toastData).toEqual(
        expect.objectContaining({
          message: 'Compatibility test',
          type: 'warning',
          duration: 5000
        })
      );
    });

    it('should handle toast hiding compatible with old system', () => {
      const bridge = useUIStoreBridge();
      
      // Show toast
      bridge.showSuccessToast('Success message');
      expect(bridge.toastVisible).toBe(true);
      expect(bridge.toastData).not.toBeNull();
      
      // Hide toast
      bridge.hideToast();
      expect(bridge.toastVisible).toBe(false);
      expect(bridge.activeToast).toBeNull();
      expect(bridge.toastData).toBeNull();
    });

    it('should support convenience toast methods', () => {
      const bridge = useUIStoreBridge();
      
      // Test each convenience method
      bridge.showSuccessToast('Success');
      expect(bridge.activeToast!.type).toBe('success');
      expect(bridge.toastData!.type).toBe('success');
      
      bridge.hideToast();
      bridge.showErrorToast('Error');
      expect(bridge.activeToast!.type).toBe('error');
      expect(bridge.toastData!.type).toBe('error');
      
      bridge.hideToast();
      bridge.showWarningToast('Warning');
      expect(bridge.activeToast!.type).toBe('warning');
      expect(bridge.toastData!.type).toBe('warning');
      
      bridge.hideToast();
      bridge.showInfoToast('Info');
      expect(bridge.activeToast!.type).toBe('info');
      expect(bridge.toastData!.type).toBe('info');
    });

    it('should maintain toast queue compatibility', () => {
      const bridge = useUIStoreBridge();
      
      // Show multiple toasts
      bridge.showToast('First toast', 'info');
      bridge.showToast('Second toast', 'success');
      bridge.showToast('Third toast', 'warning');
      
      // First should be active
      expect(bridge.toastVisible).toBe(true);
      expect(bridge.activeToast!.message).toBe('First toast');
      expect(bridge.toastData!.message).toBe('First toast');
      
      // Hide first, second should appear
      bridge.hideToast();
      expect(bridge.toastVisible).toBe(true);
      expect(bridge.activeToast!.message).toBe('Second toast');
      expect(bridge.toastData!.message).toBe('Second toast');
      
      // Hide second, third should appear
      bridge.hideToast();
      expect(bridge.toastVisible).toBe(true);
      expect(bridge.activeToast!.message).toBe('Third toast');
      expect(bridge.toastData!.message).toBe('Third toast');
      
      // Hide third, no more toasts
      bridge.hideToast();
      expect(bridge.toastVisible).toBe(false);
      expect(bridge.activeToast).toBeNull();
      expect(bridge.toastData).toBeNull();
    });

    it('should handle auto-hide toasts correctly', () => {
      const bridge = useUIStoreBridge();
      
      // Show toast with auto-hide
      bridge.showToast('Auto hide toast', 'info', 1000);
      
      expect(bridge.toastVisible).toBe(true);
      expect(bridge.activeToast!.message).toBe('Auto hide toast');
      
      // Fast-forward time
      jest.advanceTimersByTime(1000);
      
      // Should be hidden after duration
      expect(bridge.toastVisible).toBe(false);
      expect(bridge.activeToast).toBeNull();
      expect(bridge.toastData).toBeNull();
    });

    it('should not auto-hide when duration is 0', () => {
      const bridge = useUIStoreBridge();
      
      bridge.showToast('Persistent toast', 'info', 0);
      
      // Fast-forward a long time
      jest.advanceTimersByTime(10000);
      
      // Should still be visible
      expect(bridge.toastVisible).toBe(true);
      expect(bridge.activeToast).not.toBeNull();
      expect(bridge.toastData).not.toBeNull();
    });
  });

  describe('Loading State Compatibility', () => {
    it('should handle loading operations like old system', () => {
      const bridge = useUIStoreBridge();
      
      // Test default parameter handling
      bridge.startLoading(); // Should default to 'global'
      expect(bridge.isGlobalLoading).toBe(true);
      
      bridge.stopLoading(); // Should default to 'global'
      expect(bridge.isGlobalLoading).toBe(false);
    });

    it('should handle named operations', () => {
      const bridge = useUIStoreBridge();
      
      // Start named operation
      bridge.startLoading('quiz-loading');
      expect(bridge.isOperationLoading('quiz-loading')).toBe(true);
      expect(bridge.isGlobalLoading).toBe(true);
      
      // Stop named operation
      bridge.stopLoading('quiz-loading');
      expect(bridge.isOperationLoading('quiz-loading')).toBe(false);
      expect(bridge.isGlobalLoading).toBe(false);
    });

    it('should handle multiple concurrent operations', () => {
      const bridge = useUIStoreBridge();
      
      // Start multiple operations
      bridge.startLoading('operation-1');
      bridge.startLoading('operation-2');
      
      expect(bridge.isOperationLoading('operation-1')).toBe(true);
      expect(bridge.isOperationLoading('operation-2')).toBe(true);
      expect(bridge.isGlobalLoading).toBe(true);
      
      // Stop one operation
      bridge.stopLoading('operation-1');
      expect(bridge.isOperationLoading('operation-1')).toBe(false);
      expect(bridge.isOperationLoading('operation-2')).toBe(true);
      expect(bridge.isGlobalLoading).toBe(true); // Still has operation-2
      
      // Stop all operations
      bridge.stopLoading('operation-2');
      expect(bridge.isGlobalLoading).toBe(false);
    });

    it('should handle rapid loading/unloading operations', () => {
      const bridge = useUIStoreBridge();
      
      // Rapid operations
      for (let i = 0; i < 10; i++) {
        bridge.startLoading(`rapid-${i}`);
      }
      
      expect(bridge.isGlobalLoading).toBe(true);
      
      // Stop all
      for (let i = 0; i < 10; i++) {
        bridge.stopLoading(`rapid-${i}`);
      }
      
      expect(bridge.isGlobalLoading).toBe(false);
    });
  });

  describe('Navigation Compatibility', () => {
    it('should track navigation exactly like old system', () => {
      const bridge = useUIStoreBridge();
      
      // Track multiple navigations
      bridge.trackNavigation('quiz-1');
      bridge.trackNavigation('quiz-2');
      bridge.trackNavigation('quiz-3');
      
      expect(bridge.lastNavigatedQuizId).toBe('quiz-3');
      expect(bridge.navigationHistory).toEqual(['quiz-3', 'quiz-2', 'quiz-1']);
      
      // Clear navigation
      bridge.clearNavigationHistory();
      expect(bridge.lastNavigatedQuizId).toBeNull();
      expect(bridge.navigationHistory).toEqual([]);
    });

    it('should handle revisiting quizzes', () => {
      const bridge = useUIStoreBridge();
      
      bridge.trackNavigation('quiz-1');
      bridge.trackNavigation('quiz-2');
      bridge.trackNavigation('quiz-3');
      bridge.trackNavigation('quiz-1'); // Revisit
      
      expect(bridge.lastNavigatedQuizId).toBe('quiz-1');
      expect(bridge.navigationHistory).toEqual(['quiz-1', 'quiz-3', 'quiz-2']);
    });

    it('should maintain max 10 entries in history', () => {
      const bridge = useUIStoreBridge();
      
      // Add 15 entries
      for (let i = 1; i <= 15; i++) {
        bridge.trackNavigation(`quiz-${i}`);
      }
      
      expect(bridge.navigationHistory).toHaveLength(10);
      expect(bridge.navigationHistory[0]).toBe('quiz-15');
      expect(bridge.navigationHistory[9]).toBe('quiz-6');
    });

    it('should handle empty/null quiz IDs gracefully', () => {
      const bridge = useUIStoreBridge();
      
      // Should not crash with edge cases
      expect(() => bridge.trackNavigation('')).not.toThrow();
      expect(bridge.lastNavigatedQuizId).toBe('');
      expect(bridge.navigationHistory).toEqual(['']);
    });
  });

  describe('Pending Unlocks Compatibility', () => {
    it('should manage pending unlocks like old system', () => {
      const bridge = useUIStoreBridge();
      
      // Add pending unlocks
      bridge.addPendingUnlock('quiz-2', 'Quiz 2 Title');
      bridge.addPendingUnlock('quiz-3', 'Quiz 3 Title');
      
      expect(bridge.getPendingUnlocksCount()).toBe(2);
      
      // Check unlocks (should mark as shown)
      bridge.checkPendingUnlocks();
      
      // Fast-forward timers to trigger toast display
      jest.advanceTimersByTime(300);
      
      expect(bridge.getPendingUnlocksCount()).toBe(0);
      
      // Reset unlocks
      bridge.resetPendingUnlocks();
      expect(bridge.getPendingUnlocksCount()).toBe(2);
      
      // Clear unlocks
      bridge.clearPendingUnlocks();
      expect(bridge.getPendingUnlocksCount()).toBe(0);
    });

    it('should not add duplicate pending unlocks', () => {
      const bridge = useUIStoreBridge();
      
      bridge.addPendingUnlock('quiz-2', 'Quiz 2');
      bridge.addPendingUnlock('quiz-2', 'Quiz 2'); // Duplicate
      
      expect(bridge.getPendingUnlocksCount()).toBe(1);
    });

    it('should show unlock toasts when checking', () => {
      const bridge = useUIStoreBridge();
      
      bridge.addPendingUnlock('quiz-2', 'Amazing Quiz');
      bridge.checkPendingUnlocks();
      
      // Fast-forward to trigger toast
      jest.advanceTimersByTime(300);
      
      expect(bridge.toastVisible).toBe(true);
      expect(bridge.activeToast!.message).toContain('Amazing Quiz');
      expect(bridge.activeToast!.type).toBe('success');
      expect(bridge.toastData!.message).toContain('Amazing Quiz');
    });

    it('should handle multiple unlock toasts with delays', () => {
      const bridge = useUIStoreBridge();
      
      bridge.addPendingUnlock('quiz-1', 'First Quiz');
      bridge.addPendingUnlock('quiz-2', 'Second Quiz');
      bridge.addPendingUnlock('quiz-3', 'Third Quiz');
      
      bridge.checkPendingUnlocks();
      
      // First toast at 300ms
      jest.advanceTimersByTime(300);
      expect(bridge.activeToast!.message).toContain('First Quiz');
      
      // Hide first and advance to second toast (at 800ms total)
      bridge.hideToast();
      jest.advanceTimersByTime(500);
      expect(bridge.activeToast!.message).toContain('Second Quiz');
      
      // Hide second and advance to third toast (at 1300ms total)
      bridge.hideToast();
      jest.advanceTimersByTime(500);
      expect(bridge.activeToast!.message).toContain('Third Quiz');
    });

    it('should handle pending unlocks state changes correctly', () => {
      const bridge = useUIStoreBridge();
      
      // Initially empty
      expect(bridge.getPendingUnlocksCount()).toBe(0);
      
      // Add unlocks
      bridge.addPendingUnlock('quiz-1', 'Quiz 1');
      bridge.addPendingUnlock('quiz-2', 'Quiz 2');
      expect(bridge.getPendingUnlocksCount()).toBe(2);
      
      // Check unlocks (marks as shown)
      bridge.checkPendingUnlocks();
      expect(bridge.getPendingUnlocksCount()).toBe(0);
      
      // Add another unlock
      bridge.addPendingUnlock('quiz-3', 'Quiz 3');
      expect(bridge.getPendingUnlocksCount()).toBe(1);
      
      // Reset all to unshown
      bridge.resetPendingUnlocks();
      expect(bridge.getPendingUnlocksCount()).toBe(3); // All 3 now unshown
      
      // Clear all
      bridge.clearPendingUnlocks();
      expect(bridge.getPendingUnlocksCount()).toBe(0);
    });
  });

  describe('Convenience Hooks', () => {
    it('should provide useToastNotifications hook', () => {
      const notifications = useToastNotifications();
      
      expect(typeof notifications.notifySuccess).toBe('function');
      expect(typeof notifications.notifyError).toBe('function');
      expect(typeof notifications.notifyInfo).toBe('function');
      expect(typeof notifications.notifyWarning).toBe('function');
      
      // Test functionality
      notifications.notifySuccess('Success notification');
      
      const bridge = useUIStoreBridge();
      expect(bridge.activeToast!.type).toBe('success');
      expect(bridge.toastData!.type).toBe('success');
      expect(bridge.activeToast!.message).toBe('Success notification');
    });

    it('should provide useOperationLoading hook', () => {
      const operationLoader = useOperationLoading('test-operation');
      
      expect(typeof operationLoader.isLoading).toBe('boolean');
      expect(typeof operationLoader.startLoading).toBe('function');
      expect(typeof operationLoader.stopLoading).toBe('function');
      
      // Test functionality
      expect(operationLoader.isLoading).toBe(false);
      
      operationLoader.startLoading();
      expect(operationLoader.isLoading).toBe(true);
      
      operationLoader.stopLoading();
      expect(operationLoader.isLoading).toBe(false);
    });

    it('should provide useNavigationTracking hook', () => {
      const navigation = useNavigationTracking();
      
      expect(typeof navigation.lastQuizId).toBe('object'); // can be null
      expect(Array.isArray(navigation.history)).toBe(true);
      expect(typeof navigation.trackQuizNavigation).toBe('function');
      expect(typeof navigation.clearHistory).toBe('function');
      
      // Test functionality
      navigation.trackQuizNavigation('quiz-test');
      expect(navigation.lastQuizId).toBe('quiz-test');
      expect(navigation.history).toEqual(['quiz-test']);
      
      navigation.clearHistory();
      expect(navigation.lastQuizId).toBeNull();
      expect(navigation.history).toEqual([]);
    });

    it('should provide usePendingUnlocks hook', () => {
      const unlocks = usePendingUnlocks();
      
      expect(typeof unlocks.addPendingUnlock).toBe('function');
      expect(typeof unlocks.checkPendingUnlocks).toBe('function');
      expect(typeof unlocks.clearPendingUnlocks).toBe('function');
      expect(typeof unlocks.resetPendingUnlocks).toBe('function');
      expect(typeof unlocks.getPendingUnlocksCount).toBe('function');
      
      // Test functionality
      unlocks.addPendingUnlock('quiz-unlock-test', 'Test Quiz');
      expect(unlocks.getPendingUnlocksCount()).toBe(1);
      
      unlocks.clearPendingUnlocks();
      expect(unlocks.getPendingUnlocksCount()).toBe(0);
    });

    it('should allow hooks to work independently', () => {
      const toasts = useToastNotifications();
      const loading = useOperationLoading('independent-test');
      const navigation = useNavigationTracking();
      const unlocks = usePendingUnlocks();
      
      // Use all hooks simultaneously
      loading.startLoading();
      toasts.notifyInfo('Independent test');
      navigation.trackQuizNavigation('independent-quiz');
      unlocks.addPendingUnlock('independent-unlock', 'Independent Quiz');
      
      // Verify all work correctly
      expect(loading.isLoading).toBe(true);
      
      const bridge = useUIStoreBridge();
      expect(bridge.activeToast!.message).toBe('Independent test');
      expect(navigation.lastQuizId).toBe('independent-quiz');
      expect(unlocks.getPendingUnlocksCount()).toBe(1);
      
      // Cleanup
      loading.stopLoading();
      expect(loading.isLoading).toBe(false);
    });
  });

  describe('Performance and Stability', () => {
    it('should handle rapid state changes without issues', () => {
      const bridge = useUIStoreBridge();
      
      // Rapid operations
      for (let i = 0; i < 50; i++) {
        bridge.showToast(`Toast ${i}`, 'info');
        bridge.startLoading(`operation-${i}`);
        bridge.trackNavigation(`quiz-${i}`);
      }
      
      // Should maintain consistency
      expect(bridge.toastVisible).toBe(true);
      expect(bridge.isGlobalLoading).toBe(true);
      expect(bridge.lastNavigatedQuizId).toBe('quiz-49');
      
      // Toast data should be consistent
      expect(bridge.toastData).not.toBeNull();
      expect(bridge.toastData!.message).toBe('Toast 0'); // First toast is active
      
      // Navigation should have limited history
      expect(bridge.navigationHistory.length).toBeLessThanOrEqual(10);
    });

    it('should handle memory efficiently with large operations', () => {
      const bridge = useUIStoreBridge();
      
      // Simulate many operations over time
      for (let i = 0; i < 100; i++) {
        bridge.startLoading(`temp-${i}`);
        bridge.stopLoading(`temp-${i}`);
      }
      
      expect(bridge.isGlobalLoading).toBe(false);
      
      // Add and remove many unlocks
      for (let i = 0; i < 50; i++) {
        bridge.addPendingUnlock(`temp-unlock-${i}`, `Temp Quiz ${i}`);
      }
      
      bridge.clearPendingUnlocks();
      expect(bridge.getPendingUnlocksCount()).toBe(0);
    });

    it('should maintain state consistency during concurrent operations', () => {
      const bridge = useUIStoreBridge();
      
      // Concurrent operations
      Promise.all([
        // Loading operations
        new Promise(resolve => {
          bridge.startLoading('concurrent-1');
          setTimeout(() => {
            bridge.stopLoading('concurrent-1');
            resolve(true);
          }, 10);
        }),
        // Toast operations
        new Promise(resolve => {
          bridge.showToast('Concurrent toast', 'info');
          setTimeout(() => {
            bridge.hideToast();
            resolve(true);
          }, 15);
        }),
        // Navigation operations
        new Promise(resolve => {
          bridge.trackNavigation('concurrent-quiz');
          resolve(true);
        })
      ]);
      
      // Should not crash and maintain consistency
      expect(() => bridge.getDebugInfo()).not.toThrow();
    });
  });

  describe('Debug Information', () => {
    it('should provide debug info compatible with old system', () => {
      const bridge = useUIStoreBridge();
      
      // Setup some state
      bridge.showToast('Debug toast', 'info');
      bridge.startLoading('debug-operation');
      bridge.trackNavigation('debug-quiz');
      bridge.addPendingUnlock('debug-unlock', 'Debug Unlock');
      
      const debugInfo = bridge.getDebugInfo();
      
      expect(debugInfo).toEqual(
        expect.objectContaining({
          toastCount: expect.any(Number),
          activeOperations: expect.any(Array),
          navigationHistoryCount: expect.any(Number),
          pendingUnlocksCount: expect.any(Number),
          unshownUnlocksCount: expect.any(Number)
        })
      );
      
      expect(debugInfo.toastCount).toBeGreaterThan(0);
      expect(debugInfo.activeOperations).toContain('debug-operation');
      expect(debugInfo.navigationHistoryCount).toBeGreaterThan(0);
      expect(debugInfo.pendingUnlocksCount).toBeGreaterThan(0);
      expect(debugInfo.unshownUnlocksCount).toBeGreaterThan(0);
    });

    it('should provide accurate counts in debug info', () => {
      const bridge = useUIStoreBridge();
      
      // Known state setup
      bridge.showToast('Toast 1', 'info');
      bridge.showToast('Toast 2', 'success'); // Queued
      bridge.startLoading('op-1');
      bridge.startLoading('op-2');
      bridge.trackNavigation('quiz-1');
      bridge.trackNavigation('quiz-2');
      bridge.addPendingUnlock('unlock-1', 'Unlock 1');
      bridge.addPendingUnlock('unlock-2', 'Unlock 2');
      
      const debugInfo = bridge.getDebugInfo();
      
      expect(debugInfo.toastCount).toBe(2); // 1 active + 1 queued
      expect(debugInfo.activeOperations).toEqual(['op-1', 'op-2']);
      expect(debugInfo.navigationHistoryCount).toBe(2);
      expect(debugInfo.pendingUnlocksCount).toBe(2);
      expect(debugInfo.unshownUnlocksCount).toBe(2);
    });

    it('should update debug info as state changes', () => {
      const bridge = useUIStoreBridge();
      
      // Initial state
      let debugInfo = bridge.getDebugInfo();
      expect(debugInfo.toastCount).toBe(0);
      expect(debugInfo.activeOperations).toEqual([]);
      
      // Add state
      bridge.showToast('Test', 'info');
      bridge.startLoading('test-op');
      
      debugInfo = bridge.getDebugInfo();
      expect(debugInfo.toastCount).toBe(1);
      expect(debugInfo.activeOperations).toEqual(['test-op']);
      
      // Remove state
      bridge.hideToast();
      bridge.stopLoading('test-op');
      
      debugInfo = bridge.getDebugInfo();
      expect(debugInfo.toastCount).toBe(0);
      expect(debugInfo.activeOperations).toEqual([]);
    });
  });

  describe('Edge Cases and Error Handling', () => {
    it('should handle null/undefined values gracefully', () => {
      const bridge = useUIStoreBridge();
      
      // Should not crash with edge cases
      expect(() => bridge.showToast('', 'info')).not.toThrow();
      expect(() => bridge.trackNavigation('')).not.toThrow();
      expect(() => bridge.addPendingUnlock('', '')).not.toThrow();
      
      // Should handle operations on non-existent items
      expect(() => bridge.stopLoading('non-existent')).not.toThrow();
      expect(bridge.isOperationLoading('non-existent')).toBe(false);
    });

    it('should maintain toast state consistency during queue operations', () => {
      const bridge = useUIStoreBridge();
      
      // Add multiple toasts
      bridge.showToast('Toast 1', 'info');
      bridge.showToast('Toast 2', 'success');
      bridge.showToast('Toast 3', 'warning');
      
      // Verify initial state
      expect(bridge.toastVisible).toBe(true);
      expect(bridge.activeToast!.message).toBe('Toast 1');
      expect(bridge.toastData!.message).toBe('Toast 1');
      
      // Hide and verify next toast appears
      bridge.hideToast();
      expect(bridge.toastVisible).toBe(true);
      expect(bridge.activeToast!.message).toBe('Toast 2');
      expect(bridge.toastData!.message).toBe('Toast 2');
      
      // Continue until empty
      bridge.hideToast();
      expect(bridge.toastVisible).toBe(true);
      expect(bridge.activeToast!.message).toBe('Toast 3');
      expect(bridge.toastData!.message).toBe('Toast 3');
      
      bridge.hideToast();
      expect(bridge.toastVisible).toBe(false);
      expect(bridge.activeToast).toBeNull();
      expect(bridge.toastData).toBeNull();
    });

    it('should handle rapid show/hide operations', () => {
      const bridge = useUIStoreBridge();
      
      // Rapid show/hide cycles
      for (let i = 0; i < 20; i++) {
        bridge.showToast(`Rapid ${i}`, 'info');
        if (i % 2 === 0) {
          bridge.hideToast();
        }
      }
      
      // Should maintain consistent state
      expect(bridge.toastVisible).toBe(true); // Odd number of operations
      expect(bridge.activeToast).not.toBeNull();
      expect(bridge.toastData).not.toBeNull();
      
      // Clear remaining toasts
      while (bridge.toastVisible) {
        bridge.hideToast();
      }
      
      expect(bridge.toastVisible).toBe(false);
      expect(bridge.activeToast).toBeNull();
      expect(bridge.toastData).toBeNull();
    });

    it('should handle edge cases in navigation tracking', () => {
      const bridge = useUIStoreBridge();
      
      // Track same quiz multiple times
      bridge.trackNavigation('same-quiz');
      bridge.trackNavigation('same-quiz');
      bridge.trackNavigation('same-quiz');
      
      expect(bridge.navigationHistory).toEqual(['same-quiz']);
      expect(bridge.lastNavigatedQuizId).toBe('same-quiz');
      
      // Track with special characters
      bridge.trackNavigation('quiz-with-special-chars-äöü');
      expect(bridge.lastNavigatedQuizId).toBe('quiz-with-special-chars-äöü');
      
      // Track very long quiz ID
      const longQuizId = 'a'.repeat(500);
      bridge.trackNavigation(longQuizId);
      expect(bridge.lastNavigatedQuizId).toBe(longQuizId);
    });

    it('should handle edge cases in pending unlocks', () => {
      const bridge = useUIStoreBridge();
      
      // Add unlock with empty title
      bridge.addPendingUnlock('quiz-empty-title', '');
      expect(bridge.getPendingUnlocksCount()).toBe(1);
      
      // Add unlock with very long title
      const longTitle = 'Very Long Quiz Title '.repeat(50);
      bridge.addPendingUnlock('quiz-long-title', longTitle);
      expect(bridge.getPendingUnlocksCount()).toBe(2);
      
      // Check unlocks and verify toast handling
      bridge.checkPendingUnlocks();
      jest.advanceTimersByTime(300);
      
      expect(bridge.toastVisible).toBe(true);
      // Should handle empty title gracefully
      expect(bridge.activeToast!.message).toContain('🎉');
    });

    it('should handle timer edge cases', () => {
      const bridge = useUIStoreBridge();
      
      // Show toast with 0 duration (permanent)
      bridge.showToast('Permanent toast', 'info', 0);
      
      // Fast-forward time - should still be visible
      jest.advanceTimersByTime(10000);
      expect(bridge.toastVisible).toBe(true);
      
      // Show toast with very short duration
      bridge.hideToast();
      bridge.showToast('Quick toast', 'info', 1);
      
      jest.advanceTimersByTime(1);
      expect(bridge.toastVisible).toBe(false);
    });

    it('should handle state corruption gracefully', () => {
      const bridge = useUIStoreBridge();
      
      // Try to break the state with extreme operations
      for (let i = 0; i < 1000; i++) {
        bridge.startLoading(`stress-${i}`);
        bridge.showToast(`Stress ${i}`, 'info');
        bridge.trackNavigation(`stress-quiz-${i}`);
        bridge.addPendingUnlock(`stress-unlock-${i}`, `Stress Quiz ${i}`);
        
        if (i % 10 === 0) {
          bridge.stopLoading(`stress-${i}`);
          bridge.hideToast();
        }
      }
      
      // Should still provide valid debug info
      const debugInfo = bridge.getDebugInfo();
      expect(typeof debugInfo.toastCount).toBe('number');
      expect(Array.isArray(debugInfo.activeOperations)).toBe(true);
      expect(typeof debugInfo.navigationHistoryCount).toBe('number');
      expect(typeof debugInfo.pendingUnlocksCount).toBe('number');
      
      // Should be able to clear state
      expect(() => bridge.clearNavigationHistory()).not.toThrow();
      expect(() => bridge.clearPendingUnlocks()).not.toThrow();
    });
  });

  describe('Integration with Original UIStateProvider', () => {
    it('should provide exact same API surface', () => {
      const bridge = useUIStoreBridge();
      
      // All methods that UIStateProvider should have
      const expectedMethods = [
        'isGlobalLoading',
        'isOperationLoading',
        'startLoading',
        'stopLoading',
        'showToast',
        'showSuccessToast',
        'showErrorToast',
        'showInfoToast',
        'showWarningToast',
        'hideToast',
        'lastNavigatedQuizId',
        'navigationHistory',
        'trackNavigation',
        'clearNavigationHistory',
        'addPendingUnlock',
        'checkPendingUnlocks',
        'clearPendingUnlocks',
        'resetPendingUnlocks',
        'getPendingUnlocksCount'
      ];
      
      expectedMethods.forEach(method => {
        expect(bridge).toHaveProperty(method);
      });
      
      // Additional properties for enhanced compatibility
      expect(bridge).toHaveProperty('activeToast');
      expect(bridge).toHaveProperty('toastVisible');
      expect(bridge).toHaveProperty('toastData'); // Legacy compatibility
      expect(bridge).toHaveProperty('getDebugInfo');
    });

    it('should behave identically to UIStateProvider for common operations', () => {
      const bridge = useUIStoreBridge();
      
      // Test loading behavior matches expected UIStateProvider behavior
      expect(bridge.isGlobalLoading).toBe(false);
      
      bridge.startLoading('global');
      expect(bridge.isGlobalLoading).toBe(true);
      
      bridge.startLoading('specific-operation');
      expect(bridge.isOperationLoading('specific-operation')).toBe(true);
      expect(bridge.isGlobalLoading).toBe(true);
      
      bridge.stopLoading('global');
      expect(bridge.isGlobalLoading).toBe(true); // Still has specific-operation
      
      bridge.stopLoading('specific-operation');
      expect(bridge.isGlobalLoading).toBe(false);
      
      // Test toast behavior matches expected behavior
      bridge.showSuccessToast('Test success');
      expect(bridge.toastVisible).toBe(true);
      expect(bridge.activeToast!.type).toBe('success');
      expect(bridge.toastData!.type).toBe('success');
      
      // Test navigation behavior
      bridge.trackNavigation('test-quiz');
      expect(bridge.lastNavigatedQuizId).toBe('test-quiz');
      expect(bridge.navigationHistory[0]).toBe('test-quiz');
    });

    it('should handle all toast types correctly', () => {
      const bridge = useUIStoreBridge();
      
      const toastTypes: Array<'success' | 'error' | 'info' | 'warning'> = [
        'success', 'error', 'info', 'warning'
      ];
      
      toastTypes.forEach(type => {
        bridge.showToast(`Test ${type}`, type);
        expect(bridge.activeToast!.type).toBe(type);
        expect(bridge.toastData!.type).toBe(type);
        bridge.hideToast();
      });
    });

    it('should provide seamless migration path', () => {
      const bridge = useUIStoreBridge();
      
      // Old UIStateProvider usage patterns should work identically
      
      // Pattern 1: Loading with operation tracking
      bridge.startLoading('quiz-loading');
      expect(bridge.isOperationLoading('quiz-loading')).toBe(true);
      
      // Pattern 2: Toast notifications
      bridge.showSuccessToast('Quiz completed!');
      expect(bridge.toastVisible).toBe(true);
      
      // Pattern 3: Navigation tracking
      bridge.trackNavigation('completed-quiz');
      expect(bridge.lastNavigatedQuizId).toBe('completed-quiz');
      
      // Pattern 4: Unlock notifications
      bridge.addPendingUnlock('new-quiz', 'New Quiz Title');
      bridge.checkPendingUnlocks();
      
      jest.advanceTimersByTime(300);
      expect(bridge.activeToast!.message).toContain('New Quiz Title');
      
      // Pattern 5: Cleanup
      bridge.clearNavigationHistory();
      bridge.clearPendingUnlocks();
      
      expect(bridge.navigationHistory).toEqual([]);
      expect(bridge.getPendingUnlocksCount()).toBe(0);
    });
  });

  describe('Real-world Usage Scenarios', () => {
    it('should handle typical quiz completion workflow', () => {
      const bridge = useUIStoreBridge();
      
      // 1. Start loading when submitting answer
      bridge.startLoading('submit-answer');
      expect(bridge.isGlobalLoading).toBe(true);
      
      // 2. Show success toast for correct answer
      bridge.stopLoading('submit-answer');
      bridge.showSuccessToast('Correct! Well done!');
      expect(bridge.toastVisible).toBe(true);
      
      // 3. Add pending unlock for completed quiz
      bridge.addPendingUnlock('next-quiz', 'Advanced Animals');
      expect(bridge.getPendingUnlocksCount()).toBe(1);
      
      // 4. Track navigation to next screen
      bridge.trackNavigation('quiz-overview');
      expect(bridge.lastNavigatedQuizId).toBe('quiz-overview');
      
      // 5. Check and show unlock notifications
      bridge.checkPendingUnlocks();
      jest.advanceTimersByTime(300);
      
      // Should have both success toast and unlock notification
      expect(bridge.toastVisible).toBe(true);
      expect(bridge.getPendingUnlocksCount()).toBe(0); // Marked as shown
    });

    it('should handle error scenarios gracefully', () => {
      const bridge = useUIStoreBridge();
      
      // 1. Start loading
      bridge.startLoading('quiz-load');
      
      // 2. Simulate error
      bridge.stopLoading('quiz-load');
      bridge.showErrorToast('Failed to load quiz. Please try again.');
      
      expect(bridge.toastVisible).toBe(true);
      expect(bridge.activeToast!.type).toBe('error');
      expect(bridge.toastData!.type).toBe('error');
      
      // 3. User dismisses error and retries
      bridge.hideToast();
      bridge.startLoading('quiz-retry');
      
      // 4. Success on retry
      bridge.stopLoading('quiz-retry');
      bridge.showSuccessToast('Quiz loaded successfully!');
      
      expect(bridge.activeToast!.type).toBe('success');
    });

    it('should handle rapid user interactions', () => {
      const bridge = useUIStoreBridge();
      
      // Simulate rapid user actions
      bridge.startLoading('action-1');
      bridge.showToast('Action 1', 'info');
      bridge.trackNavigation('screen-1');
      
      bridge.startLoading('action-2');
      bridge.showToast('Action 2', 'success');
      bridge.trackNavigation('screen-2');
      
      bridge.stopLoading('action-1');
      bridge.hideToast(); // Hide action 1 toast
      bridge.trackNavigation('screen-3');
      
      bridge.stopLoading('action-2');
      
      // Verify final state is consistent
      expect(bridge.isGlobalLoading).toBe(false);
      expect(bridge.activeToast!.message).toBe('Action 2'); // Next in queue
      expect(bridge.lastNavigatedQuizId).toBe('screen-3');
      expect(bridge.navigationHistory[0]).toBe('screen-3');
    });

    it('should handle app lifecycle scenarios', () => {
      const bridge = useUIStoreBridge();
      
      // Simulate app usage session
      
      // 1. App starts, user navigates
      bridge.trackNavigation('home');
      bridge.trackNavigation('quiz-list');
      bridge.trackNavigation('quiz-1');
      
      // 2. User completes quiz, gets unlock
      bridge.showSuccessToast('Quiz completed!');
      bridge.addPendingUnlock('quiz-2', 'Advanced Quiz');
      
      // 3. User navigates away and back
      bridge.trackNavigation('settings');
      bridge.trackNavigation('quiz-list');
      
      // 4. Check for pending unlocks (simulating return to quiz list)
      bridge.checkPendingUnlocks();
      jest.advanceTimersByTime(300);
      
      expect(bridge.activeToast!.message).toContain('Advanced Quiz');
      
      // 5. User clears data (simulating reset)
      bridge.clearNavigationHistory();
      bridge.clearPendingUnlocks();
      
      expect(bridge.navigationHistory).toEqual([]);
      expect(bridge.getPendingUnlocksCount()).toBe(0);
    });

    it('should handle background/foreground transitions', () => {
      const bridge = useUIStoreBridge();
      
      // Setup active state
      bridge.startLoading('background-task');
      bridge.showToast('Processing...', 'info', 0); // Persistent
      bridge.trackNavigation('active-quiz');
      bridge.addPendingUnlock('background-unlock', 'Background Quiz');
      
      // Simulate app going to background (timers might be paused)
      // When app returns to foreground, state should be preserved
      
      expect(bridge.isGlobalLoading).toBe(true);
      expect(bridge.toastVisible).toBe(true);
      expect(bridge.lastNavigatedQuizId).toBe('active-quiz');
      expect(bridge.getPendingUnlocksCount()).toBe(1);
      
      // Simulate completing background task
      bridge.stopLoading('background-task');
      bridge.hideToast();
      bridge.checkPendingUnlocks();
      
      jest.advanceTimersByTime(300);
      expect(bridge.activeToast!.message).toContain('Background Quiz');
    });
  });

  describe('Compatibility with Test Environment', () => {
    it('should work correctly in Jest test environment', () => {
      const bridge = useUIStoreBridge();
      
      // Verify Jest timers work correctly
      bridge.showToast('Test toast', 'info', 1000);
      expect(bridge.toastVisible).toBe(true);
      
      jest.advanceTimersByTime(1000);
      expect(bridge.toastVisible).toBe(false);
      
      // Verify state persistence in tests
      bridge.trackNavigation('test-quiz');
      bridge.addPendingUnlock('test-unlock', 'Test Quiz');
      
      expect(bridge.lastNavigatedQuizId).toBe('test-quiz');
      expect(bridge.getPendingUnlocksCount()).toBe(1);
    });

    it('should provide deterministic behavior for testing', () => {
      const bridge = useUIStoreBridge();
      
      // Same operations should yield same results
      const operations = () => {
        bridge.showToast('Deterministic toast', 'info');
        bridge.startLoading('deterministic-op');
        bridge.trackNavigation('deterministic-quiz');
        bridge.addPendingUnlock('deterministic-unlock', 'Deterministic Quiz');
      };
      
      // Run operations
      operations();
      const state1 = {
        toastVisible: bridge.toastVisible,
        isLoading: bridge.isGlobalLoading,
        lastQuiz: bridge.lastNavigatedQuizId,
        unlockCount: bridge.getPendingUnlocksCount()
      };
      
      // Reset and run again
      bridge.hideToast();
      bridge.stopLoading('deterministic-op');
      bridge.clearNavigationHistory();
      bridge.clearPendingUnlocks();
      
      operations();
      const state2 = {
        toastVisible: bridge.toastVisible,
        isLoading: bridge.isGlobalLoading,
        lastQuiz: bridge.lastNavigatedQuizId,
        unlockCount: bridge.getPendingUnlocksCount()
      };
      
      expect(state1).toEqual(state2);
    });

    it('should clean up properly between tests', () => {
      const bridge = useUIStoreBridge();
      
      // Setup state
      bridge.showToast('Cleanup test', 'info');
      bridge.startLoading('cleanup-op');
      bridge.trackNavigation('cleanup-quiz');
      bridge.addPendingUnlock('cleanup-unlock', 'Cleanup Quiz');
      
      // Verify state exists
      expect(bridge.toastVisible).toBe(true);
      expect(bridge.isGlobalLoading).toBe(true);
      expect(bridge.lastNavigatedQuizId).toBe('cleanup-quiz');
      expect(bridge.getPendingUnlocksCount()).toBe(1);
      
      // Manual cleanup (normally done in beforeEach)
      resetUIStore();
      
      // Verify clean state
      const cleanBridge = useUIStoreBridge();
      expect(cleanBridge.toastVisible).toBe(false);
      expect(cleanBridge.isGlobalLoading).toBe(false);
      expect(cleanBridge.lastNavigatedQuizId).toBeNull();
      expect(cleanBridge.getPendingUnlocksCount()).toBe(0);
    });
  });
});