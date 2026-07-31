import {Platform} from 'react-native';

const fontFamily = Platform.select({
  ios: undefined,
  android: 'Roboto',
}) as string | undefined;

export const Typography = {
  fontFamily,
  bold: {fontFamily, fontWeight: '700' as const},
  semibold: {fontFamily, fontWeight: '600' as const},
  medium: {fontFamily, fontWeight: '500' as const},
  regular: {fontFamily, fontWeight: '400' as const},
  black: {fontFamily, fontWeight: '800' as const},

  weight: {
    regular: '400' as const,
    medium: '500' as const,
    semibold: '600' as const,
    bold: '700' as const,
    black: '800' as const,
  },

  size: {
    xs: 11,
    sm: 13,
    base: 15,
    md: 17,
    lg: 20,
    xl: 24,
    xxl: 32,
    hero1: 34,
    hero2: 28,
    hero: 48,
  },

  xs: 11,
  sm: 13,
  base: 15,
  md: 17,
  lg: 20,
  xl: 24,
  xxl: 32,
  hero1: 34,
  hero2: 28,
  hero: 48,
};
