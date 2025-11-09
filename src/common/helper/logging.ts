const LOGGING_ENABLED = process.env.EXPO_PUBLIC_LOGGING_ENABLED === 'true';

/**
 * @typedef {'log' | 'warn' | 'error' | 'info' | 'debug'} LogType
 * @typedef {{ type?: LogType }} LogOptions
 */
// Exportiere die Typen, wenn du sie anderswo benötigst
export type LogType = 'log' | 'warn' | 'error' | 'info' | 'debug';
export type LogOptions = { type?: LogType };


// 3. KORRIGIERTE LOGGING-FUNKTION
/**
 * Eine Wrapper-Funktion für console.log, die nur dann loggt, wenn LOGGING_ENABLED=true gesetzt ist.
 *
 * @param {any} message - Die erste Nachricht oder das erste Objekt.
 * @param {...any} optionalParams - Zusätzliche Parameter (wie bei console.log).
 * @param {LogOptions} [options] - Optionales Objekt mit dem Log-Typ ({type: 'warn'}).
 */
export const log = (message: any, ...optionalParams: any[]) => {
  console.warn('LOGGING_ENABLED', LOGGING_ENABLED);
  if (!LOGGING_ENABLED) {
    return;
  }

  let logOptions: LogOptions = {};
  const paramsToLog = [message, ...optionalParams];
  
  const lastParam = paramsToLog[paramsToLog.length - 1];

  if (
    typeof lastParam === 'object' &&
    lastParam !== null &&
    (lastParam.type === 'warn' || lastParam.type === 'error' || lastParam.type === 'info' || lastParam.type === 'debug')
  ) {
    logOptions = lastParam;
    paramsToLog.pop();
  }

  const type = logOptions.type || 'log'; 
  const consoleMethod = console[type as LogType] || console.log;

  if (type === 'log' || type === 'debug') {
      paramsToLog.unshift('[DEBUG_LOG]');
  }

  consoleMethod(...paramsToLog);
};

export const logWarn = (...args: [any, any, any]) => log(...args, { type: 'warn' });
export const logError = (...args: [any, any, any]) => log(...args, { type: 'error' });
export const logDebug = (...args: [any, any, any]) => log(...args, { type: 'debug' });