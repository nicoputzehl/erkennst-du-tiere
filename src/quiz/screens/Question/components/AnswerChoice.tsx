import React, { useState } from 'react';
import { StyleSheet, TouchableOpacity, Text, View } from 'react-native';
import { ThemedView } from '@/src/common/components/ThemedView';

interface AnswerChoiceProps {
  choices: string[];
  onChoicePress: (choice: string) => void;
}

const AnswerChoice: React.FC<AnswerChoiceProps> = ({ choices, onChoicePress }) => {
  const [selectedChoice, setSelectedChoice] = useState<string | null>(null);

  const handleChoicePress = (choice: string) => {
    setSelectedChoice(choice);
    onChoicePress(choice);
  };

  return (
    <ThemedView style={styles.container}>
      <Text style={styles.question}>Was ist das für ein Tier?</Text>
      <View style={styles.choicesContainer}>
        {choices.map((choice, index) => (
          <TouchableOpacity
            key={index}
            style={[
              styles.choiceButton,
              selectedChoice === choice && styles.selectedChoiceButton
            ]}
            onPress={() => handleChoicePress(choice)}
          >
            <Text style={[
              styles.choiceText,
              selectedChoice === choice && styles.selectedChoiceText
            ]}>
              {choice}
            </Text>
          </TouchableOpacity>
        ))}
      </View>
    </ThemedView>
  );
};

const styles = StyleSheet.create({
  container: {
    padding: 16,
    borderRadius: 8,
    marginBottom: 16,
  },
  question: {
    fontSize: 18,
    fontWeight: 'bold',
    marginBottom: 16,
    textAlign: 'center',
  },
  choicesContainer: {
    gap: 12,
  },
  choiceButton: {
    padding: 16,
    borderRadius: 8,
    borderWidth: 1,
    borderColor: '#ccc',
    backgroundColor: '#f5f5f5',
  },
  selectedChoiceButton: {
    borderColor: '#4a90e2',
    backgroundColor: '#e6f0ff',
  },
  choiceText: {
    fontSize: 16,
    textAlign: 'center',
  },
  selectedChoiceText: {
    fontWeight: 'bold',
    color: '#4a90e2',
  },
});

export default AnswerChoice;