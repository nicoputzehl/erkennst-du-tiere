import { StyleSheet, View } from 'react-native';
import React from 'react';
import Button from '@/src/common/components/Button';
import { ThemedText } from '@/src/common/components/ThemedText';

export type WrongAnswerProps = {
  onTryAgain: () => void;
};

const WrongAnswer = ({ onTryAgain }: WrongAnswerProps) => {
  return (
    <View style={styles.container}>
      <ThemedText 
        style={[styles.resultText, styles.wrongText]} 
        type="title"
      >
        Leider falsch
      </ThemedText>

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
    alignItems: 'center',
  },
  resultText: {
    textAlign: 'center',
    marginBottom: 30,
  },
  wrongText: {
    color: '#F44336', // Konsistente rote Farbe
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