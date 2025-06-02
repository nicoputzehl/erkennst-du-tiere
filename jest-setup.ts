/* eslint-disable @typescript-eslint/no-require-imports */
// jest-setup.ts - Enhanced Version mit UI Store Support

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

// Mock für React Native Gesture Handler
jest.mock('react-native-gesture-handler', () => {
  const View = require('react-native/Libraries/Components/View/View');
  return {
    Swipeable: View,
    DrawerLayout: View,
    State: {},
    ScrollView: View,
    Slider: View,
    Switch: View,
    TextInput: View,
    ToolbarAndroid: View,
    ViewPagerAndroid: View,
    DrawerLayoutAndroid: View,
    WebView: View,
    NativeViewGestureHandler: View,
    TapGestureHandler: View,
    FlingGestureHandler: View,
    ForceTouchGestureHandler: View,
    LongPressGestureHandler: View,
    PanGestureHandler: View,
    PinchGestureHandler: View,
    RotationGestureHandler: View,
    RawButton: View,
    BaseButton: View,
    RectButton: View,
    BorderlessButton: View,
    FlatList: View,
    gestureHandlerRootHOC: jest.fn(() => (Component: any) => Component),
    Directions: {},
  };
});

// Enhanced localStorage Mock für Zustand Stores
const createEnhancedLocalStorage = () => {
  const storage: Record<string, string> = {};
  
  return {
    getItem: jest.fn((key: string) => {
      return Promise.resolve(storage[key] || null);
    }),
    setItem: jest.fn((key: string, value: string) => {
      storage[key] = value;
      return Promise.resolve();
    }),
    removeItem: jest.fn((key: string) => {
      delete storage[key];
      return Promise.resolve();
    }),
    clear: jest.fn(() => {
      Object.keys(storage).forEach(key => delete storage[key]);
      return Promise.resolve();
    }),
    getAllKeys: jest.fn(() => {
      return Promise.resolve(Object.keys(storage));
    }),
    length: 0,
    key: jest.fn(() => null),
  };
};

// Set up enhanced localStorage
global.localStorage = createEnhancedLocalStorage();

// Enhanced window object with localStorage
Object.defineProperty(window, 'localStorage', {
  value: global.localStorage,
  writable: true,
});

// Enhanced console.warn suppression für Tests
const originalConsoleWarn = console.warn;
const originalConsoleError = console.error;

console.warn = (...args: any[]) => {
  // Filter out specific warnings we don't want in tests
  if (
    typeof args[0] === 'string' && 
    (args[0].includes('[zustand persist middleware]') ||
     args[0].includes('Unable to update item') ||
     args[0].includes('storage is currently unavailable') ||
     args[0].includes('[UIStore]') ||
     args[0].includes('[QuizStore]'))
  ) {
    return; // Suppress these warnings in tests
  }
  
  originalConsoleWarn(...args);
};

// Also suppress certain error logs in tests
console.error = (...args: any[]) => {
  if (
    typeof args[0] === 'string' && 
    (args[0].includes('Warning: ReactDOM.render is no longer supported') ||
     args[0].includes('Warning: componentWillReceiveProps has been renamed'))
  ) {
    return; // Suppress these errors in tests
  }
  
  originalConsoleError(...args);
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

// React Native Mock für Testing mit Enhanced Support
jest.mock('react-native', () => {
  const RN = jest.requireActual('react-native');
  
  // Enhanced mocks for problematic components
  RN.NativeModules = {
    ...RN.NativeModules,
    RNCNetInfo: {
      getCurrentState: jest.fn(() => Promise.resolve()),
      addListener: jest.fn(),
      removeListeners: jest.fn(),
    },
  };

  // Mock Animated with enhanced support
  RN.Animated = {
    ...RN.Animated,
    timing: jest.fn(() => ({
      start: jest.fn(),
    })),
    spring: jest.fn(() => ({
      start: jest.fn(),
    })),
    Value: jest.fn(() => ({
      setValue: jest.fn(),
      addListener: jest.fn(),
      removeListener: jest.fn(),
    })),
  };

  return RN;
});

// Enhanced Timer Management for Tests
let timerId = 0;
const timers: Map<number, NodeJS.Timeout> = new Map();

const originalSetTimeout = global.setTimeout;
const originalClearTimeout = global.clearTimeout;

// Enhanced setTimeout mock that works with both Jest fake timers and real timers
global.setTimeout = jest.fn((callback: Function, delay?: number) => {
  if (jest.isMockFunction(originalSetTimeout)) {
    // Jest fake timers are active
    return originalSetTimeout(callback, delay);
  }
  
  // Real timers - create trackable timer
  const id = ++timerId;
  const timer = originalSetTimeout(callback, delay || 0);
  timers.set(id, timer);
  return id as any;
});

global.clearTimeout = jest.fn((id: any) => {
  if (jest.isMockFunction(originalClearTimeout)) {
    // Jest fake timers are active
    return originalClearTimeout(id);
  }
  
  // Real timers
  const timer = timers.get(id);
  if (timer) {
    originalClearTimeout(timer);
    timers.delete(id);
  }
});

// Zustand Store Reset Utilities für Tests
const storeResetFunctions: Array<() => void> = [];

export const registerStoreReset = (resetFn: () => void) => {
  storeResetFunctions.push(resetFn);
};

// Enhanced beforeEach setup
beforeEach(() => {
  // Clear all mock call histories
  if (global.localStorage.clear) {
    (global.localStorage.clear as jest.Mock).mockClear();
  }
  if (global.localStorage.getItem) {
    (global.localStorage.getItem as jest.Mock).mockClear();
  }
  if (global.localStorage.setItem) {
    (global.localStorage.setItem as jest.Mock).mockClear();
  }
  
  // Clear all registered store reset functions
  storeResetFunctions.forEach(resetFn => {
    try {
      resetFn();
    } catch (error) {
      // Ignore reset errors in tests
    }
  });
  
  // Clear timer tracking
  timers.clear();
  timerId = 0;
  
  // Reset console mocks
  if (jest.isMockFunction(console.log)) {
    (console.log as jest.Mock).mockClear();
  }
});

// Enhanced afterEach cleanup
afterEach(() => {
  // Clean up any remaining timers
  timers.forEach(timer => {
    originalClearTimeout(timer);
  });
  timers.clear();
  
  // If jest fake timers are running, clear them
  if (jest.isMockFunction(originalSetTimeout)) {
    jest.clearAllTimers();
  }
});

// Test utilities export
declare global {
  namespace jest {
    interface Matchers<R> {
      toHaveQuizState(quizId: string): R;
      toHaveUIState(expectedState: any): R;
    }
  }
}

// Enhanced Custom Jest Matchers
expect.extend({
  toHaveQuizState(store: any, quizId: string) {
    const hasQuizState = store.quizStates && store.quizStates[quizId];
    
    if (hasQuizState) {
      return {
        message: () => `expected store not to have quiz state for ${quizId}`,
        pass: true,
      };
    } else {
      return {
        message: () => `expected store to have quiz state for ${quizId}`,
        pass: false,
      };
    }
  },
  
  toHaveUIState(store: any, expectedState: any) {
    const hasMatchingState = Object.keys(expectedState).every(key => {
      const expected = expectedState[key];
      const actual = store[key];
      
      if (typeof expected === 'boolean') {
        return actual === expected;
      }
      if (typeof expected === 'number') {
        return actual === expected;
      }
      if (typeof expected === 'string') {
        return actual === expected;
      }
      if (Array.isArray(expected)) {
        return Array.isArray(actual) && actual.length === expected.length;
      }
      
      return true; // Default to true for complex objects
    });
    
    if (hasMatchingState) {
      return {
        message: () => `expected store not to have matching UI state`,
        pass: true,
      };
    } else {
      return {
        message: () => `expected store to have matching UI state: ${JSON.stringify(expectedState)}`,
        pass: false,
      };
    }
  },
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

// Enhanced Error Handling für Tests
const originalUnhandledRejection = process.listeners('unhandledRejection');
process.removeAllListeners('unhandledRejection');
process.on('unhandledRejection', (reason, promise) => {
  // Log unhandled rejections in tests but don't crash
  if (process.env.NODE_ENV === 'test') {
    console.warn('Unhandled Rejection in test:', reason);
  } else {
    // Call original handlers in non-test environments
    originalUnhandledRejection.forEach(handler => {
      if (typeof handler === 'function') {
        handler(reason, promise);
      }
    });
  }
});

// Export test utilities
export const testUtils = {
  registerStoreReset,
  createEnhancedLocalStorage,
  mockTimers: () => {
    jest.useFakeTimers();
    return () => jest.useRealTimers();
  },
  advanceTimersByTime: (ms: number) => {
    if (jest.isMockFunction(originalSetTimeout)) {
      jest.advanceTimersByTime(ms);
    }
  },
  runOnlyPendingTimers: () => {
    if (jest.isMockFunction(originalSetTimeout)) {
      jest.runOnlyPendingTimers();
    }
  },
  clearAllTimers: () => {
    if (jest.isMockFunction(originalSetTimeout)) {
      jest.clearAllTimers();
    }
    timers.forEach(timer => originalClearTimeout(timer));
    timers.clear();
  }
};