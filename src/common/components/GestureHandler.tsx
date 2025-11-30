import { type PropsWithChildren, useRef } from "react";
import { View, PanResponder } from "react-native";

interface GestureHandlerProps extends PropsWithChildren {
  // optionale Handler ohne Parameter
  onSwipeLeft?: () => void;
  onSwipeRight?: () => void;
  onSwipeUp?: () => void;
  onSwipeDown?: () => void;

  // optionale Schwellwerte
  dxThreshold?: number;
  dyThreshold?: number;

  // individuelle Schwellwerte pro Richtung
  leftThreshold?: number;
  rightThreshold?: number;
  upThreshold?: number;
  downThreshold?: number;
}

export const GestureHandler = ({
  children,
  onSwipeLeft,
  onSwipeRight,
  onSwipeUp,
  onSwipeDown,
  dxThreshold = 20,
  dyThreshold = 20,
  leftThreshold,
  rightThreshold,
  upThreshold,
  downThreshold,
}: GestureHandlerProps) => {
  const panResponder = useRef(
    PanResponder.create({
      onMoveShouldSetPanResponder: (_, gestureState) => {
        return (
          Math.abs(gestureState.dx) > dxThreshold ||
          Math.abs(gestureState.dy) > dyThreshold
        );
      },
      onPanResponderRelease: (_, gestureState) => {
        const { dx, dy } = gestureState;

        if (Math.abs(dx) > Math.abs(dy)) {
          if (dx > 0) {
            const threshold = rightThreshold ?? dxThreshold;
            if (Math.abs(dx) > threshold) {
              onSwipeRight?.();
            }
          } else {
            const threshold = leftThreshold ?? dxThreshold;
            if (Math.abs(dx) > threshold) {
              onSwipeLeft?.();
            }
          }
        } else {
          if (dy > 0) {
            const threshold = downThreshold ?? dyThreshold;
            if (Math.abs(dy) > threshold) {
              onSwipeDown?.();
            }
          } else {
            const threshold = upThreshold ?? dyThreshold;
            if (Math.abs(dy) > threshold) {
              onSwipeUp?.();
            }
          }
        }
      },
    })
  ).current;

  return (
    <View style={{ flex: 1 }} {...panResponder.panHandlers}>
      {children}
    </View>
  );
};
