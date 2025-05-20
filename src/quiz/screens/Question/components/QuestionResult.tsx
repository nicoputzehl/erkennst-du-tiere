// src/quiz/screens/Question/components/QuestionResult.tsx
import React from 'react';
import { View, Text, TouchableOpacity, StyleSheet } from 'react-native';
import { QuizMode } from '@/src/quiz/types';

interface QuestionResultProps {
  isCorrect: boolean;
  funFact?: string;
  onBack: () => void;
  onTryAgain: () => void;
  onNext: () => void;
  quizMode?: QuizMode;
  hasNextQuestion: boolean;
}

export const QuestionResult: React.FC<QuestionResultProps> = ({
  isCorrect,
  funFact,
  onBack,
  onTryAgain,
  onNext,
  quizMode = QuizMode.SEQUENTIAL,
  hasNextQuestion = true,
}) => {
  return (
    <View style={styles.container}>
      <Text style={[styles.resultText, { color: isCorrect ? 'green' : 'red' }]}>
        {isCorrect ? 'Richtig!' : 'Leider falsch!'}
      </Text>
      
      {isCorrect && funFact && (
        <Text style={styles.funFact}>
          Fun fact: {funFact}
        </Text>
      )}
      
      <View style={styles.buttonRow}>
        <TouchableOpacity style={styles.skipButton} onPress={onBack}>
          <Text style={styles.skipButtonText}>
            Zurück zur Übersicht
          </Text>
        </TouchableOpacity>
        
        {quizMode === QuizMode.SEQUENTIAL && !isCorrect ? (
          // Bei sequentiellen Quizzes, nur Wiederholungsoption bei falscher Antwort zeigen
          <TouchableOpacity style={styles.tryAgainButton} onPress={onTryAgain}>
            <Text style={styles.tryAgainButtonText}>
              Nochmal versuchen
            </Text>
          </TouchableOpacity>
        ) : (
          // Bei richtigen Antworten oder vollständig freigeschalteten Quizzes
          <TouchableOpacity 
            style={[
              styles.nextQuestionButton, 
              !hasNextQuestion && styles.lastQuestionButton,
              quizMode === QuizMode.ALL_UNLOCKED && styles.allUnlockedButton
            ]} 
            onPress={onNext}
          >
            <Text style={styles.tryAgainButtonText}>
              {hasNextQuestion ? 'Zur nächsten Frage' : 'Quiz beenden'}
            </Text>
          </TouchableOpacity>
        )}
      </View>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    padding: 16,
  },
  resultText: {
    fontSize: 24,
    fontWeight: 'bold',
    textAlign: 'center',
    marginBottom: 20,
  },
  funFact: {
    fontSize: 14,
    fontStyle: 'italic',
    marginBottom: 20,
  },
  buttonRow: {
    flexDirection: 'row',
    gap: 12,
    marginTop: 20,
  },
  tryAgainButton: {
    flex: 1,
    backgroundColor: '#ff9800',
    padding: 12,
    borderRadius: 8,
    alignItems: 'center',
  },
  nextQuestionButton: {
    flex: 1,
    backgroundColor: 'green',
    padding: 12,
    borderRadius: 8,
    alignItems: 'center',
  },
  allUnlockedButton: {
    backgroundColor: '#2196F3', // Blauer Button für ALL_UNLOCKED Quiz-Modus
  },
  lastQuestionButton: {
    backgroundColor: '#9C27B0', // Lila Button für letzte Frage
  },
  tryAgainButtonText: {
    color: 'white',
    fontSize: 16,
    fontWeight: '600',
  },
  skipButton: {
    flex: 1,
    backgroundColor: '#757575',
    padding: 12,
    borderRadius: 8,
    alignItems: 'center',
  },
  skipButtonText: {
    color: 'white',
    fontSize: 16,
    fontWeight: '600',
  },
});