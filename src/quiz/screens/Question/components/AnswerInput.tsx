import React, { useRef, useEffect, memo } from 'react';
import { 
  StyleSheet, 
  TextInput, 
  View, 
  TouchableOpacity, 
  ActivityIndicator, 
  Text,
  Keyboard
} from 'react-native';

interface AnswerInputProps {
  value: string;
  onChangeText: (text: string) => void;
  onSubmitEditing: () => void;
  isSubmitting?: boolean;
}

export const AnswerInput: React.FC<AnswerInputProps> = memo(({
  value,
  onChangeText,
  onSubmitEditing,
  isSubmitting = false,
}) => {
  const inputRef = useRef<TextInput>(null);

  // Auto-focus on mount for better UX
  useEffect(() => {
    const timer = setTimeout(() => {
      inputRef.current?.focus();
    }, 300); // Small delay to ensure component is mounted

    return () => clearTimeout(timer);
  }, []);

  useEffect(() => {
    if (isSubmitting) {
      inputRef.current?.blur();
      Keyboard.dismiss();
    }
  }, [isSubmitting]);

  const handleSubmit = () => {
    if (!value.trim() || isSubmitting) return;
    
    Keyboard.dismiss();
    onSubmitEditing();
  };

  const isSubmitDisabled = isSubmitting || !value.trim();

  return (
    <View style={styles.container}>
      <View style={styles.inputContainer}>
        <TextInput
          ref={inputRef}
          style={[
            styles.input,
            isSubmitting && styles.inputDisabled
          ]}
          value={value}
          onChangeText={onChangeText}
          onSubmitEditing={handleSubmit}
          autoCapitalize="none"
          autoCorrect={false}
          placeholder="Antwort eingeben..."
          placeholderTextColor="#999"
          textAlignVertical="center"
          editable={!isSubmitting}
          returnKeyType="done"
          submitBehavior='blurAndSubmit'
          maxLength={50} // Reasonable limit
        />
      </View>
      
      <TouchableOpacity 
        style={[
          styles.submitButton, 
          isSubmitDisabled && styles.disabledButton
        ]}
        onPress={handleSubmit}
        disabled={isSubmitDisabled}
        activeOpacity={0.8}
      >
        {isSubmitting ? (
          <View style={styles.loadingContent}>
            <ActivityIndicator size="small" color="#fff" />
            <Text style={styles.loadingButtonText}>Prüfen...</Text>
          </View>
        ) : (
          <Text style={styles.submitButtonText}>Prüfen</Text>
        )}
      </TouchableOpacity>
    </View>
  );
}, (prevProps, nextProps) => {
  return (
    prevProps.value === nextProps.value &&
    prevProps.isSubmitting === nextProps.isSubmitting &&
    prevProps.onChangeText === nextProps.onChangeText &&
    prevProps.onSubmitEditing === nextProps.onSubmitEditing
  );
});

AnswerInput.displayName = 'AnswerInput';

const styles = StyleSheet.create({
  container: {
    marginBottom: 20,
    alignItems: 'center',
    width: '100%',
  },
  inputContainer: {
    width: '85%',
    marginBottom: 16,
  },
  input: {
    height: 50,
    borderColor: '#ddd',
    borderWidth: 0,
    borderBottomWidth: 2,
    paddingHorizontal: 12,
    paddingVertical: 8,
    fontSize: 18,
    backgroundColor: 'transparent',
    textAlign: 'center',
    color: '#333',
    fontWeight: '500',
  },
  inputDisabled: {
    opacity: 0.7,
    backgroundColor: '#f5f5f5',
  },
  submitButton: {
    backgroundColor: '#0a7ea4',
    paddingVertical: 14,
    paddingHorizontal: 24,
    borderRadius: 12,
    width: '70%',
    alignItems: 'center',
    justifyContent: 'center',
    minHeight: 50,
    // Schatten
    shadowColor: '#000',
    shadowOffset: {
      width: 0,
      height: 2,
    },
    shadowOpacity: 0.1,
    shadowRadius: 4,
    elevation: 3,
  },
  disabledButton: {
    opacity: 0.5,
    backgroundColor: '#ccc',
  },
  submitButtonText: {
    color: '#fff',
    fontWeight: '700',
    fontSize: 16,
    letterSpacing: 0.5,
  },
  loadingContent: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 8,
  },
  loadingButtonText: {
    color: '#fff',
    fontWeight: '600',
    fontSize: 14,
  },
});