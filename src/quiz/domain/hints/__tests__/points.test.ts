import { calculatePointsForCorrectAnswer, createPointTransaction, getInitialUserPoints } from "../points";
import { createTestQuestion } from "@/src/quiz/testing/testUtils";


describe("calculatePointsForCorrectAnswer", () => {


  it("should return base points for a correct answer", () => {
    const points = calculatePointsForCorrectAnswer(createTestQuestion());
    expect(points).toBe(10);
  });

  // If there were hint-related bonuses, you'd add tests here
  // For example:
  // it("should include hint bonus if applicable", () => {
  //   const questionWithHints = { ...mockQuestion, hints: [{ id: "h1", type: HintType.CUSTOM, title: "", content: "" }] };
  //   const points = calculatePointsForCorrectAnswer(questionWithHints);
  //   expect(points).toBe(12); // Assuming 2 points per hint as per commented out code
  // });
});

describe("createPointTransaction", () => {
  const mockDateNow = 1678886400000; // Example timestamp for consistency
  const mockMathRandom = 0.5; // Example random for consistency

  beforeAll(() => {
    jest.spyOn(Date, 'now').mockReturnValue(mockDateNow);
    jest.spyOn(Math, 'random').mockReturnValue(mockMathRandom);
  });

  afterAll(() => {
    jest.restoreAllMocks();
  });

  it("should create an 'earned' point transaction correctly", () => {
    const transaction = createPointTransaction("earned", 20, "Quiz completion", "quiz1", 5, "hint1");
    expect(transaction).toEqual({
      id: `${mockDateNow}_${mockMathRandom}`,
      type: "earned",
      amount: 20,
      reason: "Quiz completion",
      timestamp: mockDateNow,
      quizId: "quiz1",
      questionId: 5,
      hintId: "hint1",
    });
  });

  it("should create a 'spent' point transaction correctly", () => {
    const transaction = createPointTransaction("spent", 5, "Used hint", "quiz2", 10, "hint2");
    expect(transaction).toEqual({
      id: `${mockDateNow}_${mockMathRandom}`,
      type: "spent",
      amount: 5,
      reason: "Used hint",
      timestamp: mockDateNow,
      quizId: "quiz2",
      questionId: 10,
      hintId: "hint2",
    });
  });

  it("should create a transaction with only required fields", () => {
    const transaction = createPointTransaction("earned", 50, "Daily bonus");
    expect(transaction).toEqual({
      id: `${mockDateNow}_${mockMathRandom}`,
      type: "earned",
      amount: 50,
      reason: "Daily bonus",
      timestamp: mockDateNow,
      quizId: undefined,
      questionId: undefined,
      hintId: undefined,
    });
  });
});

describe("getInitialUserPoints", () => {
  const mockDateNow = 1678886400000; // Example timestamp for consistency
  const mockMathRandom = 0.5; // Example random for consistency

  beforeAll(() => {
    jest.spyOn(Date, 'now').mockReturnValue(mockDateNow);
    jest.spyOn(Math, 'random').mockReturnValue(mockMathRandom);
  });

  afterAll(() => {
    jest.restoreAllMocks();
  });

  it("should return the correct initial user points state", () => {
    const initialState = getInitialUserPoints();
    expect(initialState.totalPoints).toBe(50);
    expect(initialState.earnedPoints).toBe(50);
    expect(initialState.spentPoints).toBe(0);
    expect(initialState.pointsHistory.length).toBe(1);
    expect(initialState.pointsHistory[0]).toEqual({
      id: `${mockDateNow}_${mockMathRandom}`,
      type: "earned",
      amount: 50,
      reason: "Startguthaben",
      timestamp: mockDateNow,
      quizId: undefined,
      questionId: undefined,
      hintId: undefined,
    });
  });
});