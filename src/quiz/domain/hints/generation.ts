import { QuestionBase } from "../../types";
import { Hint } from "../../types/hint";
import { isAutoFreeHint, isContextualHint, isDynamicHint, isStaticHint } from "./validation";

export const generateHintContent = (hint: Hint, question: QuestionBase): string => {
  if (isDynamicHint(hint)) {
    return hint.generator(question);
  }
  
  if (isStaticHint(hint)) {
    return hint.content;
  }
  
  if (isContextualHint(hint)) {
    return hint.content;
  }
  
  if (isAutoFreeHint(hint)) {
    if (hint.escalatingContent) {
      // Needs access to wrong attempts - passed separately
      return hint.content; // Fallback for now
    }
    return hint.content;
  }
  
  return 'Hint nicht verfügbar';
};