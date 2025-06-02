// src/stores/TestUIIntegration.tsx - Fixed Version
import React, { useState, useEffect } from 'react';
import { View, Text, ScrollView, TouchableOpacity, StyleSheet } from 'react-native';
import { useUIStoreBridge } from './useUIStoreBridge';
import { useUIState } from '@/src/quiz/contexts/UIStateProvider';
import { Toast } from '@/src/quiz/components/Toast';

interface TestResult {
  timestamp: string;
  test: string;
  result: 'success' | 'warning' | 'error';
  message: string;
  details?: any;
}

export function TestUIIntegration() {
  const newUISystem = useUIStoreBridge();
  const oldUISystem = useUIState();
  const [testResults, setTestResults] = useState<TestResult[]>([]);
  const [autoComparison, setAutoComparison] = useState<any>(null);

  const addTestResult = (test: string, result: 'success' | 'warning' | 'error', message: string, details?: any) => {
    const newResult: TestResult = {
      timestamp: new Date().toLocaleTimeString(),
      test,
      result,
      message,
      details
    };
    setTestResults(prev => [newResult, ...prev.slice(0, 19)]);
  };

  // Auto-Comparison zwischen UI-Systemen - Fixed Toast Comparison
  useEffect(() => {
    const runAutoComparison = () => {
      try {
        const comparison = {
          loadingMatch: newUISystem.isGlobalLoading === oldUISystem.isGlobalLoading,
          // Fixed: Compare toast visibility correctly
          toastVisibleMatch: newUISystem.toastVisible === !!oldUISystem.toastData, 
          navigationMatch: newUISystem.lastNavigatedQuizId === oldUISystem.lastNavigatedQuizId,
          historyLengthMatch: newUISystem.navigationHistory.length === oldUISystem.navigationHistory.length,
          pendingUnlocksMatch: newUISystem.getPendingUnlocksCount() === oldUISystem.getPendingUnlocksCount(),
          allMatches: false
        };

        comparison.allMatches = Object.values(comparison).slice(0, 5).every(Boolean);

        setAutoComparison(comparison);

        if (comparison.allMatches) {
          addTestResult('Auto-Comparison', 'success', 'UI-Systeme synchron');
        } else {
          const mismatches = Object.entries(comparison)
            .filter(([key, value]) => key !== 'allMatches' && !value)
            .map(([key]) => key);
          addTestResult('Auto-Comparison', 'warning', `Unterschiede: ${mismatches.join(', ')}`, comparison);
        }
      } catch (error) {
        addTestResult('Auto-Comparison', 'error', `Fehler: ${error}`, error);
      }
    };

    const timer = setTimeout(runAutoComparison, 1000);
    return () => clearTimeout(timer);
  }, [newUISystem, oldUISystem]);

  const runToastTest = () => {
    try {
      // Clear any existing toasts first
      if (newUISystem.toastVisible) {
        newUISystem.hideToast();
      }
      
      // Test verschiedene Toast-Typen mit Delays für bessere Sichtbarkeit
      setTimeout(() => {
        newUISystem.showSuccessToast('New System: Success Toast');
        oldUISystem.showSuccessToast('Old System: Success Toast');
        
        addTestResult('Toast Test', 'success', 
          `Success Toasts - New: ${newUISystem.toastVisible}, Old: ${!!oldUISystem.toastData}`);
      }, 100);

      setTimeout(() => {
        // Hide old system toast to show next
        if (oldUISystem.toastData) {
          oldUISystem.hideToast();
        }
        if (newUISystem.toastVisible) {
          newUISystem.hideToast();
        }
        
        newUISystem.showErrorToast('New System: Error Toast');
        oldUISystem.showErrorToast('Old System: Error Toast');
        
        addTestResult('Toast Test', 'success', 
          `Error Toasts - New: ${newUISystem.toastVisible}, Old: ${!!oldUISystem.toastData}`);
      }, 2000);

      setTimeout(() => {
        // Hide previous toasts
        if (oldUISystem.toastData) {
          oldUISystem.hideToast();
        }
        if (newUISystem.toastVisible) {
          newUISystem.hideToast();
        }
        
        newUISystem.showWarningToast('New System: Warning Toast');
        oldUISystem.showWarningToast('Old System: Warning Toast');
        
        addTestResult('Toast Test', 'success', 
          `Warning Toasts - New: ${newUISystem.toastVisible}, Old: ${!!oldUISystem.toastData}`);
      }, 4000);

      addTestResult('Toast Test', 'success', 'Toast-Sequenz gestartet');
    } catch (error) {
      addTestResult('Toast Test', 'error', `Toast Test Error: ${error}`, error);
    }
  };

  const runLoadingTest = () => {
    try {
      // Test Loading States
      newUISystem.startLoading('new-system-test');
      oldUISystem.startLoading('old-system-test');

      addTestResult('Loading Test', 'success', 
        `Loading States Started - New: ${newUISystem.isGlobalLoading}, Old: ${oldUISystem.isGlobalLoading}`);

      setTimeout(() => {
        newUISystem.stopLoading('new-system-test');
        oldUISystem.stopLoading('old-system-test');

        addTestResult('Loading Test', 'success', 
          `Loading States Stopped - New: ${newUISystem.isGlobalLoading}, Old: ${oldUISystem.isGlobalLoading}`);
      }, 2000);
    } catch (error) {
      addTestResult('Loading Test', 'error', `Loading Test Error: ${error}`, error);
    }
  };

  const runNavigationTest = () => {
    try {
      const testQuizId = `test-quiz-${Date.now()}`;
      
      // Test Navigation Tracking
      newUISystem.trackNavigation(testQuizId);
      oldUISystem.trackNavigation(testQuizId);

      const newLastQuiz = newUISystem.lastNavigatedQuizId;
      const oldLastQuiz = oldUISystem.lastNavigatedQuizId;
      const match = newLastQuiz === oldLastQuiz;

      addTestResult('Navigation Test', 
        match ? 'success' : 'warning', 
        `Navigation - New: ${newLastQuiz}, Old: ${oldLastQuiz}, Match: ${match}`);
    } catch (error) {
      addTestResult('Navigation Test', 'error', `Navigation Test Error: ${error}`, error);
    }
  };

  const runUnlockTest = () => {
    try {
      const testQuizId = `unlock-quiz-${Date.now()}`;
      const testQuizTitle = 'Test Unlock Quiz';
      
      // Test Pending Unlocks
      newUISystem.addPendingUnlock(testQuizId, testQuizTitle);
      oldUISystem.addPendingUnlock(testQuizId, testQuizTitle);

      const newCount = newUISystem.getPendingUnlocksCount();
      const oldCount = oldUISystem.getPendingUnlocksCount();
      const match = newCount === oldCount;

      addTestResult('Unlock Test', 
        match ? 'success' : 'warning', 
        `Pending Unlocks - New: ${newCount}, Old: ${oldCount}, Match: ${match}`);

      // Test checking unlocks - with proper delay
      setTimeout(() => {
        // Clear existing toasts first
        if (newUISystem.toastVisible) {
          newUISystem.hideToast();
        }
        if (oldUISystem.toastData) {
          oldUISystem.hideToast();
        }
        
        // Check unlocks
        newUISystem.checkPendingUnlocks();
        oldUISystem.checkPendingUnlocks();

        const newCountAfter = newUISystem.getPendingUnlocksCount();
        const oldCountAfter = oldUISystem.getPendingUnlocksCount();
        const matchAfter = newCountAfter === oldCountAfter;

        addTestResult('Unlock Test', 
          matchAfter ? 'success' : 'warning', 
          `After Check - New: ${newCountAfter}, Old: ${oldCountAfter}, Match: ${matchAfter}`);
      }, 1500);
    } catch (error) {
      addTestResult('Unlock Test', 'error', `Unlock Test Error: ${error}`, error);
    }
  };

  const runCompatibilityTest = () => {
    try {
      // Test dass neue Bridge-Methoden gleich funktionieren wie alte
      const operations = [
        () => {
          newUISystem.showSuccessToast('Compatibility Success');
          // Don't show old system toast simultaneously to avoid conflicts
          setTimeout(() => {
            oldUISystem.showSuccessToast('Compatibility Success Old');
          }, 500);
        },
        () => {
          newUISystem.startLoading('compatibility-test');
          oldUISystem.startLoading('compatibility-test');
        },
        () => {
          newUISystem.trackNavigation('compatibility-quiz');
          oldUISystem.trackNavigation('compatibility-quiz');
        }
      ];

      operations.forEach((op, index) => {
        setTimeout(() => {
          op();
          addTestResult('Compatibility Test', 'success', `Operation ${index + 1} executed`);
        }, index * 800); // Increased delay
      });

      setTimeout(() => {
        newUISystem.stopLoading('compatibility-test');
        oldUISystem.stopLoading('compatibility-test');
        addTestResult('Compatibility Test', 'success', 'All compatibility operations completed');
      }, 3000);
    } catch (error) {
      addTestResult('Compatibility Test', 'error', `Compatibility Error: ${error}`, error);
    }
  };

  const clearResults = () => {
    setTestResults([]);
  };

  const clearAllToasts = () => {
    // Clear both systems
    if (newUISystem.toastVisible) {
      newUISystem.hideToast();
    }
    if (oldUISystem.toastData) {
      oldUISystem.hideToast();
    }
    addTestResult('Clear Toasts', 'success', 'All toasts cleared');
  };

  const runAllTests = () => {
    clearResults();
    addTestResult('Test Suite', 'success', 'Starting UI Integration Tests...');
    
    // Clear any existing toasts first
    clearAllToasts();
    
    setTimeout(() => runLoadingTest(), 1000);
    setTimeout(() => runNavigationTest(), 2500);
    setTimeout(() => runUnlockTest(), 4000);
    setTimeout(() => runCompatibilityTest(), 6000);
    setTimeout(() => runToastTest(), 8000); // Toast test last to avoid conflicts
    
    setTimeout(() => {
      addTestResult('Test Suite', 'success', 'All UI tests completed');
    }, 15000);
  };

  return (
    <ScrollView style={styles.container}>
      <Text style={styles.title}>UI Store Integration Test</Text>
      
      {/* System Status */}
      <View style={styles.section}>
        <Text style={styles.sectionTitle}>System Status</Text>
        <Text style={styles.stat}>New UI Loading: {newUISystem.isGlobalLoading ? 'Ja' : 'Nein'}</Text>
        <Text style={styles.stat}>Old UI Loading: {oldUISystem.isGlobalLoading ? 'Ja' : 'Nein'}</Text>
        <Text style={styles.stat}>New Toast Visible: {newUISystem.toastVisible ? 'Ja' : 'Nein'}</Text>
        <Text style={styles.stat}>Old Toast Data: {oldUISystem.toastData ? 'Ja' : 'Nein'}</Text>
        <Text style={styles.stat}>New Nav History: {newUISystem.navigationHistory.length}</Text>
        <Text style={styles.stat}>Old Nav History: {oldUISystem.navigationHistory.length}</Text>
        <Text style={styles.stat}>New Pending Unlocks: {newUISystem.getPendingUnlocksCount()}</Text>
        <Text style={styles.stat}>Old Pending Unlocks: {oldUISystem.getPendingUnlocksCount()}</Text>
      </View>

      {/* Auto Comparison */}
      {autoComparison && (
        <View style={styles.section}>
          <Text style={styles.sectionTitle}>Auto-Vergleich</Text>
          <Text style={[styles.status, { color: autoComparison.allMatches ? 'green' : 'orange' }]}>
            {autoComparison.allMatches ? '✅ UI-Systeme synchron' : '⚠️ Unterschiede erkannt'}
          </Text>
          <Text style={styles.comparisonDetail}>
            Loading: {autoComparison.loadingMatch ? '✅' : '❌'} | 
            Toast: {autoComparison.toastVisibleMatch ? '✅' : '❌'} | 
            Nav: {autoComparison.navigationMatch ? '✅' : '❌'} | 
            Unlocks: {autoComparison.pendingUnlocksMatch ? '✅' : '❌'}
          </Text>
          {!autoComparison.allMatches && (
            <View style={styles.debugContainer}>
              <Text style={styles.debugText}>
                New Toast Visible: {newUISystem.toastVisible ? 'true' : 'false'}{'\n'}
                Old Toast Data: {oldUISystem.toastData ? 'true' : 'false'}{'\n'}
                New Active Toast: {newUISystem.activeToast ? `"${newUISystem.activeToast.message}"` : 'null'}{'\n'}
                Old Toast Message: {oldUISystem.toastData ? `"${oldUISystem.toastData.message}"` : 'null'}
              </Text>
            </View>
          )}
        </View>
      )}

      {/* Test Controls */}
      <View style={styles.section}>
        <Text style={styles.sectionTitle}>Tests</Text>
        <View style={styles.buttonRow}>
          <TouchableOpacity style={styles.button} onPress={runAllTests}>
            <Text style={styles.buttonText}>Alle Tests</Text>
          </TouchableOpacity>
          <TouchableOpacity style={styles.button} onPress={runToastTest}>
            <Text style={styles.buttonText}>Toast Test</Text>
          </TouchableOpacity>
        </View>
        <View style={styles.buttonRow}>
          <TouchableOpacity style={styles.button} onPress={runLoadingTest}>
            <Text style={styles.buttonText}>Loading Test</Text>
          </TouchableOpacity>
          <TouchableOpacity style={styles.button} onPress={runNavigationTest}>
            <Text style={styles.buttonText}>Navigation Test</Text>
          </TouchableOpacity>
        </View>
        <View style={styles.buttonRow}>
          <TouchableOpacity style={styles.button} onPress={runUnlockTest}>
            <Text style={styles.buttonText}>Unlock Test</Text>
          </TouchableOpacity>
          <TouchableOpacity style={styles.button} onPress={runCompatibilityTest}>
            <Text style={styles.buttonText}>Compatibility</Text>
          </TouchableOpacity>
        </View>
        <View style={styles.buttonRow}>
          <TouchableOpacity style={styles.button} onPress={clearAllToasts}>
            <Text style={styles.buttonText}>Clear Toasts</Text>
          </TouchableOpacity>
          <TouchableOpacity style={[styles.button, styles.clearButton]} onPress={clearResults}>
            <Text style={styles.buttonText}>Clear Results</Text>
          </TouchableOpacity>
        </View>
      </View>

      {/* Test Results */}
      {testResults.length > 0 && (
        <View style={styles.section}>
          <Text style={styles.sectionTitle}>Test Results ({testResults.length})</Text>
          <ScrollView style={styles.resultsContainer} nestedScrollEnabled>
            {testResults.map((result, index) => (
              <View key={index} style={styles.testResultRow}>
                <Text style={[styles.testResult, { color: getResultColor(result.result) }]}>
                  {getResultIcon(result.result)} {result.timestamp} - {result.test}
                </Text>
                <Text style={styles.testMessage}>{result.message}</Text>
                {result.details && (
                  <Text style={styles.testDetails}>
                    {typeof result.details === 'string' ? result.details : JSON.stringify(result.details, null, 2)}
                  </Text>
                )}
              </View>
            ))}
          </ScrollView>
        </View>
      )}

      {/* Debug Info */}
      <View style={styles.section}>
        <Text style={styles.sectionTitle}>New UI Debug Info</Text>
        <Text style={styles.debugText}>
          {JSON.stringify(newUISystem.getDebugInfo(), null, 2)}
        </Text>
      </View>

      {/* Toast Components - Only render if toasts are visible */}
      {newUISystem.activeToast && newUISystem.toastVisible && (
        <Toast
          visible={newUISystem.toastVisible}
          message={newUISystem.activeToast.message}
          type={newUISystem.activeToast.type}
          onHide={newUISystem.hideToast}
          position="top"
        />
      )}
    </ScrollView>
  );
}

const getResultColor = (result: 'success' | 'warning' | 'error') => {
  switch (result) {
    case 'success': return '#4CAF50';
    case 'warning': return '#FF9800';
    case 'error': return '#F44336';
    default: return '#666';
  }
};

const getResultIcon = (result: 'success' | 'warning' | 'error') => {
  switch (result) {
    case 'success': return '✅';
    case 'warning': return '⚠️';
    case 'error': return '❌';
    default: return 'ℹ️';
  }
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    padding: 16,
    backgroundColor: '#f5f5f5',
  },
  title: {
    fontSize: 20,
    fontWeight: 'bold',
    marginBottom: 20,
    textAlign: 'center',
  },
  section: {
    backgroundColor: 'white',
    padding: 12,
    marginBottom: 12,
    borderRadius: 8,
    borderWidth: 1,
    borderColor: '#e0e0e0',
  },
  sectionTitle: {
    fontSize: 16,
    fontWeight: '600',
    marginBottom: 8,
    color: '#333',
  },
  stat: {
    fontSize: 14,
    marginBottom: 4,
    color: '#666',
  },
  status: {
    fontSize: 14,
    fontWeight: '600',
    marginBottom: 8,
  },
  comparisonDetail: {
    fontSize: 12,
    color: '#666',
    marginBottom: 4,
  },
  debugContainer: {
    marginTop: 8,
    backgroundColor: '#f8f9fa',
    padding: 8,
    borderRadius: 4,
  },
  buttonRow: {
    flexDirection: 'row',
    marginBottom: 8,
    gap: 8,
  },
  button: {
    flex: 1,
    backgroundColor: '#007AFF',
    padding: 10,
    borderRadius: 6,
    alignItems: 'center',
  },
  clearButton: {
    backgroundColor: '#ff6b6b',
  },
  buttonText: {
    color: 'white',
    fontSize: 14,
    fontWeight: '500',
  },
  resultsContainer: {
    maxHeight: 300,
    backgroundColor: '#f8f9fa',
    padding: 8,
    borderRadius: 4,
  },
  testResultRow: {
    marginBottom: 8,
    paddingBottom: 8,
    borderBottomWidth: 1,
    borderBottomColor: '#e0e0e0',
  },
  testResult: {
    fontSize: 12,
    fontWeight: '600',
    marginBottom: 2,
    fontFamily: 'monospace',
  },
  testMessage: {
    fontSize: 12,
    color: '#333',
    marginBottom: 2,
  },
  testDetails: {
    fontSize: 10,
    color: '#666',
    fontFamily: 'monospace',
    backgroundColor: '#f0f0f0',
    padding: 4,
    borderRadius: 2,
    marginTop: 2,
  },
  debugText: {
    fontSize: 10,
    fontFamily: 'monospace',
    color: '#666',
    backgroundColor: '#f8f9fa',
    padding: 8,
    borderRadius: 4,
  },
});