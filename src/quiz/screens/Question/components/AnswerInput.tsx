import React from 'react';
import { StyleSheet, TextInput, View, TouchableOpacity, ActivityIndicator, Text } from 'react-native';
import { QUESTION_CONSTANTS } from '../constants/constants';

interface AnswerInputProps {
  value: string;
  onChangeText: (text: string) => void;
  onSubmitEditing: () => void;
  isSubmitting?: boolean;
}

export const AnswerInput: React.FC<AnswerInputProps> = ({
  value,
  onChangeText,
  onSubmitEditing,
  isSubmitting = false,
}) => {
  return (
    <View style={styles.container}>
      <TextInput
        style={styles.input}
        value={value}
        onChangeText={onChangeText}
        onSubmitEditing={onSubmitEditing}
        autoCapitalize="none"
        autoCorrect={false}
        placeholder="Antwort eingeben..."
        textAlignVertical="center"
        editable={!isSubmitting}
      />
      
      <TouchableOpacity 
        style={[styles.submitButton, isSubmitting && styles.disabledButton]}
        onPress={onSubmitEditing}
        disabled={isSubmitting || !value.trim()}
      >
        {isSubmitting ? (
          <ActivityIndicator size="small" color="#fff" />
        ) : (
          <Text style={styles.submitButtonText}>Prüfen</Text>
        )}
      </TouchableOpacity>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    marginBottom: 20,
    alignItems: 'center',
  },
  input: {
    height: QUESTION_CONSTANTS.inputHeight,
    borderColor: '#ccc',
    borderWidth: 0,
    borderBottomWidth: 1,
    padding: 12,
    fontSize: 20,
    backgroundColor: '#fff',
    marginBottom: 12,
    width: '80%',
    textAlign: 'center',
  },
  submitButton: {
    backgroundColor: '#0a7ea4',
    padding: 12,
    borderRadius: 8,
    width: '60%',
    alignItems: 'center',
  },
  disabledButton: {
    opacity: 0.6,
  },
  submitButtonText: {
    color: '#fff',
    fontWeight: '600',
    fontSize: 16,
  },
});