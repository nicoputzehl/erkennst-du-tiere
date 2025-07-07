import { type AutoFreeHint, type ContextualHint, type CustomHint, HintType, type Question } from "@/src/quiz/types";
import { generateStandardHints, generateAllHints } from "../standard";
import { createTestQuestion } from "@/src/quiz/testing/testUtils";


describe("generateStandardHints", () => {
  const mockQuestion = {
    id: 1,
    images: { src: "image.jpg", alt: "alt text" },
    answer: "Lion",
  } as unknown as Question;

  it("should generate Letter Count hint correctly", () => {
    const hints = generateStandardHints(mockQuestion);
    const letterCountHint = hints.find(h => h.type === HintType.LETTER_COUNT);

    expect(letterCountHint).toBeDefined();
    expect(letterCountHint?.id).toBe("1_letter_count");
    expect(letterCountHint?.title).toBe("Buchstabenanzahl");
    expect(letterCountHint?.cost).toBe(5);
    expect(letterCountHint?.content).toBe("Das gesuchte Tier hat 4 Buchstaben");
  });

  it("should generate First Letter hint correctly", () => {
    const hints = generateStandardHints(mockQuestion);
    const firstLetterHint = hints.find(h => h.type === HintType.FIRST_LETTER);

    expect(firstLetterHint).toBeDefined();
    expect(firstLetterHint?.id).toBe("1_first_letter");
    expect(firstLetterHint?.title).toBe("Erster Buchstabe");
    expect(firstLetterHint?.cost).toBe(10);
    expect(firstLetterHint?.content).toBe("Das gesuchte Tier beginnt mit \"L\"");
  });

  it("should generate both standard hints for a question", () => {
    const hints = generateStandardHints(mockQuestion);
    expect(hints.length).toBe(2);
    expect(hints.some(h => h.type === HintType.LETTER_COUNT)).toBe(true);
    expect(hints.some(h => h.type === HintType.FIRST_LETTER)).toBe(true);
  });
});

describe("generateAllHints", () => {

  const mockCustomHint: CustomHint = {
    id: "1_custom1",
    type: HintType.CUSTOM,
    title: "Habitat",
    content: "Lives in Africa and Asia",
    cost: 15,
  };

  const mockContextualHint: ContextualHint = {
    id: "1_contextual1",
    type: HintType.CONTEXTUAL,
    title: "Size Hint",
    content: "It's a very large animal.",
    triggers: ["small", "tiny"],
  };

  const mockAutoFreeHint: AutoFreeHint = {
    id: "1_autofree1",
    type: HintType.AUTO_FREE,
    title: "Mammal Hint",
    content: "It is a mammal.",
    triggerAfterAttempts: 3,
  };

  it("should generate only standard hints if no other hints are defined", () => {
    const question = createTestQuestion();
    const allHints = generateAllHints(question);
    expect(allHints.length).toBe(2); // Letter Count and First Letter
    expect(allHints.some(h => h.type === HintType.LETTER_COUNT)).toBe(true);
    expect(allHints.some(h => h.type === HintType.FIRST_LETTER)).toBe(true);
  });

  it("should include custom hints if defined in question", () => {
    const question = { ...createTestQuestion(), customHints: [mockCustomHint] };
    const allHints = generateAllHints(question);
    expect(allHints.length).toBe(3);
    expect(allHints.some(h => h.id === mockCustomHint.id)).toBe(true);
  });

  it("should include contextual hints if defined in question", () => {
    const question = { ...createTestQuestion(), contextualHints: [mockContextualHint] };
    const allHints = generateAllHints(question);
    expect(allHints.length).toBe(3);
    expect(allHints.some(h => h.id === mockContextualHint.id)).toBe(true);
  });

  it("should include auto-free hints if defined in question", () => {
    const question = { ...createTestQuestion(), autoFreeHints: [mockAutoFreeHint] };
    const allHints = generateAllHints(question);
    expect(allHints.length).toBe(3);
    expect(allHints.some(h => h.id === mockAutoFreeHint.id)).toBe(true);
  });

  it("should include all types of hints when all are defined in question", () => {
    const question = {
      ...createTestQuestion(),
      customHints: [mockCustomHint],
      contextualHints: [mockContextualHint],
      autoFreeHints: [mockAutoFreeHint],
    };
    const allHints = generateAllHints(question);
    expect(allHints.length).toBe(5); // 2 standard + 1 custom + 1 contextual + 1 auto-free
    expect(allHints.some(h => h.type === HintType.LETTER_COUNT)).toBe(true);
    expect(allHints.some(h => h.type === HintType.FIRST_LETTER)).toBe(true);
    expect(allHints.some(h => h.id === mockCustomHint.id)).toBe(true);
    expect(allHints.some(h => h.id === mockContextualHint.id)).toBe(true);
    expect(allHints.some(h => h.id === mockAutoFreeHint.id)).toBe(true);
  });
});