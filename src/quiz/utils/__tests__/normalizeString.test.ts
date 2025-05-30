import { normalizeString } from "../normalizeString";

describe('normalizeString', () => {

  describe('Basic functionality', () => {
    test('should handle simple strings', () => {
      expect(normalizeString('hello')).toBe('hello');
      expect(normalizeString('world')).toBe('world');
      expect(normalizeString('test123')).toBe('test123');
    }); // ← Diese Klammer fehlte!

    test('should convert to lowercase', () => {
      expect(normalizeString('HELLO')).toBe('hello');
      expect(normalizeString('Hello World')).toBe('hello-world');
      expect(normalizeString('MiXeD cAsE')).toBe('mixed-case');
    });

    test('should handle numbers', () => {
      expect(normalizeString('123')).toBe('123');
      expect(normalizeString('test123')).toBe('test123');
      expect(normalizeString('12 34 56')).toBe('12-34-56');
    });
  });

  describe('Accent removal (NFD normalization)', () => {
    test('should remove accents from vowels', () => {
      expect(normalizeString('café')).toBe('cafe');
      expect(normalizeString('naïve')).toBe('naive');
      expect(normalizeString('résumé')).toBe('resume');
      expect(normalizeString('piñata')).toBe('pinata');
    });

    test('should handle German umlauts', () => {
      expect(normalizeString('Müller')).toBe('muller');
      expect(normalizeString('Björk')).toBe('bjork');
      expect(normalizeString('Zürich')).toBe('zurich');
    });

    test('should handle various European accents', () => {
      expect(normalizeString('François')).toBe('francois');
      expect(normalizeString('José')).toBe('jose');
      expect(normalizeString('Åse')).toBe('ase');
      expect(normalizeString('Søren')).toBe('sren'); // ø wird komplett entfernt, da es kein NFD-zerlegbares Zeichen ist
    });

    test('should handle combined accents', () => {
      expect(normalizeString('Café Français')).toBe('cafe-francais');
      expect(normalizeString('Résumé Naïve')).toBe('resume-naive');
      expect(normalizeString('Åse Øyvind')).toBe('ase-yvind'); // ø wird entfernt
    });
  });

  describe('Special character removal', () => {
    test('should remove punctuation', () => {
      expect(normalizeString('hello!')).toBe('hello');
      expect(normalizeString('what?')).toBe('what');
      expect(normalizeString('yes/no')).toBe('yesno');
      expect(normalizeString('one.two')).toBe('onetwo');
    });

    test('should remove symbols', () => {
      expect(normalizeString('@user')).toBe('user');
      expect(normalizeString('#hashtag')).toBe('hashtag');
      expect(normalizeString('50%')).toBe('50');
      expect(normalizeString('$100')).toBe('100');
    });

    test('should remove quotes and brackets', () => {
      expect(normalizeString('"quoted"')).toBe('quoted');
      expect(normalizeString("'single'")).toBe('single');
      expect(normalizeString('(parentheses)')).toBe('parentheses');
      expect(normalizeString('[brackets]')).toBe('brackets');
      expect(normalizeString('{braces}')).toBe('braces');
    });

    test('should keep allowed characters (a-z, 0-9, spaces, hyphens)', () => {
      expect(normalizeString('hello-world')).toBe('hello-world');
      expect(normalizeString('test 123')).toBe('test-123');
      expect(normalizeString('a-b-c')).toBe('a-b-c');
    });
  });

  describe('Whitespace handling', () => {
    test('should trim leading and trailing spaces', () => {
      expect(normalizeString('  hello  ')).toBe('hello');
      expect(normalizeString('\thello\t')).toBe('hello');
      expect(normalizeString('\nhello\n')).toBe('hello');
    });

    test('should convert spaces to hyphens', () => {
      expect(normalizeString('hello world')).toBe('hello-world');
      expect(normalizeString('one two three')).toBe('one-two-three');
      expect(normalizeString('a b c d')).toBe('a-b-c-d');
    });

    test('should handle multiple spaces', () => {
      expect(normalizeString('hello    world')).toBe('hello-world');
      expect(normalizeString('one  two   three')).toBe('one-two-three');
      expect(normalizeString('a     b')).toBe('a-b');
    });

    test('should handle various whitespace characters', () => {
      expect(normalizeString('hello\tworld')).toBe('hello-world');
      expect(normalizeString('hello\nworld')).toBe('hello-world');
      expect(normalizeString('hello\r\nworld')).toBe('hello-world');
    });
  });

  describe('Hyphen normalization', () => {
    test('should remove leading hyphens', () => {
      expect(normalizeString('-hello')).toBe('hello');
      expect(normalizeString('--hello')).toBe('hello');
      expect(normalizeString('---hello')).toBe('hello');
    });

    test('should remove trailing hyphens', () => {
      expect(normalizeString('hello-')).toBe('hello');
      expect(normalizeString('hello--')).toBe('hello');
      expect(normalizeString('hello---')).toBe('hello');
    });

    test('should remove leading and trailing hyphens', () => {
      expect(normalizeString('-hello-')).toBe('hello');
      expect(normalizeString('--hello--')).toBe('hello');
      expect(normalizeString('---hello---')).toBe('hello');
    });

    test('should collapse multiple internal hyphens', () => {
      expect(normalizeString('hello--world')).toBe('hello-world');
      expect(normalizeString('one---two')).toBe('one-two');
      expect(normalizeString('a----b----c')).toBe('a-b-c');
    });

    test('should preserve single internal hyphens', () => {
      expect(normalizeString('hello-world')).toBe('hello-world');
      expect(normalizeString('one-two-three')).toBe('one-two-three');
    });
  });

  describe('Complex combinations', () => {
    test('should handle multiple normalization steps', () => {
      expect(normalizeString('  Café François!  ')).toBe('cafe-francois');
      expect(normalizeString('--José María--')).toBe('jose-maria');
      expect(normalizeString('Müller & Schmidt')).toBe('muller-schmidt');
    });

    test('should handle mixed spaces and special characters', () => {
      expect(normalizeString('hello, world!')).toBe('hello-world');
      expect(normalizeString('one (1) two (2)')).toBe('one-1-two-2');
      expect(normalizeString('test@example.com')).toBe('testexamplecom');
    });

    test('should handle complex punctuation and spacing', () => {
      expect(normalizeString('Mr. John Smith, Jr.')).toBe('mr-john-smith-jr');
      expect(normalizeString('São Paulo, Brazil')).toBe('sao-paulo-brazil');
      expect(normalizeString('Côte d\'Ivoire')).toBe('cote-divoire');
    });
  });

  describe('Edge cases', () => {
    test('should handle empty string', () => {
      expect(normalizeString('')).toBe('');
    });

    test('should handle whitespace-only strings', () => {
      expect(normalizeString('   ')).toBe('');
      expect(normalizeString('\t\n\r')).toBe('');
    });

    test('should handle hyphen-only strings', () => {
      expect(normalizeString('-')).toBe('');
      expect(normalizeString('---')).toBe('');
      expect(normalizeString('- - -')).toBe('');
    });

    test('should handle special character-only strings', () => {
      expect(normalizeString('!!!')).toBe('');
      expect(normalizeString('@#$%')).toBe('');
      expect(normalizeString('()[]{}()')).toBe('');
    });

    test('should handle mixed edge cases', () => {
      expect(normalizeString('  ---  ')).toBe('');
      expect(normalizeString('- ! @ # -')).toBe('');
      expect(normalizeString('   !!!   ---   ')).toBe('');
    });
  });

  describe('Real-world examples', () => {
    test('should normalize names correctly', () => {
      expect(normalizeString('Jean-Claude Van Damme')).toBe('jean-claude-van-damme');
      expect(normalizeString('María José González')).toBe('maria-jose-gonzalez');
      expect(normalizeString('François Mitterrand')).toBe('francois-mitterrand');
    });

    test('should normalize place names', () => {
      expect(normalizeString('New York City')).toBe('new-york-city');
      expect(normalizeString('São Paulo')).toBe('sao-paulo');
      expect(normalizeString('Zürich, Switzerland')).toBe('zurich-switzerland');
    });

    test('should normalize titles and phrases', () => {
      expect(normalizeString('The Lord of the Rings')).toBe('the-lord-of-the-rings');
      expect(normalizeString('C\'est la vie!')).toBe('cest-la-vie');
      expect(normalizeString('Déjà vu')).toBe('deja-vu');
    });

    test('should normalize mixed language content', () => {
      expect(normalizeString('Café & Restaurant')).toBe('cafe-restaurant');
      expect(normalizeString('Hôtel des Invalides')).toBe('hotel-des-invalides');
      expect(normalizeString('Château de Versailles')).toBe('chateau-de-versailles');
    });
  });

  describe('Performance and stress tests', () => {
    test('should handle long strings efficiently', () => {
      const longString = 'Très long texte avec beaucoup d\'accents '.repeat(100);
      const startTime = Date.now();
      const result = normalizeString(longString);
      const endTime = Date.now();
      
      expect(result).toContain('tres-long-texte-avec-beaucoup-daccents');
      expect(endTime - startTime).toBeLessThan(100); // Should complete in under 100ms
    });

    test('should handle strings with many special characters', () => {
      const specialString = '!!!@@@###$$$%%%^^^&&&***((()))).'.repeat(50);
      expect(normalizeString(specialString)).toBe('');
    });

    test('should handle strings with many spaces', () => {
      const spacyString = '   a   b   c   '.repeat(50);
      const result = normalizeString(spacyString);
      expect(result).toMatch(/^a-b-c(-a-b-c)*$/);
    });
  });

  describe('Unicode characters that are not NFD-decomposable', () => {
    test('should handle Nordic characters', () => {
      expect(normalizeString('øl')).toBe('l'); // ø wird entfernt
      expect(normalizeString('æble')).toBe('ble'); // æ wird entfernt  
      expect(normalizeString('tłumacz')).toBe('tumacz'); // ł wird entfernt
    });

    test('should handle German ß', () => {
      expect(normalizeString('Straße')).toBe('strae'); // ß wird entfernt
      expect(normalizeString('weiß')).toBe('wei'); // ß wird entfernt
    });

    test('should handle other special Latin characters', () => {
      expect(normalizeString('piña')).toBe('pina'); 
      expect(normalizeString('Łódź')).toBe('odz'); 
    });
  });

  describe('Unicode and international characters', () => {
    test('should handle Cyrillic characters', () => {
      expect(normalizeString('Привет мир')).toBe('');  // Should remove non-Latin
    });

    test('should handle Chinese characters', () => {
      expect(normalizeString('你好世界')).toBe(''); // Should remove non-Latin
    });

    test('should handle Arabic characters', () => {
      expect(normalizeString('مرحبا بالعالم')).toBe(''); // Should remove non-Latin
    });

    test('should handle mixed Latin and non-Latin', () => {
      expect(normalizeString('hello 你好 world')).toBe('hello-world');
      expect(normalizeString('café الأحد')).toBe('cafe');
    });
  });

  describe('Regression tests', () => {
    test('should handle known problematic inputs', () => {
      expect(normalizeString('ñandú')).toBe('nandu');
      expect(normalizeString('Åre')).toBe('are');
      expect(normalizeString('jalapeño')).toBe('jalapeno');
    });

    test('should maintain idempotency', () => {
      const input = 'Café François!';
      const normalized = normalizeString(input);
      expect(normalizeString(normalized)).toBe(normalized);
    });

    test('should handle URL-like strings', () => {
      expect(normalizeString('https://example.com')).toBe('httpsexamplecom');
      expect(normalizeString('user@domain.com')).toBe('userdomaincom');
    });
  });
}); // ← Diese finale Klammer fehlte!