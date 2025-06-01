// src/stores/__tests__/useUIStoreBridge.test.ts
import { useUIStoreBridge } from '../useUIStoreBridge';
import { useUIStore } from '../uiStore';

describe('UI Store Bridge', () => {
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
      
      // Toast state
      expect(typeof bridge.toastVisible).toBe('boolean');
      expect(typeof bridge.activeToast).toBe('object'); // can be null
      
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
      
      // Test navigation sync
      bridge.trackNavigation('quiz-1');
      
      expect(bridge.lastNavigatedQuizId).toBe('quiz-1');
      expect(bridge.navigationHistory).toEqual(['quiz-1']);
    });
  });

  describe('Toast Compatibility', () => {
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
    });

    it('should handle toast hiding compatible with old system', () => {
      const bridge = useUIStoreBridge();
      
      // Show toast
      bridge.showSuccessToast('Success message');
      expect(bridge.toastVisible).toBe(true);
      
      // Hide toast
      bridge.hideToast();
      expect(bridge.toastVisible).toBe(false);
      expect(bridge.activeToast).toBeNull();
    });

    it('should support convenience toast methods', () => {
      const bridge = useUIStoreBridge();
      
      // Test each convenience method
      bridge.showSuccessToast('Success');
      expect(bridge.activeToast!.type).toBe('success');
      
      bridge.hideToast();
      bridge.showErrorToast('Error');
      expect(bridge.activeToast!.type).toBe('error');
      
      bridge.hideToast();
      bridge.showWarningToast('Warning');
      expect(bridge.activeToast!.type).toBe('warning');
      
      bridge.hideToast();
      bridge.showInfoToast('Info');
      expect(bridge.activeToast!.type).toBe('info');
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
      expect(bridge.getPendingUnlocksCount()).toBe(0);
      
      // Reset unlocks
      bridge.resetPendingUnlocks();
      expect(bridge.getPendingUnlocksCount()).toBe(2);
      
      // Clear unlocks
      bridge.clearPendingUnlocks();
      expect(bridge.getPendingUnlocksCount()).toBe(0);
    });
  });

  describe('Convenience Hooks', () => {
    it('should provide useToastNotifications hook', () => {
      const { useToastNotifications } = require('../useUIStoreBridge');
      const notifications = useToastNotifications();
      
      expect(typeof notifications.notifySuccess).toBe('function');
      expect(typeof notifications.notifyError).toBe('function');
      expect(typeof notifications.notifyInfo).toBe('function');
      expect(typeof notifications.notifyWarning).toBe('function');
      
      // Test functionality
      notifications.notifySuccess('Success notification');
      
      const bridge = useUIStoreBridge();
      expect(bridge.activeToast!.type).toBe('success');
    });

    it('should provide useOperationLoading hook', () => {
      const { useOperationLoading } = require('../useUIStoreBridge');
      const operationLoader = useOperationLoading('test-operation');
      
      expect(typeof operationLoader.isLoading).toBe('boolean');
      expect(typeof operationLoader.startLoading).toBe('function');
      expect(typeof operationLoader.stopLoading).toBe('function');
      
      // Test functionality
      operationLoader.startLoading();
      expect(operationLoader.isLoading).toBe(true);
      
      operationLoader.stopLoading();
      expect(operationLoader.isLoading).toBe(false);
    });

    it('should provide useNavigationTracking hook', () => {
      const { useNavigationTracking } = require('../useUIStoreBridge');
      const navigation = useNavigationTracking();
      
      expect(typeof navigation.lastQuizId).toBe('object'); // can be null
      expect(Array.isArray(navigation.history)).toBe(true);
      expect(typeof navigation.trackQuizNavigation).toBe('function');
      expect(typeof navigation.clearHistory).toBe('function');
      
      // Test functionality
      navigation.trackQuizNavigation('quiz-test');
      expect(navigation.lastQuizId).toBe('quiz-test');
      expect(navigation.history).toEqual(['quiz-test']);
    });

    it('should provide usePendingUnlocks hook', () => {
      const { usePendingUnlocks } = require('../useUIStoreBridge');
      const unlocks = usePendingUnlocks();
      
      expect(typeof unlocks.addPendingUnlock).toBe('function');
      expect(typeof unlocks.checkPendingUnlocks).toBe('function');
      expect(typeof unlocks.clearPendingUnlocks).toBe('function');
      expect(typeof unlocks.resetPendingUnlocks).toBe('function');
      expect(typeof unlocks.getPendingUnlocksCount).toBe('function');
      
      // Test functionality
      unlocks.addPendingUnlock('quiz-unlock-test', 'Test Quiz');
      expect(unlocks.getPendingUnlocksCount()).toBe(1);
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
    });
  });
});