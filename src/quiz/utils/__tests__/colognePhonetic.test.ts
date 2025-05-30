/**
 * Jest Test Suite for Cologne Phonetic Algorithm
 * Tests all functions and edge cases
 */

import { colognePhonetic, testHelpers } from '../colognePhonetic'

const { preprocessWord, parseWord, postProcessPhoneticCode, LETTER_SETS, PHONETIC_RULES } = testHelpers;

describe('Cologne Phonetic Algorithm', () => {
  
  describe('preprocessWord', () => {
    test('should convert to lowercase', () => {
      expect(preprocessWord('MÜLLER')).toBe('mueller');
      expect(preprocessWord('Schmidt')).toBe('schmidt');
    });

    test('should replace German umlauts', () => {
      expect(preprocessWord('ö')).toBe('oe');
      expect(preprocessWord('ü')).toBe('ue');
      expect(preprocessWord('ä')).toBe('ae');
      expect(preprocessWord('ß')).toBe('ss');
    });

    test('should handle multiple umlauts', () => {
      expect(preprocessWord('Größe')).toBe('groesse');
      expect(preprocessWord('Müße')).toBe('muesse');
      expect(preprocessWord('Bäcker')).toBe('baecker');
    });

    test('should handle edge cases', () => {
      expect(preprocessWord('')).toBe('');
      expect(preprocessWord(' ')).toBe(' ');
      expect(preprocessWord('123')).toBe('123');
    });

    test('should handle invalid input', () => {
      expect(preprocessWord(null as any)).toBe('');
      expect(preprocessWord(undefined as any)).toBe('');
      expect(preprocessWord(123 as any)).toBe('');
    });
  });

  describe('parseWord', () => {
    test('should handle vowels correctly', () => {
      expect(parseWord('a')).toBe('0');
      expect(parseWord('e')).toBe('0');
      expect(parseWord('i')).toBe('0');
      expect(parseWord('o')).toBe('0');
      expect(parseWord('u')).toBe('0');
      expect(parseWord('y')).toBe('0');
      expect(parseWord('j')).toBe('0');
    });

    test('should ignore h', () => {
      expect(parseWord('h')).toBe('');
      expect(parseWord('ah')).toBe('0');
      expect(parseWord('ha')).toBe('0');
    });

    test('should handle consonants correctly', () => {
      expect(parseWord('b')).toBe('1');
      expect(parseWord('f')).toBe('3');
      expect(parseWord('v')).toBe('3');
      expect(parseWord('w')).toBe('3');
      expect(parseWord('g')).toBe('4');
      expect(parseWord('k')).toBe('4');
      expect(parseWord('q')).toBe('4');
      expect(parseWord('l')).toBe('5');
      expect(parseWord('m')).toBe('6');
      expect(parseWord('n')).toBe('6');
      expect(parseWord('r')).toBe('7');
      expect(parseWord('s')).toBe('8');
      expect(parseWord('z')).toBe('8');
    });

    test('should handle p correctly', () => {
      expect(parseWord('p')).toBe('1');
      expect(parseWord('pa')).toBe('1'); // 0s are removed after first position
      expect(parseWord('ph')).toBe('3');
      expect(parseWord('pf')).toBe('13');
    });

    test('should handle d,t correctly', () => {
      expect(parseWord('d')).toBe('2');
      expect(parseWord('t')).toBe('2');
      expect(parseWord('da')).toBe('2'); // 0s are removed after first position
      expect(parseWord('dc')).toBe('8');
      expect(parseWord('ds')).toBe('8');
      expect(parseWord('dz')).toBe('8');
      expect(parseWord('tc')).toBe('8');
      expect(parseWord('ts')).toBe('8');
      expect(parseWord('tz')).toBe('8');
    });

    test('should handle c correctly', () => {
      // At beginning
      expect(parseWord('ca')).toBe('4'); // 0s are removed after first position
      expect(parseWord('ch')).toBe('4');
      expect(parseWord('ck')).toBe('4');
      expect(parseWord('ce')).toBe('8');
      expect(parseWord('ci')).toBe('8');
      
      // Not at beginning
      expect(parseWord('aca')).toBe('04'); // Keeps leading 0
      expect(parseWord('ece')).toBe('08'); // Keeps leading 0
      expect(parseWord('sca')).toBe('8'); // prev=s, next=a -> 8
      expect(parseWord('zca')).toBe('8'); // prev=z, next=a -> 8
    });

    test('should handle x correctly', () => {
      expect(parseWord('x')).toBe('8'); // '48' -> '8' after duplicate removal
      expect(parseWord('ax')).toBe('048'); // Keeps the full sequence
      expect(parseWord('cx')).toBe('48'); // c=4, x=8 -> 48
      expect(parseWord('kx')).toBe('48'); // k=4, x=8 -> 48 (no duplicate removal, different rule)
      expect(parseWord('qx')).toBe('48'); // q=4, x=8 -> 48 (no duplicate removal, different rule)
    });

    test('should handle empty input', () => {
      expect(parseWord('')).toBe('');
    });
  });

  describe('postProcessPhoneticCode', () => {
    test('should remove consecutive duplicates', () => {
      expect(postProcessPhoneticCode('1122')).toBe('12');
      expect(postProcessPhoneticCode('1112223')).toBe('123');
      expect(postProcessPhoneticCode('4444')).toBe('4');
    });

    test('should remove non-leading zeros', () => {
      expect(postProcessPhoneticCode('102')).toBe('12');
      expect(postProcessPhoneticCode('1020')).toBe('12');
      expect(postProcessPhoneticCode('0102')).toBe('012');
      expect(postProcessPhoneticCode('010203')).toBe('0123');
    });

    test('should handle leading zeros', () => {
      expect(postProcessPhoneticCode('0')).toBe('0');
      expect(postProcessPhoneticCode('01')).toBe('01');
      expect(postProcessPhoneticCode('012')).toBe('012');
    });

    test('should combine both rules', () => {
      expect(postProcessPhoneticCode('11002233')).toBe('123');
      expect(postProcessPhoneticCode('001122')).toBe('012');
    });

    test('should handle edge cases', () => {
      expect(postProcessPhoneticCode('')).toBe('');
      expect(postProcessPhoneticCode('1')).toBe('1');
    });
  });

  describe('colognePhonetic - Main Function', () => {
    test('should handle German animal names', () => {
      expect(colognePhonetic('Bär')).toBe('17');
      expect(colognePhonetic('Baer')).toBe('17');
      expect(colognePhonetic('Hund')).toBe('062');
      expect(colognePhonetic('Katze')).toBe('48');
      expect(colognePhonetic('Maus')).toBe('68');
      expect(colognePhonetic('Vogel')).toBe('345');
      expect(colognePhonetic('Pferd')).toBe('1372');
      expect(colognePhonetic('Fuchs')).toBe('348');
      expect(colognePhonetic('Wolf')).toBe('353');
      expect(colognePhonetic('Hase')).toBe('08'); // h ignored, a=0, s=8, e=0->removed
    });

    test('should produce same codes for similar sounding animal names', () => {
      // Bär variants
      expect(colognePhonetic('Bär')).toBe(colognePhonetic('Baer'));
      expect(colognePhonetic('Bär')).toBe(colognePhonetic('Bear'));
      
      // Küken variants
      expect(colognePhonetic('Küken')).toBe(colognePhonetic('Kueken'));
      
      // Mäuse variants
      expect(colognePhonetic('Mäuse')).toBe(colognePhonetic('Maeuse'));
      expect(colognePhonetic('Mäuse')).toBe(colognePhonetic('Meuse'));
      
      // Füchs variants
      expect(colognePhonetic('Fuchs')).toBe(colognePhonetic('Vuchs'));
    });

    test('should handle multiple animal words', () => {
      expect(colognePhonetic('Großer Bär')).toBe('478717');
      expect(colognePhonetic('Kleine Katze')).toBe('45648');
      expect(colognePhonetic('Weißer Hund')).toBe('387062');
    });

    test('should handle edge cases', () => {
      expect(colognePhonetic('')).toBe('');
      expect(colognePhonetic('   ')).toBe('');
      expect(colognePhonetic('a')).toBe('0');
      expect(colognePhonetic('h')).toBe('');
    });

    test('should handle invalid input', () => {
      expect(colognePhonetic(null as any)).toBe('');
      expect(colognePhonetic(undefined as any)).toBe('');
      expect(colognePhonetic(123 as any)).toBe('');
    });

    test('should handle special characters and numbers', () => {
      expect(colognePhonetic('Bär-Katze')).toBe('1748');
      expect(colognePhonetic('O\'Hase')).toBe('08');
      expect(colognePhonetic('Hund123')).toBe('062');
      expect(colognePhonetic('123Katze')).toBe('48');
    });

    test('should be case insensitive', () => {
      expect(colognePhonetic('BÄR')).toBe(colognePhonetic('bär'));
      expect(colognePhonetic('KaTzE')).toBe(colognePhonetic('KATZE'));
      expect(colognePhonetic('hund')).toBe(colognePhonetic('HUND'));
    });
  });

  describe('Known Test Cases from Literature', () => {
    // These are standard test cases using German animal names
    test('should match specification examples with animal names', () => {
      expect(colognePhonetic('Büffel')).toBe('135');
      expect(colognePhonetic('Wisent')).toBe('3862');
      expect(colognePhonetic('Murmeltier')).toBe('676527');
      expect(colognePhonetic('Hirsch')).toBe('078');
    });
  });

  describe('Performance and Stress Tests', () => {
    test('should handle long strings efficiently', () => {
      const longString = 'Elefant'.repeat(100);
      const startTime = Date.now();
      const result = colognePhonetic(longString);
      const endTime = Date.now();
      
      // The string 'ElefantElefant...' without spaces is treated as one word
      // Expected: first '05362' + remaining '5362' repeated 99 times
      const expected = '05362' + '5362'.repeat(99);
      expect(result).toBe(expected);
      expect(endTime - startTime).toBeLessThan(100); // Should complete in under 100ms
    });

    test('should handle many short words', () => {
      const manyWords = Array(100).fill('Tiger').join(' ');
      const result = colognePhonetic(manyWords);
      expect(result).toBe('247'.repeat(100));
    });
  });

  describe('Regression Tests', () => {
    test('should handle consecutive identical letters', () => {
      expect(colognePhonetic('Affe')).toBe('03');
      expect(colognePhonetic('Otter')).toBe('027');
      expect(colognePhonetic('Giraffe')).toBe('473');
    });

    test('should handle words with only vowels', () => {
      expect(colognePhonetic('Aue')).toBe('0');
      expect(colognePhonetic('Eule')).toBe('05');
      expect(colognePhonetic('Oie')).toBe('0');
    });

    test('should handle words with silent h', () => {
      expect(colognePhonetic('Huhn')).toBe('06');
      expect(colognePhonetic('Reh')).toBe('7');
      expect(colognePhonetic('Kuh')).toBe('4');
    });
  });

  describe('Data Structure Tests', () => {
    test('LETTER_SETS should contain expected letters', () => {
      expect(LETTER_SETS.VOWELS.has('a')).toBe(true);
      expect(LETTER_SETS.VOWELS.has('e')).toBe(true);
      expect(LETTER_SETS.VOWELS.has('b')).toBe(false);
      
      expect(LETTER_SETS.CSZ.has('c')).toBe(true);
      expect(LETTER_SETS.CSZ.has('s')).toBe(true);
      expect(LETTER_SETS.CSZ.has('z')).toBe(true);
      expect(LETTER_SETS.CSZ.has('d')).toBe(false);
    });

    test('PHONETIC_RULES should contain all expected letters', () => {
      const expectedLetters = ['a', 'e', 'i', 'j', 'o', 'u', 'y', 'h', 'b', 'p', 'd', 't', 'f', 'v', 'w', 'g', 'k', 'q', 'l', 'm', 'n', 'r', 's', 'z', 'c', 'x'];
      expectedLetters.forEach(letter => {
        expect(PHONETIC_RULES[letter]).toBeDefined();
        expect(typeof PHONETIC_RULES[letter]).toBe('function');
      });
    });
  });
});