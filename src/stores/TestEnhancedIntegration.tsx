// src/stores/TestEnhancedIntegration.tsx
import React, { useState } from 'react';
import { View, Text, ScrollView, TouchableOpacity, StyleSheet } from 'react-native';
import { useQuizStoreEnhanced } from './QuizStoreProvider';
import { useQuizComparison, useQuizOperationComparison } from './useQuizComparison';

export function TestEnhancedIntegration() {
  const store = useQuizStoreEnhanced();
  const comparison = useQuizComparison();
  const operationTest = useQuizOperationComparison();
  const [testResults, setTestResults] = useState<string[]>([]);

  const addTestResult = (result: string) => {
    setTestResults(prev => [...prev, `${new Date().toLocaleTimeString()}: ${result}`]);
  };

  const runAnswerTest = async () => {
    const quizzes = store.getAllQuizzes();
    if (quizzes.length === 0) {
      addTestResult('❌ Keine Quizzes für Test verfügbar');
      return;
    }

    const quiz = quizzes[0];
    
    // Quiz State initialisieren falls nötig
    let quizState = store.quizStates[quiz.id];
    if (!quizState) {
      const initializedState = store.initializeQuizState(quiz.id);
      if (!initializedState) {
        addTestResult('❌ Quiz State konnte nicht initialisiert werden');
        return;
      }
      quizState = initializedState;
    }

    if (!quizState || quizState.questions.length === 0) {
      addTestResult('❌ Quiz State hat keine Fragen');
      return;
    }

    const firstQuestion = quizState.questions[0];
    
    // Test richtige Antwort
    const result = await operationTest.testAnswerSubmission(
      quiz.id, 
      firstQuestion.id, 
      firstQuestion.answer
    );

    if (result.matches) {
      addTestResult(`✅ Answer Test: ${quiz.id} - Systeme stimmen überein`);
    } else if (result.matches === null) {
      addTestResult(`⚠️ Answer Test: ${quiz.id} - Nur neues System getestet (richtig: ${result.newResult.isCorrect})`);
    } else {
      addTestResult(`❌ Answer Test: ${quiz.id} - Systeme unterschiedlich`);
    }
  };

  const runProgressTest = () => {
    const quizzes = store.getAllQuizzes();
    if (quizzes.length === 0) {
      addTestResult('❌ Keine Quizzes für Progress-Test verfügbar');
      return;
    }

    quizzes.slice(0, 3).forEach(quiz => {
      const result = operationTest.testProgressCalculation(quiz.id);
      if (result.matches) {
        addTestResult(`✅ Progress Test: ${quiz.id} - ${result.newProgress}%`);
      } else {
        addTestResult(`❌ Progress Test: ${quiz.id} - Neu: ${result.newProgress}%, Alt: ${result.oldProgress}%`);
      }
    });
  };

  const runQuizStateTest = () => {
    const quizzes = store.getAllQuizzes();
    if (quizzes.length === 0) {
      addTestResult('❌ Keine Quizzes verfügbar');
      return;
    }

    const quiz = quizzes[0];
    
    // State initialisieren
    const initialState = store.initializeQuizState(quiz.id);
    if (initialState) {
      addTestResult(`✅ State Init: ${quiz.id} - ${initialState.questions.length} Fragen`);
    } else {
      addTestResult(`❌ State Init: ${quiz.id} - Fehlgeschlagen`);
      return;
    }

    // Progress testen
    const progress = store.getQuizProgress(quiz.id);
    const progressString = store.getQuizProgressString(quiz.id);
    addTestResult(`📊 Progress: ${quiz.id} - ${progress}% (${progressString})`);

    // Reset testen
    const resetState = store.resetQuizState(quiz.id);
    if (resetState) {
      addTestResult(`🔄 Reset: ${quiz.id} - Erfolgreich`);
    } else {
      addTestResult(`❌ Reset: ${quiz.id} - Fehlgeschlagen`);
    }
  };

  const clearResults = () => {
    setTestResults([]);
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
        <Text style={styles.stat}>Completed: {statistics.completedQuizzes}</Text>
        <Text style={styles.stat}>Progress: {statistics.completionPercentage}%</Text>
        <Text style={styles.stat}>Loading: {store.isLoading ? 'Ja' : 'Nein'}</Text>
      </View>

      {/* Comparison Results */}
      {comparison && (
        <View style={styles.section}>
          <Text style={styles.sectionTitle}>System Vergleich</Text>
          <Text style={[styles.status, { color: comparison.allMatches ? 'green' : 'orange' }]}>
            {comparison.allMatches ? '✅ Alle Systeme synchron' : '⚠️ Unterschiede erkannt'}
          </Text>
          {comparison.mismatches.length > 0 && (
            <View style={styles.mismatchContainer}>
              {comparison.mismatches.map((mismatch, index) => (
                <Text key={index} style={styles.mismatch}>• {mismatch}</Text>
              ))}
            </View>
          )}
        </View>
      )}

      {/* Test Controls */}
      <View style={styles.section}>
        <Text style={styles.sectionTitle}>Tests</Text>
        <View style={styles.buttonRow}>
          <TouchableOpacity style={styles.button} onPress={runAnswerTest}>
            <Text style={styles.buttonText}>Answer Test</Text>
          </TouchableOpacity>
          <TouchableOpacity style={styles.button} onPress={runProgressTest}>
            <Text style={styles.buttonText}>Progress Test</Text>
          </TouchableOpacity>
        </View>
        <View style={styles.buttonRow}>
          <TouchableOpacity style={styles.button} onPress={runQuizStateTest}>
            <Text style={styles.buttonText}>State Test</Text>
          </TouchableOpacity>
          <TouchableOpacity style={[styles.button, styles.clearButton]} onPress={clearResults}>
            <Text style={styles.buttonText}>Clear</Text>
          </TouchableOpacity>
        </View>
      </View>

      {/* Test Results */}
      {testResults.length > 0 && (
        <View style={styles.section}>
          <Text style={styles.sectionTitle}>Test Results</Text>
          <ScrollView style={styles.resultsContainer} nestedScrollEnabled>
            {testResults.map((result, index) => (
              <Text key={index} style={styles.testResult}>{result}</Text>
            ))}
          </ScrollView>
        </View>
      )}

      {/* Debug Info */}
      {store.getDebugInfo && (
        <View style={styles.section}>
          <Text style={styles.sectionTitle}>Debug Info</Text>
          <Text style={styles.debugText}>
            {JSON.stringify(store.getDebugInfo(), null, 2)}
          </Text>
        </View>
      )}
    </ScrollView>
  );
}

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
  mismatchContainer: {
    marginTop: 8,
  },
  mismatch: {
    fontSize: 12,
    color: '#ff6b6b',
    marginBottom: 2,
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
    maxHeight: 200,
    backgroundColor: '#f8f9fa',
    padding: 8,
    borderRadius: 4,
  },
  testResult: {
    fontSize: 12,
    marginBottom: 4,
    fontFamily: 'monospace',
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