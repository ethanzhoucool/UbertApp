import {Platform} from 'react-native';

const fontFamily = Platform.select({
  ios: 'System',
  android: 'Roboto',
}) as string;

export const Typography = {
  fontFamily,
  bold: {fontFamily, fontWeight: '700' as const},
  medium: {fontFamily, fontWeight: '500' as const},
  regular: {fontFamily, fontWeight: '400' as const},

  xs: 11,
  sm: 13,
  base: 15,
  md: 17,
  lg: 20,
  xl: 24,
  xxl: 32,
  hero: 48,
};
