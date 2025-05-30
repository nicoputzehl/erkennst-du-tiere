import { SafeAreaView, type ViewProps, StyleSheet } from 'react-native';
import { useColorScheme } from '@/src/common/hooks/useColorScheme';
import { LinearGradient } from 'expo-linear-gradient';
import { Colors } from '@/src/common/constants/Colors';

export type ThemedViewProps = ViewProps & {
  lightColor?: string;
  darkColor?: string;
  gradientColors?: {
    light: [string, string, ...string[]];
    dark: [string, string, ...string[]];
  };
  gradientType?: 'primary' | 'secondary' | 'neutral' | 'success';
};

export function ThemedView({ 
  style, 
  lightColor, 
  darkColor, 
  gradientColors,
  gradientType = 'primary',
  ...otherProps 
}: ThemedViewProps) {
  const colorScheme = useColorScheme();

  // Gradient-Farben aus Colors-Konstante
  const getGradientColors = (): [string, string, ...string[]] => {
    if (gradientColors) {
      return gradientColors[colorScheme ?? 'light'];
    }
    
    // Fallback auf Colors-Konstante basierend auf gradientType
    const isDark = colorScheme === 'dark';
    const colors = isDark ? Colors.dark : Colors.light;
    
    switch (gradientType) {
      case 'secondary':
        return colors.gradientSecondary as [string, string, ...string[]];
      case 'neutral':
        return colors.gradientNeutral as [string, string, ...string[]];
      case 'success':
        return colors.gradientSuccess as [string, string, ...string[]];
      default:
        return colors.gradientPrimary as [string, string, ...string[]];
    }
  };

  const currentGradientColors = getGradientColors();

  return (
    <LinearGradient
      colors={currentGradientColors}
      style={{ flex: 1 }}
      start={{ x: 0, y: 0 }}
      end={{ x: 0, y: 1 }}
    >
      <SafeAreaView style={[componentStyles.container, style]} {...otherProps} />
    </LinearGradient>
  );
}

const componentStyles = StyleSheet.create({
  container: {
    flex: 1,
  },
});