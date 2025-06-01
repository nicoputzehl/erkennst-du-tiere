/* eslint-disable @typescript-eslint/no-require-imports */
// jest-setup.ts - Erweiterte Version

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

// Mock für Zustand Persist - WICHTIG für Store Tests
global.localStorage = {
  getItem: jest.fn(() => null),
  setItem: jest.fn(),
  removeItem: jest.fn(),
  clear: jest.fn(),
  length: 0,
  key: jest.fn(() => null),
};

// Mock für window object mit localStorage
Object.defineProperty(window, 'localStorage', {
  value: global.localStorage,
  writable: true,
});

// Suppress Zustand persist warnings in tests
const originalConsoleWarn = console.warn;
console.warn = (...args: any[]) => {
  // Filter out specific Zustand persist warnings
  if (
    typeof args[0] === 'string' && 
    (args[0].includes('[zustand persist middleware]') ||
     args[0].includes('Unable to update item') ||
     args[0].includes('storage is currently unavailable'))
  ) {
    return; // Suppress these warnings in tests
  }
  
  // Call original console.warn for other warnings
  originalConsoleWarn(...args);
};

// Set test environment flag (if possible)
if (process.env) {
  Object.defineProperty(process.env, 'NODE_ENV', {
    value: 'test',
    writable: false,
    configurable: true
  });
}

// Globale Mocks
(global as any).__DEV__ = false; // Disable dev logs in tests

// React Native Mock für Testing
jest.mock('react-native', () => {
  const RN = jest.requireActual('react-native');
  
  // Mock für problematische Komponenten
  RN.NativeModules = {
    ...RN.NativeModules,
    RNCNetInfo: {
      getCurrentState: jest.fn(() => Promise.resolve()),
      addListener: jest.fn(),
      removeListeners: jest.fn(),
    },
  };

  return RN;
});

// Zustand Store Reset Utility für Tests
beforeEach(() => {
  // Clear localStorage mock calls
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

// Test utilities export
declare global {
  namespace jest {
    interface Matchers<R> {
      toHaveQuizState(quizId: string): R;
    }
  }
}

// Custom Jest Matchers für Store Testing
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
});