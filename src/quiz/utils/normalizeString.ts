export function normalizeString(input: string): string {
  return input
    .normalize('NFD')                    // Akzente aufteilen
    .replace(/[\u0300-\u036f]/g, '')     // Akzente entfernen
    .toLowerCase()                       // Kleinbuchstaben
    .replace(/[^a-z0-9\s-]/g, '')       // Nur erlaubte Zeichen
    .trim()                             // Leerzeichen trimmen
    .replace(/\s+/g, '-')               // Leerzeichen zu Bindestrichen
    .replace(/-+/g, '-')                // Mehrfache Bindestriche entfernen
    .replace(/^-|-$/g, '');             // Bindestriche an Rändern entfernen
}