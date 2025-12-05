import React, { useEffect, useRef } from "react";
import { Animated, View, Text, type LayoutChangeEvent } from "react-native";
import type { ToastState } from "../store/slices/UI";

type AnimatedToastProps = {
  toast: ToastState;
  index: number;
  onRemove: () => void;
  markHidden: () => void;
  duration?: number;
};

export default function AnimatedToast({ toast, index, onRemove, duration, markHidden }: AnimatedToastProps) {
  const opacity = useRef(new Animated.Value(0)).current;
  const translateY = useRef(new Animated.Value(20)).current;

  const height = useRef(0);
  const timerRef = useRef<number | null>(null);

  const onLayout = (e: LayoutChangeEvent) => {
    height.current = e.nativeEvent.layout.height;
  };

  // ENTER
  useEffect(() => {
    Animated.parallel([
      Animated.timing(opacity, {
        toValue: 1,
        duration: 200,
        useNativeDriver: true,
      }),
      Animated.timing(translateY, {
        toValue: 0,
        duration: 200,
        useNativeDriver: true,
      }),
    ]).start();
  }, [opacity, translateY]);

  // Start auto-hide timer -> markHidden (NOT remove)
  useEffect(() => {
    // clear previous just to be safe
    if (timerRef.current) {
      clearTimeout(timerRef.current);
    }
    const ms = duration ?? 3000;
    timerRef.current = (setTimeout(() => {
      console.log(`[AnimatedToast] timeout -> markHidden id=${toast.id}`);
      markHidden();
    }, ms) as unknown) as number;

    return () => {
      if (timerRef.current) clearTimeout(timerRef.current);
    };
  }, [duration, markHidden, toast.id]);

  // React to visible flag: when visible -> nothing, when visible becomes false -> exit animation then onRemove
  useEffect(() => {
    if (toast.visible === false) {
      console.log(`[AnimatedToast] visible=false -> animate exit id=${toast.id}`);
      Animated.parallel([
        Animated.timing(opacity, { toValue: 0, duration: 160, useNativeDriver: true }),
        Animated.timing(translateY, { toValue: -8, duration: 160, useNativeDriver: true }),
      ]).start(() => {
        console.log(`[AnimatedToast] exit done -> onRemove id=${toast.id}`);
        onRemove();
      });
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [toast.visible]); // only care when visible changes

  return (
    <Animated.View
      onLayout={onLayout}
      style={{
        opacity,
        transform: [{ translateY }],
        marginBottom: 8, // <— das eigentliche Stacking!
      }}
    >
      <View
        style={{
          backgroundColor: toast.type === "error" ? "#ff4d4d" : "#333",
          padding: 18,
          borderRadius: 12,
          marginHorizontal: 20,
        }}
      >
        <Text style={{ color: "white", fontSize: 16 }}>{toast.message}</Text>
      </View>
    </Animated.View>
  );
}
