import React, { useRef, useEffect, memo } from 'react';
import { 
  StyleSheet, 
  TextInput, 
  View, 
  TouchableOpacity, 
  ActivityIndicator,
  Keyboard
} from 'react-native';
import { ThemedText } from '@/src/common/components/ThemedText';
import { useThemeColor } from '@/src/common/hooks/useThemeColor';

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
  
  // Theme colors - sicherstellen dass nur Strings zurückgegeben werden
  const textColor = useThemeColor({}, 'text') as string;
  const tintColor = useThemeColor({}, 'tint') as string;
  const placeholderColor = useThemeColor(
    { light: '#666', dark: '#666' }, 
    'text'
  ) as string;

  useEffect(() => {
    const timer = setTimeout(() => {
      inputRef.current?.focus();
    }, 300);
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
            { 
              color: textColor,
              borderBottomColor: tintColor,
            },
            isSubmitting && styles.inputDisabled
          ]}
          value={value}
          onChangeText={onChangeText}
          onSubmitEditing={handleSubmit}
          autoCapitalize="none"
          autoCorrect={false}
          placeholder="Antwort eingeben..."
          placeholderTextColor={placeholderColor}
          textAlignVertical="center"
          editable={!isSubmitting}
          returnKeyType="done"
          submitBehavior="blurAndSubmit"
          maxLength={50}
        />
      </View>
      
      <TouchableOpacity 
        style={[
          styles.submitButton,
          { backgroundColor: tintColor },
          isSubmitDisabled && styles.disabledButton
        ]}
        onPress={handleSubmit}
        disabled={isSubmitDisabled}
        activeOpacity={0.8}
      >
        {isSubmitting ? (
          <View style={styles.loadingContent}>
            <ActivityIndicator size="small" color="#fff" />
            <ThemedText 
              style={styles.loadingButtonText}
              lightColor="#fff"
              darkColor="#fff"
            >
              Prüfen...
            </ThemedText>
          </View>
        ) : (
          <ThemedText 
            style={styles.submitButtonText}
            lightColor="#fff"
            darkColor="#fff"
          >
            Prüfen
          </ThemedText>
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
    borderWidth: 0,
    borderBottomWidth: 2,
    paddingHorizontal: 12,
    paddingVertical: 8,
    fontSize: 18,
    backgroundColor: 'transparent',
    textAlign: 'center',
    fontWeight: '500',
  },
  inputDisabled: {
    opacity: 0.7,
  },
  submitButton: {
    paddingVertical: 14,
    paddingHorizontal: 24,
    borderRadius: 12,
    width: '70%',
    alignItems: 'center',
    justifyContent: 'center',
    minHeight: 50,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 4,
    elevation: 3,
  },
  disabledButton: {
    opacity: 0.5,
  },
  submitButtonText: {
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
    fontWeight: '600',
    fontSize: 14,
  },
});