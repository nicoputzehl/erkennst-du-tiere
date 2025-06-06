// src/quiz/screens/Question/components/QuestionResult/WrongAnswer.tsx - ENHANCED VERSION
import { StyleSheet, View } from 'react-native';
import React from 'react';
import Button from '@/src/common/components/Button';
import { ThemedText } from '@/src/common/components/ThemedText';

export type WrongAnswerProps = {
  onTryAgain: () => void;
  // NEUE PROPS für gekaufte Hints
  purchasedHintContent?: string;
  onShowPurchasedHint?: boolean;
};

const WrongAnswer = ({ 
  onTryAgain, 
  purchasedHintContent,
  onShowPurchasedHint 
}: WrongAnswerProps) => {
  return (
    <View style={styles.container}>
      <ThemedText 
        style={[styles.resultText, styles.wrongText]} 
        type="title"
      >
        Leider falsch
      </ThemedText>

      {/* NEUE: Anzeige gekaufter Hints */}
      {purchasedHintContent && onShowPurchasedHint && (
        <View style={styles.purchasedHintContainer}>
          <ThemedText style={styles.purchasedHintTitle}>
            💰 Dein gekaufter Hinweis:
          </ThemedText>
          <ThemedText style={styles.purchasedHintContent}>
            {purchasedHintContent}
          </ThemedText>
        </View>
      )}

      <View style={styles.buttonRow}>
        <Button
          text="Nochmal versuchen"
          onPress={onTryAgain}
          style={styles.tryAgainButton}
        />
      </View>
    </View>
  );
};

export default WrongAnswer;

const styles = StyleSheet.create({
  container: {
    flex: 1,
    alignItems: 'center',
    justifyContent: 'space-between'
  },
  resultText: {
    textAlign: 'center',
    marginBottom: 30,
  },
  wrongText: {
    color: '#F44336', // Konsistente rote Farbe
  },
  
  // NEUE Styles für purchased hints
  purchasedHintContainer: {
    backgroundColor: '#E3F2FD',
    padding: 16,
    borderRadius: 12,
    marginVertical: 20,
    width: '100%',
    borderWidth: 2,
    borderColor: '#1976D2',
  },
  purchasedHintTitle: {
    fontSize: 16,
    fontWeight: '600',
    color: '#1976D2',
    marginBottom: 8,
    textAlign: 'center',
  },
  purchasedHintContent: {
    fontSize: 16,
    color: '#0D47A1',
    lineHeight: 24,
    textAlign: 'center',
  },

  buttonRow: {
    flexDirection: 'row',
    gap: 12,
    marginTop: 20,
  },
  tryAgainButton: {
    flex: 1,
    backgroundColor: '#FF9800',
    padding: 12,
    borderRadius: 8,
    alignItems: 'center',
  },
});