import React, { useState } from 'react';
import { StyleSheet, TouchableOpacity, Text, View, ActivityIndicator } from 'react-native';
import { ThemedView } from '@/src/common/components/ThemedView';

interface AnswerChoiceProps {
  choices: string[];
  onChoicePress: (choice: string) => void;
  isSubmitting?: boolean;
}

const AnswerChoice: React.FC<AnswerChoiceProps> = ({ 
  choices, 
  onChoicePress,
  isSubmitting = false 
}) => {
  const [selectedChoice, setSelectedChoice] = useState<string | null>(null);

  const handleChoicePress = (choice: string) => {
    if (isSubmitting) return;
    
    setSelectedChoice(choice);
    onChoicePress(choice);
  };

  return (
    <ThemedView style={styles.container}>
      <Text style={styles.question}>Was ist das für ein Tier?</Text>
      
      {isSubmitting && (
        <View style={styles.loadingContainer}>
          <ActivityIndicator size="large" color="#0a7ea4" />
          <Text style={styles.loadingText}>Antwort wird geprüft...</Text>
        </View>
      )}
      
      <View style={[styles.choicesContainer, isSubmitting && styles.disabledContainer]}>
        {choices.map((choice, index) => (
          <TouchableOpacity
            key={index}
            style={[
              styles.choiceButton,
              selectedChoice === choice && styles.selectedChoiceButton,
              isSubmitting && styles.disabledButton
            ]}
            onPress={() => handleChoicePress(choice)}
            disabled={isSubmitting}
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
  loadingContainer: {
    alignItems: 'center',
    justifyContent: 'center',
    marginVertical: 16,
  },
  loadingText: {
    marginTop: 8,
    fontSize: 14,
    color: '#0a7ea4',
  },
  choicesContainer: {
    gap: 12,
  },
  disabledContainer: {
    opacity: 0.7,
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
  disabledButton: {
    opacity: 0.6,
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