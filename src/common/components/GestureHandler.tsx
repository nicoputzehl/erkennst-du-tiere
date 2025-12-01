import { type PropsWithChildren, useRef, useEffect } from "react";
import { View, PanResponder } from "react-native";

interface GestureHandlerProps extends PropsWithChildren {
  onSwipeLeft?: () => void;
  onSwipeRight?: () => void;
  onSwipeUp?: () => void;
  onSwipeDown?: () => void;

  dxThreshold?: number;
  dyThreshold?: number;
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
  const handlersRef = useRef({
    onSwipeLeft,
    onSwipeRight,
    onSwipeUp,
    onSwipeDown,
  });

  useEffect(() => {
    handlersRef.current = { onSwipeLeft, onSwipeRight, onSwipeUp, onSwipeDown };
  }, [onSwipeLeft, onSwipeRight, onSwipeUp, onSwipeDown]);

  const panResponder = useRef(
    PanResponder.create({
      onMoveShouldSetPanResponder: (_, gestureState) =>
        Math.abs(gestureState.dx) > dxThreshold ||
        Math.abs(gestureState.dy) > dyThreshold,

      onPanResponderRelease: (_, gestureState) => {
        const { dx, dy } = gestureState;

        if (Math.abs(dx) > Math.abs(dy)) {
          if (dx > 0) {
            const threshold = rightThreshold ?? dxThreshold;
            if (Math.abs(dx) > threshold) {
              console.log("Swiped right");
              handlersRef.current.onSwipeRight?.();
            }
          } else {
            const threshold = leftThreshold ?? dxThreshold;
            if (Math.abs(dx) > threshold) {
              console.warn("Swiped left");
              handlersRef.current.onSwipeLeft?.();
            }
          }
        } else {
          if (dy > 0) {
            const threshold = downThreshold ?? dyThreshold;
            if (Math.abs(dy) > threshold) {
              handlersRef.current.onSwipeDown?.();
            }
          } else {
            const threshold = upThreshold ?? dyThreshold;
            if (Math.abs(dy) > threshold) {
              handlersRef.current.onSwipeUp?.();
            }
          }
        }
      },
    })
  ).current;

  return <View style={{ flex: 1 }} {...panResponder.panHandlers}>{children}</View>;
};
