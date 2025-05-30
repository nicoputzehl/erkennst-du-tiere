/**
 * Improved Cologne Phonetics (Kölner Phonetik) Algorithm
 * Converts German words to phonetic codes for fuzzy matching
 */

// Letter sets for phonetic rules
const LETTER_SETS = {
  VOWELS: new Set(['a', 'e', 'i', 'j', 'o', 'u', 'y']),
  AHKOQUX: new Set(['a', 'h', 'k', 'o', 'q', 'u', 'x']),
  AHKLOQRUX: new Set(['a', 'h', 'k', 'l', 'o', 'q', 'r', 'u', 'x']),
  CSZ: new Set(['c', 's', 'z']),
  CKQ: new Set(['c', 'k', 'q']),
  SZ: new Set(['s', 'z']),
  H: new Set(['h'])
} as const;

// Umlaut replacements
const UMLAUT_MAP: Record<string, string> = {
  'ö': 'oe',
  'ü': 'ue', 
  'ä': 'ae',
  'ß': 'ss'
};

// Helper functions
const isInSet = (letter: string | null, set: Set<string>): boolean => 
  letter !== null && set.has(letter);

const isNotInSet = (letter: string | null, set: Set<string>): boolean =>
  letter !== null && !set.has(letter);

/**
 * Phonetic mapping functions
 * Each function takes previous and next letter context
 */
const PHONETIC_RULES: Record<string, (prev: string | null, next: string | null) => string> = {
  // Vowels -> 0
  'a': () => '0', 'e': () => '0', 'i': () => '0', 
  'j': () => '0', 'o': () => '0', 'u': () => '0', 'y': () => '0',
  
  // H is ignored
  'h': () => '',
  
  // B -> 1
  'b': () => '1',
  
  // P -> 1, except before H -> 3
  'p': (_, next) => isInSet(next, LETTER_SETS.H) ? '3' : '1',
  
  // D,T -> 2, except before C,S,Z -> 8
  'd': (_, next) => isInSet(next, LETTER_SETS.CSZ) ? '8' : '2',
  't': (_, next) => isInSet(next, LETTER_SETS.CSZ) ? '8' : '2',
  
  // F,V,W -> 3
  'f': () => '3', 'v': () => '3', 'w': () => '3',
  
  // G,K,Q -> 4
  'g': () => '4', 'k': () => '4', 'q': () => '4',
  
  // L -> 5
  'l': () => '5',
  
  // M,N -> 6
  'm': () => '6', 'n': () => '6',
  
  // R -> 7
  'r': () => '7',
  
  // S,Z -> 8
  's': () => '8', 'z': () => '8',
  
  // C -> complex rules
  'c': (prev, next) => {
    if (prev === null) {
      // At beginning: C + AHKLOQRUX -> 4, else -> 8
      return isInSet(next, LETTER_SETS.AHKLOQRUX) ? '4' : '8';
    }
    // Not at beginning: C + AHKOQUX and prev not S,Z -> 4, else -> 8
    return isInSet(next, LETTER_SETS.AHKOQUX) && isNotInSet(prev, LETTER_SETS.SZ) ? '4' : '8';
  },
  
  // X -> 48 if prev not C,K,Q, else -> 8
  'x': (prev) => isNotInSet(prev, LETTER_SETS.CKQ) ? '48' : '8'
};

/**
 * Preprocesses a word by normalizing umlauts and converting to lowercase
 */
function preprocessWord(word: string): string {
  if (!word || typeof word !== 'string') {
    return '';
  }
  
  let result = word.toLowerCase();
  
  // Replace umlauts
  for (const [umlaut, replacement] of Object.entries(UMLAUT_MAP)) {
    result = result.replaceAll(umlaut, replacement);
  }
  
  return result;
}

/**
 * Converts a preprocessed word to its phonetic code
 */
function parseWord(word: string): string {
  if (!word) return '';
  
  let phoneticCode = '';
  
  for (let i = 0; i < word.length; i++) {
    const letter = word[i];
    const prevLetter = i > 0 ? word[i - 1] : null;
    const nextLetter = i < word.length - 1 ? word[i + 1] : null;
    
    const rule = PHONETIC_RULES[letter];
    if (rule) {
      phoneticCode += rule(prevLetter, nextLetter);
    }
    // Unknown letters are ignored (like original)
  }
  
  return postProcessPhoneticCode(phoneticCode);
}

/**
 * Post-processes the phonetic code by removing duplicates and non-leading zeros
 */
function postProcessPhoneticCode(code: string): string {
  if (!code) return '';
  
  // Remove consecutive duplicate digits
  let result = code.replace(/(.)\1+/g, '$1');
  
  // Remove zeros except at the beginning
  if (result.length > 1) {
    const firstChar = result[0];
    const rest = result.slice(1).replace(/0/g, '');
    result = firstChar + rest;
  }
  
  return result;
}

/**
 * Main function: Converts German text to Cologne Phonetic codes
 * @param phrase - Input text (can contain multiple words)
 * @returns Phonetic code string
 */
export function colognePhonetic(phrase: string): string {
  if (!phrase || typeof phrase !== 'string') {
    return '';
  }
  
  return phrase
    .trim()
    .split(/\s+/)
    .filter(word => word.length > 0)
    .map(word => parseWord(preprocessWord(word)))
    .join('');
}

// Export helper functions for testing
export const testHelpers = {
  preprocessWord,
  parseWord,
  postProcessPhoneticCode,
  LETTER_SETS,
  PHONETIC_RULES
};

// Example usage and test cases
if (typeof window !== 'undefined') {
  console.log('=== Cologne Phonetic Examples with Animals ===');
  
  const testCases = [
    'Bär',
    'Baer', 
    'Hund',
    'Katze',
    'Maus',
    'Vogel',
    'Pferd',
    'Fuchs',
    'Wolf',
    'Hase',
    'Tiger',
    'Löwe',
    'Elefant',
    'Giraffe'
  ];
  
  testCases.forEach(animal => {
    console.log(`${animal.padEnd(12)} -> ${colognePhonetic(animal)}`);
  });
  
  // Test similar sounding animals
  console.log('\n=== Similar Animal Names Test ===');
  const similarPairs = [
    ['Bär', 'Baer'],
    ['Mäuse', 'Maeuse'], 
    ['Küken', 'Kueken'],
    ['Fuchs', 'Vuchs']
  ];
  
  similarPairs.forEach(group => {
    const codes = group.map(name => colognePhonetic(name));
    const allSame = codes.every(code => code === codes[0]);
    console.log(`${group.join(', ')} -> ${codes.join(', ')} ${allSame ? '✓' : '✗'}`);
  });
}