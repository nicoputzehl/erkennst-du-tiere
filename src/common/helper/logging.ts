export type LogType = 'log' | 'warn' | 'error' | 'info' | 'debug';
export type LogOptions = { type?: LogType };

// 1. Prioritäten festlegen (niedriger = kritischer)
const LOG_LEVELS: Record<LogType, number> = {
  error: 0,
  warn: 1,
  info: 2,
  log: 3,
  debug: 4,
};

// 2. Bestimme das aktuelle Level
// Wenn __DEV__ wahr ist, nutzen wir 'debug' als Fallback, sonst 'none'
const DEFAULT_LEVEL = __DEV__ ? 'debug' : 'none';
const CURRENT_LOG_LEVEL_NAME = (process.env.EXPO_PUBLIC_LOG_LEVEL || DEFAULT_LEVEL) as LogType | 'none';

// 3. Emojis für bessere Sichtbarkeit
const LOG_PREFIXES: Record<LogType, string> = {
  error: '🔴 [ERROR]',
  warn: '🟠 [WARN]',
  info: '🔵 [INFO]',
  log: '⚪ [LOG]',
  debug: '🟢 [DEBUG]',
};

/**
 * Zentrale Logging-Funktion
 */
export const log = (...args: any[]) => {
  const paramsToLog = [...args];
  let logOptions: LogOptions = {};

  // Extrahiere Optionen (z.B. { type: 'warn' }), falls als letztes Argument übergeben
  const lastParam = paramsToLog[paramsToLog.length - 1];
  const isOptionObject = 
    lastParam && 
    typeof lastParam === 'object' && 
    ['log', 'warn', 'error', 'info', 'debug'].includes(lastParam.type);

  if (isOptionObject) {
    logOptions = paramsToLog.pop();
  }

  const type = logOptions.type || 'log';

  // --- LOG-LEVEL PRÜFUNG ---
  if (CURRENT_LOG_LEVEL_NAME === 'none') return;
  
  const currentPriority = LOG_LEVELS[CURRENT_LOG_LEVEL_NAME as LogType] ?? -1;
  const messagePriority = LOG_LEVELS[type];

  if (messagePriority > currentPriority) return;
  // -------------------------

  // Die passende Konsolen-Methode wählen
  const consoleMethod = (console[type as LogType] || console.log) as (...args: any[]) => void;

  // Prefix hinzufügen (z.B. 🔴 [ERROR])
  paramsToLog.unshift(LOG_PREFIXES[type]);

  consoleMethod(...paramsToLog);
};

// Komfort-Funktionen
export const logWarn = (...args: any[]) => log(...args, { type: 'warn' });
export const logError = (...args: any[]) => log(...args, { type: 'error' });
export const logDebug = (...args: any[]) => log(...args, { type: 'debug' });
export const logInfo = (...args: any[]) => log(...args, { type: 'info' });