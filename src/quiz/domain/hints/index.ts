import { generateHintContent } from "./generation";
import { calculatePointsForCorrectAnswer, createPointTransaction, getInitialUserPoints } from "./points";
import { checkForContextualHints, getTriggeredContent } from "./triggering";
import { canUseHint, isAutoFreeHint, isContextualHint, isDynamicHint, isStaticHint } from "./validation";

import { createAutoFreeHint, createCustomHint, createContextualHint, createEscalatingAutoFreeHint, createFirstLetterHint, createLetterCountHint } from './factories';

export const HintUtils = {
  // Validation
  canUseHint,

  // Generation
  generateHintContent,
  getTriggeredContent,

  // Triggering
  checkForContextualHints,

  // Points
  calculatePointsForCorrectAnswer,
  createPointTransaction,
  getInitialUserPoints,

  // Type Guards
  isStaticHint,
  isDynamicHint,
  isContextualHint,
  isAutoFreeHint,

  // Factories
  createAutoFreeHint,
  createCustomHint,
  createContextualHint,
  createEscalatingAutoFreeHint,
  createFirstLetterHint,
  createLetterCountHint
} as const;