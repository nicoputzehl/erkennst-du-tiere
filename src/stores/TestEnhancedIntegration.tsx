// src/stores/TestEnhancedIntegration.tsx - Verbesserte Version
import React, { useState, useEffect } from 'react';
import { View, Text, ScrollView, TouchableOpacity, StyleSheet } from 'react-native';
import { useQuizStoreEnhanced } from './QuizStoreProvider';
import { useStoreBridge } from './useStoreBridge';
import { useQuiz } from '@/src/quiz/contexts/QuizProvider';

interface TestResult {
  timestamp: string;
  test: string;
  result: 'success' | 'warning' | 'error';
  message: string;
  details?: any;
}

export function TestEnhancedIntegration() {
  const store = useQuizStoreEnhanced();
  const bridge = useStoreBridge();
  const oldSystem = useQuiz();
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
    setTestResults(prev => [newResult, ...prev.slice(0, 19)]); // Keep last 20 results
  };

  // Auto-Comparison zwischen Systemen
  useEffect(() => {
    if (!store.isInitialized) return;

    const runAutoComparison = () => {
      try {
        const storeQuizzes = store.getAllQuizzes();
        const bridgeQuizzes = bridge.getAllQuizzes();
        const oldQuizzes = oldSystem.getAllQuizzes();

        const comparison = {
          storeCount: storeQuizzes.length,
          bridgeCount: bridgeQuizzes.length,
          oldCount: oldQuizzes.length,
          storeQuizIds: storeQuizzes.map(q => q.id).sort(),
          bridgeQuizIds: bridgeQuizzes.map(q => q.id).sort(),
          oldQuizIds: oldQuizzes.map(q => q.id).sort(),
          allMatch: false
        };

        // Check if all IDs match
        const idsMatch = JSON.stringify(comparison.storeQuizIds) === JSON.stringify(comparison.oldQuizIds) &&
                        JSON.stringify(comparison.bridgeQuizIds) === JSON.stringify(comparison.oldQuizIds);
        
        comparison.allMatch = idsMatch && 
                            comparison.storeCount === comparison.oldCount && 
                            comparison.bridgeCount === comparison.oldCount;

        setAutoComparison(comparison);

        if (comparison.allMatch) {
          addTestResult('Auto-Comparison', 'success', 'Alle Systeme synchron');
        } else {
          addTestResult('Auto-Comparison', 'warning', 'Unterschiede erkannt', comparison);
        }
      } catch (error) {
        addTestResult('Auto-Comparison', 'error', `Fehler: ${error}`, error);
      }
    };

    const timer = setTimeout(runAutoComparison, 1000);
    return () => clearTimeout(timer);
  }, [store.isInitialized, store, bridge, oldSystem]);

  const runQuizStateTest = async () => {
    try {
      const quizzes = store.getAllQuizzes();
      if (quizzes.length === 0) {
        addTestResult('State Test', 'error', 'Keine Quizzes verfügbar');
        return;
      }

      const testQuiz = quizzes[0];
      
      // Store Test
      const storeState = store.initializeQuizState(testQuiz.id);
      if (storeState) {
        addTestResult('State Test', 'success', `Store State: ${testQuiz.id} - ${storeState.questions.length} Fragen`);
      } else {
        addTestResult('State Test', 'error', `Store State Init fehlgeschlagen: ${testQuiz.id}`);
        return;
      }

      // Bridge Test
      const bridgeState = await bridge.initializeQuizState(testQuiz.id);
      if (bridgeState) {
        addTestResult('State Test', 'success', `Bridge State: ${testQuiz.id} - ${bridgeState.questions.length} Fragen`);
      } else {
        addTestResult('State Test', 'error', `Bridge State Init fehlgeschlagen: ${testQuiz.id}`);
      }

      // Old System Test
      try {
        const oldState = await oldSystem.initializeQuizState(testQuiz.id);
        if (oldState) {
          addTestResult('State Test', 'success', `Old State: ${testQuiz.id} - ${oldState.questions.length} Fragen`);
        }
      } catch (error) {
        addTestResult('State Test', 'warning', `Old System Test fehlgeschlagen: ${error}`);
      }

    } catch (error) {
      addTestResult('State Test', 'error', `Test Error: ${error}`, error);
    }
  };

  const runProgressTest = () => {
    try {
      const quizzes = store.getAllQuizzes();
      if (quizzes.length === 0) {
        addTestResult('Progress Test', 'error', 'Keine Quizzes verfügbar');
        return;
      }

      quizzes.slice(0, 3).forEach(quiz => {
        const storeProgress = store.getQuizProgress(quiz.id);
        const bridgeProgress = bridge.getQuizProgress(quiz.id);
        const oldProgress = oldSystem.getQuizProgress(quiz.id);

        const allMatch = storeProgress === bridgeProgress && bridgeProgress === oldProgress;
        const result = allMatch ? 'success' : 'warning';
        const message = allMatch 
          ? `${quiz.id}: ${storeProgress}%` 
          : `${quiz.id}: Store=${storeProgress}%, Bridge=${bridgeProgress}%, Old=${oldProgress}%`;

        addTestResult('Progress Test', result, message);
      });
    } catch (error) {
      addTestResult('Progress Test', 'error', `Progress Test Error: ${error}`, error);
    }
  };

  const runAnswerTest = async () => {
    try {
      const quizzes = store.getAllQuizzes();
      if (quizzes.length === 0) {
        addTestResult('Answer Test', 'error', 'Keine Quizzes verfügbar');
        return;
      }

      const testQuiz = quizzes[0];
      
      // Initialize states
      const storeState = store.initializeQuizState(testQuiz.id);
      const bridgeState = await bridge.initializeQuizState(testQuiz.id);
      
      if (!storeState || !bridgeState) {
        addTestResult('Answer Test', 'error', 'State Initialisierung fehlgeschlagen');
        return;
      }

      if (storeState.questions.length === 0) {
        addTestResult('Answer Test', 'error', 'Keine Fragen zum Testen');
        return;
      }

      const firstQuestion = storeState.questions[0];
      const correctAnswer = firstQuestion.answer;

      // Test Store
      const storeResult = store.submitAnswer(testQuiz.id, firstQuestion.id, correctAnswer);
      addTestResult('Answer Test', 
        storeResult.isCorrect ? 'success' : 'error', 
        `Store Answer: ${storeResult.isCorrect ? 'Richtig' : 'Falsch'}`
      );

      // Test Bridge
      const bridgeResult = await bridge.processAnswer(testQuiz.id, firstQuestion.id, correctAnswer);
      addTestResult('Answer Test', 
        bridgeResult.isCorrect ? 'success' : 'error', 
        `Bridge Answer: ${bridgeResult.isCorrect ? 'Richtig' : 'Falsch'}`
      );

      // Compare Results
      const resultsMatch = storeResult.isCorrect === bridgeResult.isCorrect;
      addTestResult('Answer Test', 
        resultsMatch ? 'success' : 'warning', 
        `Results Match: ${resultsMatch ? 'Ja' : 'Nein'}`
      );

    } catch (error) {
      addTestResult('Answer Test', 'error', `Answer Test Error: ${error}`, error);
    }
  };

  const clearResults = () => {
    setTestResults([]);
  };

  const runAllTests = async () => {
    clearResults();
    addTestResult('Test Suite', 'success', 'Starte alle Tests...');
    
    await runQuizStateTest();
    runProgressTest();
    await runAnswerTest();
    
    addTestResult('Test Suite', 'success', 'Alle Tests abgeschlossen');
  };

  if (!store.isInitialized) {
    return (
      <View style={styles.container}>
        <Text style={styles.title}>Store wird initialisiert...</Text>
      </View>
    );
  }

  const statistics = store.getStatistics();

  return (
    <ScrollView style={styles.container}>
      <Text style={styles.title}>Enhanced Store Integration Test</Text>
      
      {/* System Status */}
      <View style={styles.section}>
        <Text style={styles.sectionTitle}>System Status</Text>
        <Text style={styles.stat}>Quizzes: {statistics.totalQuizzes}</Text>
        <Text style={styles.stat}>States: {Object.keys(store.quizStates).length}</Text>
        <Text style={styles.stat}>Bridge States: {Object.keys(bridge.quizStates).length}</Text>
        <Text style={styles.stat}>Completed: {statistics.completedQuizzes}</Text>
        <Text style={styles.stat}>Progress: {statistics.completionPercentage}%</Text>
        <Text style={styles.stat}>Store Loading: {store.isLoading ? 'Ja' : 'Nein'}</Text>
        <Text style={styles.stat}>Bridge Loading: {bridge.isLoading ? 'Ja' : 'Nein'}</Text>
      </View>

      {/* Auto Comparison */}
      {autoComparison && (
        <View style={styles.section}>
          <Text style={styles.sectionTitle}>Auto-Vergleich</Text>
          <Text style={[styles.status, { color: autoComparison.allMatch ? 'green' : 'orange' }]}>
            {autoComparison.allMatch ? '✅ Alle Systeme synchron' : '⚠️ Unterschiede erkannt'}
          </Text>
          <Text style={styles.comparisonDetail}>
            Store: {autoComparison.storeCount} | Bridge: {autoComparison.bridgeCount} | Old: {autoComparison.oldCount}
          </Text>
          {!autoComparison.allMatch && (
            <View style={styles.mismatchContainer}>
              <Text style={styles.mismatch}>Store IDs: {autoComparison.storeQuizIds.join(', ')}</Text>
              <Text style={styles.mismatch}>Bridge IDs: {autoComparison.bridgeQuizIds.join(', ')}</Text>
              <Text style={styles.mismatch}>Old IDs: {autoComparison.oldQuizIds.join(', ')}</Text>
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
          <TouchableOpacity style={styles.button} onPress={runQuizStateTest}>
            <Text style={styles.buttonText}>State Test</Text>
          </TouchableOpacity>
        </View>
        <View style={styles.buttonRow}>
          <TouchableOpacity style={styles.button} onPress={runProgressTest}>
            <Text style={styles.buttonText}>Progress Test</Text>
          </TouchableOpacity>
          <TouchableOpacity style={styles.button} onPress={runAnswerTest}>
            <Text style={styles.buttonText}>Answer Test</Text>
          </TouchableOpacity>
        </View>
        <View style={styles.buttonRow}>
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
      {store.getDebugInfo && (
        <View style={styles.section}>
          <Text style={styles.sectionTitle}>Store Debug Info</Text>
          <Text style={styles.debugText}>
            {JSON.stringify(store.getDebugInfo(), null, 2)}
          </Text>
        </View>
      )}

      {/* Bridge Debug Info */}
      <View style={styles.section}>
        <Text style={styles.sectionTitle}>Bridge Debug Info</Text>
        <Text style={styles.debugText}>
          {JSON.stringify(bridge.getDebugInfo(), null, 2)}
        </Text>
      </View>
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
  mismatchContainer: {
    marginTop: 8,
    backgroundColor: '#fff3cd',
    padding: 8,
    borderRadius: 4,
  },
  mismatch: {
    fontSize: 10,
    color: '#856404',
    marginBottom: 2,
    fontFamily: 'monospace',
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
    flex: 0.5,
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