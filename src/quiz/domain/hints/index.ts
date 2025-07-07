import { generateAllHints, generateStandardHints } from "./standard";
import { generateHintContent, getTriggeredContent } from "./generation";

import {
  calculatePointsForCorrectAnswer,
  createPointTransaction,
  getInitialUserPoints,
} from "./points";

import {
  checkForContextualHints,
  checkTriggeredHints,
} from "./triggering";

import {
  canUseHint,
  isAutoFreeHint,
  isContextualHint,
} from "./validation";

export const HintUtils = {
  generateAllHints,
  generateStandardHints,
  generateHintContent,
  getTriggeredContent,
  
  // Validation
  canUseHint,

  // Triggering
  checkForContextualHints,
  checkTriggeredHints,

  // Points
  calculatePointsForCorrectAnswer,
  createPointTransaction,
  getInitialUserPoints,

  isContextualHint,
  isAutoFreeHint,
} as const;