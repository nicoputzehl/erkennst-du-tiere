import { Platform } from "react-native";

export const QUESTION_CONSTANTS = {
  imageHeight: 400,
  inputHeight: 50,
  keyboardVerticalOffset: Platform.OS === 'ios' ? 100 : 0,
} as const;

export const ANSWER_STATES = {
  INITIAL: 'initial',
  CORRECT: 'correct',
  INCORRECT: 'incorrect',
} as const;
