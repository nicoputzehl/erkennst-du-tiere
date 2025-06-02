/* eslint-disable @typescript-eslint/no-require-imports */
// jest-setup.ts - Vereinfachte Version für Store Migration

// Mock für AsyncStorage
jest.mock('@react-native-async-storage/async-storage', () =>
  require('@react-native-async-storage/async-storage/jest/async-storage-mock')
);

// Mock für React Native Reanimated
jest.mock('react-native-reanimated', () => {
  const Reanimated = require('react-native-reanimated/mock');
  Reanimated.default.call = () => {};
  return Reanimated;
});

// Mock für Expo modules
jest.mock('expo-constants', () => ({
  default: {
    manifest: {}
  }
}));

// Enhanced localStorage Mock für Zustand Stores
const createEnhancedLocalStorage = (): Storage => {
  const storage: Record<string, string> = {};
  
  return {
    getItem: jest.fn((key: string): string | null => {
      return storage[key] || null;
    }) as jest.MockedFunction<(key: string) => string | null>,
    
    setItem: jest.fn((key: string, value: string): void => {
      storage[key] = value;
    }) as jest.MockedFunction<(key: string, value: string) => void>,
    
    removeItem: jest.fn((key: string): void => {
      delete storage[key];
    }) as jest.MockedFunction<(key: string) => void>,
    
    clear: jest.fn((): void => {
      Object.keys(storage).forEach(key => delete storage[key]);
    }) as jest.MockedFunction<() => void>,
    
    length: 0,
    key: jest.fn((index: number): string | null => {
      const keys = Object.keys(storage);
      return keys[index] || null;
    }) as jest.MockedFunction<(index: number) => string | null>,
  };
};

// Set up enhanced localStorage
global.localStorage = createEnhancedLocalStorage();

// Enhanced window object with localStorage
Object.defineProperty(window, 'localStorage', {
  value: global.localStorage,
  writable: true,
});

// Simplified console.warn suppression für Tests
const originalConsoleWarn = console.warn;

console.warn = (...args: unknown[]) => {
  // Filter out zustand/storage warnings in tests
  if (
    typeof args[0] === 'string' && 
    (args[0].includes('[zustand persist middleware]') ||
     args[0].includes('Unable to update item') ||
     args[0].includes('storage is currently unavailable'))
  ) {
    return; // Suppress these warnings in tests
  }
  
  originalConsoleWarn(...args);
};

// Set test environment flag
if (process.env) {
  Object.defineProperty(process.env, 'NODE_ENV', {
    value: 'test',
    writable: false,
    configurable: true
  });
}

// Global test flags
(global as any).__DEV__ = false; // Disable dev logs in tests
(global as any).__TEST__ = true; // Test flag

// React Native Mock für Testing - Minimal Version
jest.mock('react-native', () => {
  const RN = jest.requireActual('react-native');
  
  // Basic mocks for problematic components
  RN.NativeModules = {
    ...RN.NativeModules,
  };

  return RN;
});

// Enhanced Timer Management für Tests - Fixed
const originalSetTimeout = global.setTimeout;
const originalClearTimeout = global.clearTimeout;

global.setTimeout = jest.fn((callback: (...args: unknown[]) => void, delay?: number): any => {
  return originalSetTimeout(callback, delay || 0);
}) as any;

global.clearTimeout = jest.fn((id: any): void => {
  originalClearTimeout(id);
}) as any;

// Cleanup zwischen Tests
beforeEach(() => {
  // Clear localStorage mocks
  if (global.localStorage.clear) {
    (global.localStorage.clear as jest.Mock).mockClear();
  }
  if (global.localStorage.getItem) {
    (global.localStorage.getItem as jest.Mock).mockClear();
  }
  if (global.localStorage.setItem) {
    (global.localStorage.setItem as jest.Mock).mockClear();
  }
});

// Enhanced Mock für fetch (falls benötigt)
global.fetch = jest.fn(() =>
  Promise.resolve({
    ok: true,
    status: 200,
    json: () => Promise.resolve({}),
    text: () => Promise.resolve(''),
  })
) as jest.Mock;

// Export test utilities - Minimal Version
export const testUtils = {
  mockTimers: () => {
    jest.useFakeTimers();
    return () => jest.useRealTimers();
  },
  advanceTimersByTime: (ms: number) => {
    if (jest.isMockFunction(setTimeout)) {
      jest.advanceTimersByTime(ms);
    }
  },
};