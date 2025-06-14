// hooks/usePulsingAnimation.ts
import { useSharedValue, useAnimatedStyle, withSequence, withRepeat, withTiming } from 'react-native-reanimated';
import { useEffect } from 'react';

export const usePulsingAnimation = (isEnabled: boolean) => {
  const pulsState = useSharedValue(1);

  useEffect(() => {
    if (isEnabled) {
      const timer = setTimeout(() => {
        pulsState.value = withRepeat(
          withSequence(
            withTiming(1.01, { duration: 750 }),
            withTiming(0.99, { duration: 750 }),
          ),
          -1,
          true,
        );
      }, 150);
      return () => clearTimeout(timer);
    }
    pulsState.value = 1;

  }, [isEnabled, pulsState]);

  const animatedStyle = useAnimatedStyle(() => {
    return {
      transform: [{ scale: pulsState.value }],
    };
  });

  return { animatedStyle };
};
