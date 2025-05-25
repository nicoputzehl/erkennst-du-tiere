import { useState, useEffect, useRef } from 'react';
import { Keyboard, Animated, Dimensions, Platform } from 'react-native';

interface KeyboardResponsiveConfig {
  defaultImageHeight?: number;
  minImageHeight?: number;
  maxImageHeight?: number;
  animationDuration?: {
    ios?: number;
    android?: number;
  };
  bufferHeight?: number;
  imageHeightRatio?: number; // Prozent der verfügbaren Höhe für das Bild
  disableFirstAnimationDelay?: boolean; // Verhindert Delay bei erster Animation
  useNativeKeyboardAnimation?: boolean; // Nutzt native Keyboard-Animation
}

interface UseKeyboardResponsiveReturn {
  keyboardHeight: number;
  isKeyboardVisible: boolean;
  imageHeight: Animated.Value;
  contentPadding: Animated.Value;
  availableContentHeight: number;
  isFirstKeyboardShow: boolean; // Track ob es die erste Keyboard-Anzeige ist
}

const defaultConfig: Required<KeyboardResponsiveConfig> = {
  defaultImageHeight: 400,
  minImageHeight: 180,
  maxImageHeight: 300,
  animationDuration: {
    ios: 250,
    android: 200,
  },
  bufferHeight: 100,
  imageHeightRatio: 0.4,
  disableFirstAnimationDelay: true,
  useNativeKeyboardAnimation: Platform.OS === 'ios',
};

export const useKeyboardResponsive = (
  config: KeyboardResponsiveConfig = {}
): UseKeyboardResponsiveReturn => {
  const mergedConfig = { ...defaultConfig, ...config };
  const {
    defaultImageHeight,
    minImageHeight,
    maxImageHeight,
    animationDuration,
    bufferHeight,
    imageHeightRatio,
    disableFirstAnimationDelay,
    useNativeKeyboardAnimation,
  } = mergedConfig;

  const [keyboardHeight, setKeyboardHeight] = useState(0);
  const [isKeyboardVisible, setIsKeyboardVisible] = useState(false);
  const [isFirstKeyboardShow, setIsFirstKeyboardShow] = useState(true);
  
  const imageHeight = useRef(new Animated.Value(defaultImageHeight)).current;
  const contentPadding = useRef(new Animated.Value(16)).current;
  
  const { height: screenHeight } = Dimensions.get('window');

  useEffect(() => {
    // Verwende verschiedene Events je nach Konfiguration
    const showEvent = useNativeKeyboardAnimation && Platform.OS === 'ios' 
      ? 'keyboardWillShow' 
      : 'keyboardDidShow';
    const hideEvent = useNativeKeyboardAnimation && Platform.OS === 'ios' 
      ? 'keyboardWillHide' 
      : 'keyboardDidHide';

    const showSubscription = Keyboard.addListener(showEvent, (event) => {
      const { height } = event.endCoordinates;
      setKeyboardHeight(height);
      setIsKeyboardVisible(true);
      
      // Berechne neue Bild-Höhe basierend auf verfügbarem Platz
      const availableHeight = screenHeight - height - bufferHeight;
      const calculatedImageHeight = availableHeight * imageHeightRatio;
      const newImageHeight = Math.max(
        minImageHeight, 
        Math.min(maxImageHeight, calculatedImageHeight)
      );
      
      // Angepasste Animationsdauer für erste Anzeige
      let duration = animationDuration[Platform.OS as keyof typeof animationDuration];
      if (isFirstKeyboardShow && disableFirstAnimationDelay) {
        duration = Platform.OS === 'ios' ? 200 : 150; // Schnellere erste Animation
      }
      
      const animationConfig = {
        toValue: newImageHeight,
        duration,
        useNativeDriver: false,
        ...(useNativeKeyboardAnimation && Platform.OS === 'ios' && {
          // Nutze Keyboard-Event-Duration wenn verfügbar
          duration: event.duration || duration,
        }),
      };
      
      const paddingConfig = {
        toValue: 8,
        duration,
        useNativeDriver: false,
        ...(useNativeKeyboardAnimation && Platform.OS === 'ios' && {
          duration: event.duration || duration,
        }),
      };
      
      Animated.parallel([
        Animated.timing(imageHeight, animationConfig),
        Animated.timing(contentPadding, paddingConfig)
      ]).start(() => {
        if (isFirstKeyboardShow) {
          setIsFirstKeyboardShow(false);
        }
      });
    });

    const hideSubscription = Keyboard.addListener(hideEvent, (event) => {
      setKeyboardHeight(0);
      setIsKeyboardVisible(false);
      
      let duration = animationDuration[Platform.OS as keyof typeof animationDuration];
      
      const animationConfig = {
        toValue: defaultImageHeight,
        duration,
        useNativeDriver: false,
        ...(useNativeKeyboardAnimation && Platform.OS === 'ios' && {
          duration: event?.duration || duration,
        }),
      };
      
      const paddingConfig = {
        toValue: 16,
        duration,
        useNativeDriver: false,
        ...(useNativeKeyboardAnimation && Platform.OS === 'ios' && {
          duration: event?.duration || duration,
        }),
      };
      
      Animated.parallel([
        Animated.timing(imageHeight, animationConfig),
        Animated.timing(contentPadding, paddingConfig)
      ]).start();
    });

    return () => {
      showSubscription?.remove();
      hideSubscription?.remove();
    };
  }, [
    imageHeight,
    contentPadding,
    screenHeight,
    defaultImageHeight,
    minImageHeight,
    maxImageHeight,
    animationDuration,
    bufferHeight,
    imageHeightRatio,
    isFirstKeyboardShow,
    disableFirstAnimationDelay,
    useNativeKeyboardAnimation,
  ]);

  // Berechne verfügbare Höhe für Content
  const availableContentHeight = isKeyboardVisible 
    ? screenHeight - keyboardHeight - 50
    : screenHeight;

  return {
    keyboardHeight,
    isKeyboardVisible,
    imageHeight,
    contentPadding,
    availableContentHeight,
    isFirstKeyboardShow,
  };
};