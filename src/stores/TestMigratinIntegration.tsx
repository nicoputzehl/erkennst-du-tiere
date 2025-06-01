// src/stores/TestMigrationIntegration.tsx
// Temporäre Komponente zum Testen der Migration in der echten App
import React, { useEffect, useState } from 'react';
import { View, Text, ScrollView, StyleSheet } from 'react-native';
import { useQuizStoreSimple } from './QuizStoreProvider';
import { useQuiz } from '@/src/quiz/contexts/QuizProvider'; // Altes System
import { Quiz } from '@/src/quiz/types';

interface QuizComparison {
  id: string;
  inOldSystem: boolean;
  inNewStore: boolean;
  title?: string;
  questionCount?: number;
}

export function TestMigrationIntegration() {
  const [comparison, setComparison] = useState<QuizComparison[]>([]);
  
  // Neues System
  const { getAllQuizzes: getNewQuizzes, isInitialized, getDebugInfo } = useQuizStoreSimple();
  
  // Altes System
  const { getAllQuizzes: getOldQuizzes } = useQuiz();

  useEffect(() => {
    if (!isInitialized) return;

    try {
      console.log('[TestMigrationIntegration] Starting comparison...');
      
      const oldQuizzes: Quiz[] = getOldQuizzes();
      const newQuizzes: Quiz[] = getNewQuizzes();

      console.log('[TestMigrationIntegration] Old system quizzes:', oldQuizzes.length);
      console.log('[TestMigrationIntegration] New store quizzes:', newQuizzes.length);
      
      if (getDebugInfo) {
        console.log('[TestMigrationIntegration] Store debug info:', getDebugInfo());
      }

      // Sammle alle Quiz-IDs
      const allIds = new Set([
        ...oldQuizzes.map((q: Quiz) => q.id),
        ...newQuizzes.map((q: Quiz) => q.id)
      ]);

      console.log('[TestMigrationIntegration] All quiz IDs:', Array.from(allIds));

      const comparisonData: QuizComparison[] = Array.from(allIds).map(id => {
        const oldQuiz = oldQuizzes.find((q: Quiz) => q.id === id);
        const newQuiz = newQuizzes.find((q: Quiz) => q.id === id);

        return {
          id,
          inOldSystem: !!oldQuiz,
          inNewStore: !!newQuiz,
          title: oldQuiz?.title || newQuiz?.title,
          questionCount: oldQuiz?.questions.length || newQuiz?.questions.length
        };
      });

      console.log('[TestMigrationIntegration] Comparison data:', comparisonData);
      setComparison(comparisonData);
    } catch (error) {
      console.error('[TestMigrationIntegration] Error comparing systems:', error);
    }
  }, [isInitialized, getOldQuizzes, getNewQuizzes, getDebugInfo]);

  if (!isInitialized) {
    return (
      <View style={styles.container}>
        <Text style={styles.title}>Store wird initialisiert...</Text>
      </View>
    );
  }

  const allMatch = comparison.every(item => item.inOldSystem && item.inNewStore);
  const hasData = comparison.length > 0;

  return (
    <View style={styles.container}>
      <Text style={styles.title}>Migration Status</Text>
      
      {!hasData ? (
        <Text style={[styles.status, { color: 'orange' }]}>
          ⚠️ Keine Quizzes gefunden - möglicherweise noch nicht geladen
        </Text>
      ) : (
        <Text style={[styles.status, { color: allMatch ? 'green' : 'orange' }]}>
          {allMatch ? '✅ Alle Quizzes in beiden Systemen' : '⚠️ Unterschiede erkannt'}
        </Text>
      )}
      
      <Text style={styles.summary}>
        Gefunden: {comparison.length} Quiz(s)
      </Text>
      
      <ScrollView style={styles.scrollView}>
        {comparison.length === 0 ? (
          <View style={styles.emptyState}>
            <Text style={styles.emptyText}>
              Keine Quizzes zum Vergleichen gefunden.{'\n'}
              Stelle sicher, dass beide Systeme initialisiert sind.
            </Text>
          </View>
        ) : (
          comparison.map(item => (
            <View key={item.id} style={styles.quizItem}>
              <Text style={styles.quizId}>{item.id}</Text>
              <Text style={styles.quizTitle}>{item.title || 'Unbekannter Titel'}</Text>
              <View style={styles.statusRow}>
                <Text style={[styles.systemStatus, { color: item.inOldSystem ? 'green' : 'red' }]}>
                  Alt: {item.inOldSystem ? '✅' : '❌'}
                </Text>
                <Text style={[styles.systemStatus, { color: item.inNewStore ? 'green' : 'red' }]}>
                  Neu: {item.inNewStore ? '✅' : '❌'}
                </Text>
                <Text style={styles.questionCount}>
                  ({item.questionCount || 0} Fragen)
                </Text>
              </View>
            </View>
          ))
        )}
      </ScrollView>
    </View>
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
    marginBottom: 10,
  },
  status: {
    fontSize: 16,
    fontWeight: '600',
    marginBottom: 10,
  },
  summary: {
    fontSize: 14,
    color: '#666',
    marginBottom: 20,
  },
  scrollView: {
    flex: 1,
  },
  emptyState: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    padding: 20,
  },
  emptyText: {
    fontSize: 16,
    color: '#666',
    textAlign: 'center',
    lineHeight: 24,
  },
  quizItem: {
    backgroundColor: 'white',
    padding: 12,
    marginBottom: 8,
    borderRadius: 8,
    borderWidth: 1,
    borderColor: '#e0e0e0',
  },
  quizId: {
    fontSize: 14,
    fontWeight: '600',
    color: '#666',
  },
  quizTitle: {
    fontSize: 16,
    fontWeight: '500',
    marginTop: 2,
  },
  statusRow: {
    flexDirection: 'row',
    alignItems: 'center',
    marginTop: 4,
  },
  systemStatus: {
    fontSize: 12,
    marginRight: 10,
    fontWeight: '500',
  },
  questionCount: {
    fontSize: 12,
    color: '#666',
  },
});