import React, { useState, useCallback, memo } from 'react';
import { StyleSheet, TouchableOpacity, Text, View, ActivityIndicator } from 'react-native';
import { ThemedView } from '@/src/common/components/ThemedView';

interface AnswerChoiceProps {
  choices: string[];
  onChoicePress: (choice: string) => void;
  isSubmitting?: boolean;
}

// Memoized individual choice component for better performance
const ChoiceButton: React.FC<{
  choice: string;
  index: number;
  isSelected: boolean;
  isDisabled: boolean;
  onPress: (choice: string) => void;
}> = memo(({ choice, index, isSelected, isDisabled, onPress }) => {
  const handlePress = useCallback(() => {
    onPress(choice);
  }, [choice, onPress]);

  return (
    <TouchableOpacity
      key={index}
      style={[
        styles.choiceButton,
        isSelected && styles.selectedChoiceButton,
        isDisabled && styles.disabledButton
      ]}
      onPress={handlePress}
      disabled={isDisabled}
      activeOpacity={0.7}
    >
      <Text style={[
        styles.choiceText,
        isSelected && styles.selectedChoiceText
      ]}>
        {choice}
      </Text>
    </TouchableOpacity>
  );
}, (prevProps, nextProps) => {
  return (
    prevProps.choice === nextProps.choice &&
    prevProps.isSelected === nextProps.isSelected &&
    prevProps.isDisabled === nextProps.isDisabled &&
    prevProps.onPress === nextProps.onPress
  );
});

ChoiceButton.displayName = 'ChoiceButton';

const AnswerChoice: React.FC<AnswerChoiceProps> = memo(({ 
  choices, 
  onChoicePress,
  isSubmitting = false 
}) => {
  const [selectedChoice, setSelectedChoice] = useState<string | null>(null);

  const handleChoicePress = useCallback((choice: string) => {
    if (isSubmitting || selectedChoice) return; // Prevent multiple selections
    
    setSelectedChoice(choice);
    
    // Small delay for visual feedback before processing
    setTimeout(() => {
      onChoicePress(choice);
    }, 150);
  }, [isSubmitting, selectedChoice, onChoicePress]);

  // Reset selection when not submitting (for retry scenarios)
  React.useEffect(() => {
    if (!isSubmitting && selectedChoice) {
      const timer = setTimeout(() => {
        setSelectedChoice(null);
      }, 2000); // Reset after 2 seconds if submission failed
      
      return () => clearTimeout(timer);
    }
  }, [isSubmitting, selectedChoice]);

  return (
    <ThemedView style={styles.container}>
      <Text style={styles.question}>Was ist das für ein Tier?</Text>
      
      {isSubmitting && (
        <View style={styles.loadingContainer}>
          <ActivityIndicator size="large" color="#0a7ea4" />
          <Text style={styles.loadingText}>
            Antwort wird geprüft...
          </Text>
        </View>
      )}
      
      <View style={[
        styles.choicesContainer, 
        isSubmitting && styles.disabledContainer
      ]}>
        {choices.map((choice, index) => (
          <ChoiceButton
            key={`${choice}-${index}`} // More stable key
            choice={choice}
            index={index}
            isSelected={selectedChoice === choice}
            isDisabled={isSubmitting || (selectedChoice !== null && selectedChoice !== choice)}
            onPress={handleChoicePress}
          />
        ))}
      </View>
    </ThemedView>
  );
}, (prevProps, nextProps) => {
  return (
    prevProps.choices.length === nextProps.choices.length &&
    prevProps.choices.every((choice, index) => choice === nextProps.choices[index]) &&
    prevProps.isSubmitting === nextProps.isSubmitting &&
    prevProps.onChoicePress === nextProps.onChoicePress
  );
});

AnswerChoice.displayName = 'AnswerChoice';

const styles = StyleSheet.create({
  container: {
    padding: 16,
    borderRadius: 8,
    marginBottom: 16,
  },
  question: {
    fontSize: 18,
    fontWeight: 'bold',
    marginBottom: 20,
    textAlign: 'center',
    color: '#333',
  },
  loadingContainer: {
    alignItems: 'center',
    justifyContent: 'center',
    marginVertical: 20,
    backgroundColor: 'rgba(240, 240, 240, 0.8)',
    borderRadius: 12,
    padding: 16,
  },
  loadingText: {
    marginTop: 12,
    fontSize: 16,
    color: '#0a7ea4',
    fontWeight: '500',
  },
  choicesContainer: {
    gap: 12,
  },
  disabledContainer: {
    opacity: 0.6,
  },
  choiceButton: {
    padding: 18,
    borderRadius: 12,
    borderWidth: 2,
    borderColor: '#e0e0e0',
    backgroundColor: '#f8f9fa',
    // Schatten für bessere Optik
    shadowColor: '#000',
    shadowOffset: {
      width: 0,
      height: 1,
    },
    shadowOpacity: 0.1,
    shadowRadius: 2,
    elevation: 2,
  },
  selectedChoiceButton: {
    borderColor: '#4a90e2',
    backgroundColor: '#e6f0ff',
    transform: [{ scale: 0.98 }], // Subtle press effect
  },
  disabledButton: {
    opacity: 0.5,
    transform: [{ scale: 1 }],
  },
  choiceText: {
    fontSize: 16,
    textAlign: 'center',
    color: '#333',
    fontWeight: '500',
  },
  selectedChoiceText: {
    fontWeight: 'bold',
    color: '#4a90e2',
  },
});

export default AnswerChoice;