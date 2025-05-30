import { arePhoneticallySimilar, isAnswerCorrect } from '../answerComparison';
import { colognePhonetic } from '../colognePhonetic';
import { normalizeString } from '../normalizeString';

// Mock dependencies
jest.mock('../colognePhonetic');
jest.mock('../normalizeString');

const mockColognePhonetic = colognePhonetic as jest.MockedFunction<typeof colognePhonetic>;
const mockNormalizeString = normalizeString as jest.MockedFunction<typeof normalizeString>;


describe('arePhoneticallySimilar', () => {
  beforeEach(() => {
    jest.clearAllMocks();
  });

  describe('input validation', () => {
    it('should return false for empty strings', () => {
      expect(arePhoneticallySimilar('', '')).toBe(false);
      expect(arePhoneticallySimilar('  ', '  ')).toBe(false);
      expect(arePhoneticallySimilar('test', '')).toBe(false);
      expect(arePhoneticallySimilar('', 'test')).toBe(false);
    });

    it('should handle whitespace-only strings', () => {
      expect(arePhoneticallySimilar('   ', 'test')).toBe(false);
      expect(arePhoneticallySimilar('test', '   ')).toBe(false);
    });
  });

  describe('phonetic comparison', () => {
    it('should return true for identical phonetic codes', () => {
      mockColognePhonetic.mockReturnValueOnce('123').mockReturnValueOnce('123');

      expect(arePhoneticallySimilar('Müller', 'Mueller')).toBe(true);
      expect(mockColognePhonetic).toHaveBeenCalledWith('Müller');
      expect(mockColognePhonetic).toHaveBeenCalledWith('Mueller');
    });

    it('should return false for different phonetic codes', () => {
      mockColognePhonetic.mockReturnValueOnce('123').mockReturnValueOnce('456');

      expect(arePhoneticallySimilar('Schmidt', 'Meyer')).toBe(false);
    });

    it('should return false for empty phonetic codes', () => {
      mockColognePhonetic.mockReturnValueOnce('').mockReturnValueOnce('');

      expect(arePhoneticallySimilar('test1', 'test2')).toBe(false);
    });

    it('should return false when one phonetic code is empty', () => {
      mockColognePhonetic.mockReturnValueOnce('123').mockReturnValueOnce('');

      expect(arePhoneticallySimilar('test1', 'test2')).toBe(false);
    });
  });
});

describe('isAnswerCorrect', () => {
  beforeEach(() => {
    jest.clearAllMocks();
    // Default mock für normalizeString
    mockNormalizeString.mockImplementation((str: string) => str.toLowerCase().trim());
  });

  describe('input validation', () => {
    it('should return false for null/undefined inputs', () => {
      expect(isAnswerCorrect(null as any, 'correct')).toBe(false);
      expect(isAnswerCorrect('user', null as any)).toBe(false);
      expect(isAnswerCorrect(undefined as any, 'correct')).toBe(false);
      expect(isAnswerCorrect('user', undefined as any)).toBe(false);
    });

    it('should return false for empty strings', () => {
      expect(isAnswerCorrect('', 'correct')).toBe(false);
      expect(isAnswerCorrect('user', '')).toBe(false);
      expect(isAnswerCorrect('', '')).toBe(false);
    });
  });

  describe('exact matching after normalization', () => {
    it('should return true for identical normalized answers', () => {
      mockNormalizeString.mockReturnValueOnce('test').mockReturnValueOnce('test');

      expect(isAnswerCorrect('Test', 'TEST')).toBe(true);
      expect(mockNormalizeString).toHaveBeenCalledWith('Test');
      expect(mockNormalizeString).toHaveBeenCalledWith('TEST');
    });

    it('should handle case differences through normalization', () => {
      mockNormalizeString.mockReturnValueOnce('berlin').mockReturnValueOnce('berlin');

      expect(isAnswerCorrect('Berlin', 'BERLIN')).toBe(true);
    });
  });

  describe('phonetic matching', () => {
    beforeEach(() => {
      // Mock für unterschiedliche normalisierte Strings
      mockNormalizeString.mockReturnValueOnce('mueller').mockReturnValueOnce('müller');
    });

    it('should return true for phonetically similar answers', () => {
      mockColognePhonetic.mockReturnValueOnce('65537').mockReturnValueOnce('65537');

      expect(isAnswerCorrect('Mueller', 'Müller')).toBe(true);
    });

    it('should return false for phonetically different answers', () => {
      mockColognePhonetic.mockReturnValueOnce('123').mockReturnValueOnce('456');

      expect(isAnswerCorrect('Schmidt', 'Meyer')).toBe(false);
    });
  });

  describe('alternative answers', () => {
    beforeEach(() => {
      // Mock für unterschiedliche normalisierte Strings
      mockNormalizeString.mockImplementation((str: string) => {
        const normalized = str.toLowerCase().trim();
        return normalized;
      });
    });

    it('should return false when no alternatives provided', () => {
      mockNormalizeString.mockReturnValueOnce('user').mockReturnValueOnce('correct');
      mockColognePhonetic.mockReturnValueOnce('123').mockReturnValueOnce('456');

      expect(isAnswerCorrect('user', 'correct')).toBe(false);
    });

    it('should return false for empty alternatives array', () => {
      mockNormalizeString.mockReturnValueOnce('user').mockReturnValueOnce('correct');
      mockColognePhonetic.mockReturnValueOnce('123').mockReturnValueOnce('456');

      expect(isAnswerCorrect('user', 'correct', [])).toBe(false);
    });

    it('should match against normalized alternative answers', () => {
      mockNormalizeString
        .mockReturnValueOnce('berlin') // userAnswer
        .mockReturnValueOnce('münchen') // correctAnswer
        .mockReturnValueOnce('berlin'); // alternative

      // Mock phonetic calls that won't be reached due to exact match
      mockColognePhonetic.mockReturnValue('123');

      expect(isAnswerCorrect('Berlin', 'München', ['BERLIN', 'Hamburg'])).toBe(true);
    });

    it('should match against phonetically similar alternatives', () => {
      mockNormalizeString
        .mockReturnValueOnce('mueller') // userAnswer
        .mockReturnValueOnce('schmidt') // correctAnswer
        .mockReturnValueOnce('müller'); // alternative

      mockColognePhonetic
        .mockReturnValueOnce('123') // userAnswer vs correctAnswer
        .mockReturnValueOnce('456') // correctAnswer
        .mockReturnValueOnce('65537') // alternative vs userAnswer
        .mockReturnValueOnce('65537'); // userAnswer

      expect(isAnswerCorrect('Mueller', 'Schmidt', ['Müller'])).toBe(true);
    });

    it('should return false when no alternative matches', () => {
      mockNormalizeString
        .mockReturnValueOnce('user') // userAnswer
        .mockReturnValueOnce('correct') // correctAnswer
        .mockReturnValueOnce('alt1') // alternative 1
        .mockReturnValueOnce('alt2'); // alternative 2

      mockColognePhonetic
        .mockReturnValueOnce('123') // userAnswer vs correctAnswer
        .mockReturnValueOnce('456') // correctAnswer
        .mockReturnValueOnce('789') // alt1 vs userAnswer
        .mockReturnValueOnce('123') // userAnswer
        .mockReturnValueOnce('999') // alt2 vs userAnswer
        .mockReturnValueOnce('123'); // userAnswer

      expect(isAnswerCorrect('user', 'correct', ['alt1', 'alt2'])).toBe(false);
    });

    it('should check multiple alternatives and return true for first match', () => {
      mockNormalizeString
        .mockReturnValueOnce('target') // userAnswer
        .mockReturnValueOnce('correct') // correctAnswer  
        .mockReturnValueOnce('wrong') // alternative 1
        .mockReturnValueOnce('target'); // alternative 2

      // Mock phonetic calls that won't be reached due to exact match on alt 2
      mockColognePhonetic.mockReturnValue('123');

      expect(isAnswerCorrect('target', 'correct', ['wrong', 'TARGET', 'other'])).toBe(true);
    });
  });

  describe('integration scenarios', () => {
    beforeEach(() => {
      mockNormalizeString.mockImplementation((str: string) => str.toLowerCase().trim());
    });

    it('should handle complex real-world scenario', () => {
      // User answers "Berlin", correct is "München", alternatives include "Berlin"
      mockNormalizeString
        .mockReturnValueOnce('berlin') // userAnswer
        .mockReturnValueOnce('münchen') // correctAnswer
        .mockReturnValueOnce('hamburg') // alternative 1 - no match
        .mockReturnValueOnce('berlin'); // alternative 2 - match

      // Mock phonetic calls that won't be reached due to exact match
      mockColognePhonetic.mockReturnValue('123');

      const result = isAnswerCorrect(
        'Berlin   ',
        'München',
        ['Hamburg', ' Berlin ', 'Dresden']
      );

      expect(result).toBe(true);
    });
    it('should prioritize exact match over phonetic match', () => {
      mockNormalizeString.mockReturnValueOnce('test').mockReturnValueOnce('test');
      mockColognePhonetic.mockReturnValueOnce('123').mockReturnValueOnce('123');

      // Even though phonetic function is called, exact match determines the result
      expect(isAnswerCorrect('test', 'TEST')).toBe(true);
      expect(mockColognePhonetic).toHaveBeenCalledWith('test');
      expect(mockColognePhonetic).toHaveBeenCalledWith('TEST');
    });
  });
});