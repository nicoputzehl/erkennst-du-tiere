const tintColorLight = '#0a7ea4';
const tintColorDark = '#64B5F6';

const tintColorOnGradientLight = '#1A365D';
const tintColorOnGradientDark = '#E2E8F0';

// #2D3748
export const Colors = {
  light: {
    text: '#FFFFFF', // Weiß für bessere Sichtbarkeit auf Gradient
    background: '#fff',
    tint: tintColorLight,
    tintOnGradient: tintColorOnGradientLight,
    icon: '#FFFFFF',
    tabIconDefault: '#687076',
    tabIconSelected: tintColorLight,
    // Gradient-Farben für Light Mode
    gradientPrimary: ['#5F8AE1', '#7A9EE8', '#A8C5F0'] as [string, string, ...string[]],
    gradientSecondary: ['#FF6B6B', '#FFE66D', '#FF8E53'] as [string, string, ...string[]], // Warm-Gradient
    gradientNeutral: ['#E8EAF6', '#C5CAE9', '#9FA8DA'] as [string, string, ...string[]], // Neutral-Gradient
    gradientSuccess: ['#66BB6A', '#81C784', '#A5D6A7'] as [string, string, ...string[]], // Erfolg-Gradient
  },
  dark: {
    text: '#ECEDEE',
    background: '#151718',
    tint: tintColorDark,
    tintOnGradient: tintColorOnGradientDark,
    icon: '#ECEDEE',
    tabIconDefault: '#9BA1A6',
    tabIconSelected: tintColorDark,
    // Gradient-Farben für Dark Mode
    gradientPrimary: ['#1a1a2e', '#16213e', '#0f3460'] as [string, string, ...string[]],
    gradientSecondary: ['#2C1810', '#3D2817', '#4A3728'] as [string, string, ...string[]], // Warmer Dark-Gradient
    gradientNeutral: ['#2E2E2E', '#3A3A3A', '#464646'] as [string, string, ...string[]], // Neutraler Dark-Gradient
    gradientSuccess: ['#1B5E20', '#2E7D32', '#388E3C'] as [string, string, ...string[]], // Erfolg Dark-Gradient
  },
};