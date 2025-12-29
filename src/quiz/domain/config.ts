const STARTINGPOINTS = 0;
const BASIC_QUIZ_POINTS = 1;
const STANDARD_HINT_COST = 2;
const CUSTOM_HINT_COST = 2;

export const Config = {
  startingPoints: STARTINGPOINTS,
  questionSolvedPoints: BASIC_QUIZ_POINTS,
  standardHintCost: STANDARD_HINT_COST,
  customHintCost: CUSTOM_HINT_COST,
} as const;