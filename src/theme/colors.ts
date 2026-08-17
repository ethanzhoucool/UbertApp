export const LightColors = {
  black: '#000000',
  white: '#FFFFFF',

  gray100: '#F1F2F4',
  gray200: '#E5E7EB',
  gray300: '#DDDDDD',
  gray500: '#6B6B6B',
  gray700: '#545454',
  gray900: '#1A1A1A',

  accent: '#276EF1',
  accentLight: '#EBF2FF',

  success: '#05944F',
  error: '#E11900',
  danger: '#E11900',
  starYellow: '#FFC043',

  // Brand surfaces
  eatsGreen: '#06C167',
  uberOneGold: '#E8C547',
  muted: '#6B6B6B',
  fieldFill: '#F6F6F6',
  hairline: '#E5E5E5',

  overlay: 'rgba(0,0,0,0.5)',
  mapOverlay: 'rgba(0,0,0,0.15)',

  // Semantic tokens (preferred over raw grays for theme-aware code)
  background: '#FFFFFF',
  surface: '#FFFFFF',
  surfaceAlt: '#F1F2F4',
  surfaceMuted: '#F1F2F4',
  border: '#E5E7EB',
  borderSubtle: '#EEEEEE',
  textPrimary: '#000000',
  textSecondary: '#545454',
  textTertiary: '#6B6B6B',
  iconPrimary: '#000000',
  iconSecondary: '#6B6B6B',
  pillBackground: '#000000',
  pillText: '#FFFFFF',
  handleColor: '#D8DADC',
  closeBtnBg: '#F1F2F4',
  modalBackdrop: 'rgba(0,0,0,0.45)',
  promoReserveBg: '#F2EFE9',
  promoExploreBg: '#E8EEF7',
};

export const DarkColors: typeof LightColors = {
  black: '#FFFFFF',
  white: '#0A0A0A',

  gray100: '#1F1F1F',
  gray200: '#2A2A2A',
  gray300: '#3A3A3A',
  gray500: '#9A9A9A',
  gray700: '#B5B5B5',
  gray900: '#D8D8D8',

  accent: '#4D8BF5',
  accentLight: '#1A2540',

  success: '#34C77B',
  error: '#FF4D3D',
  danger: '#FF4D3D',
  starYellow: '#FFC043',

  // Brand surfaces (kept brand-true on dark too; muted slightly for contrast)
  eatsGreen: '#06C167',
  uberOneGold: '#E8C547',
  muted: '#9A9A9A',
  fieldFill: '#1F1F1F',
  hairline: '#2A2A2A',

  overlay: 'rgba(0,0,0,0.65)',
  mapOverlay: 'rgba(0,0,0,0.30)',

  background: '#0A0A0A',
  surface: '#141414',
  surfaceAlt: '#1F1F1F',
  surfaceMuted: '#1F1F1F',
  border: '#2A2A2A',
  borderSubtle: '#222222',
  textPrimary: '#FFFFFF',
  textSecondary: '#D0D0D0',
  textTertiary: '#9A9A9A',
  iconPrimary: '#FFFFFF',
  iconSecondary: '#9A9A9A',
  pillBackground: '#FFFFFF',
  pillText: '#0A0A0A',
  handleColor: '#3A3A3A',
  closeBtnBg: '#1F1F1F',
  modalBackdrop: 'rgba(0,0,0,0.65)',
  promoReserveBg: '#2A2620',
  promoExploreBg: '#1E2632',
};

export type ColorPalette = typeof LightColors;

// Default export = light palette. Module-level callers (i.e. code that
// can't use the useColors() hook) get a sensible default. Theme-aware
// components should pull `useColors()` from the ThemeContext instead.
export const Colors: ColorPalette = LightColors;
