import React from 'react';
import { StyleSheet, TextInput, View } from 'react-native';
import { QUESTION_CONSTANTS } from '../constants/constants';

interface AnswerInputProps {
  value: string;
  onChangeText: (text: string) => void;
  onSubmitEditing: () => void;
}

export const AnswerInput: React.FC<AnswerInputProps> = ({
  value,
  onChangeText,
  onSubmitEditing,
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
      />
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
});

