import { SafeAreaView, type ViewProps, StyleSheet } from 'react-native';

import { useThemeColor } from '@/src/common/hooks/useThemeColor';

export type ThemedViewProps = ViewProps & {
  lightColor?: string;
  darkColor?: string;
};

export function ThemedView({ style, lightColor, darkColor, ...otherProps }: ThemedViewProps) {
  const backgroundColor = useThemeColor({ light: lightColor, dark: darkColor }, 'background');

  return <SafeAreaView style={[componentStyles.container, { backgroundColor }, style]} {...otherProps} />;
}

const componentStyles = StyleSheet.create({
  container: {
    flex: 1,
  },
});