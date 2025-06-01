import { useEffect, useRef } from "react";
import { Animated, Keyboard, Platform } from "react-native";

export const useKeyboardHandling = ({ initialImageHeight }: { initialImageHeight: number }) => {

    const imageHeight = useRef(new Animated.Value(initialImageHeight)).current;

    useEffect(() => {
      const keyboardWillShowListener = Keyboard.addListener(
        Platform.OS === 'ios' ? 'keyboardWillShow' : 'keyboardDidShow',
        event => {
          // Tastatur-Animation-Duration verwenden für perfekte Synchronisation
          const duration = Platform.OS === 'ios' ? event.duration : 250;

          Animated.timing(imageHeight, {
            toValue: 350,
            duration: duration,
            useNativeDriver: false,
          }).start();
        }
      );

      const keyboardWillHideListener = Keyboard.addListener(
        Platform.OS === 'ios' ? 'keyboardWillHide' : 'keyboardDidHide',
        event => {
          const duration = Platform.OS === 'ios' ? event.duration : 250;

          Animated.timing(imageHeight, {
            toValue: 400,
            duration: duration,
            useNativeDriver: false,
          }).start();
        }
      );

      return () => {
        keyboardWillShowListener.remove();
        keyboardWillHideListener.remove();
      };
    }, [imageHeight]);
  
    return { imageHeight };

};  