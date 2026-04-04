import React from 'react';
import {Text, TextStyle, StyleSheet} from 'react-native';
import {Colors, Typography} from '../../theme';

interface Props {
  children: React.ReactNode;
  variant?: 'hero' | 'title' | 'heading' | 'body' | 'caption' | 'label';
  color?: string;
  style?: TextStyle;
  numberOfLines?: number;
}

export function UbertText({
  children,
  variant = 'body',
  color,
  style,
  numberOfLines,
}: Props) {
  return (
    <Text
      style={[styles[variant], color ? {color} : null, style]}
      numberOfLines={numberOfLines}>
      {children}
    </Text>
  );
}

const styles = StyleSheet.create({
  hero: {
    fontSize: Typography.hero,
    fontWeight: '700',
    color: Colors.black,
    letterSpacing: 4,
  },
  title: {
    fontSize: Typography.xl,
    fontWeight: '700',
    color: Colors.black,
  },
  heading: {
    fontSize: Typography.lg,
    fontWeight: '700',
    color: Colors.black,
  },
  body: {
    fontSize: Typography.base,
    fontWeight: '400',
    color: Colors.gray700,
  },
  caption: {
    fontSize: Typography.sm,
    fontWeight: '400',
    color: Colors.gray500,
  },
  label: {
    fontSize: Typography.xs,
    fontWeight: '500',
    color: Colors.gray500,
    textTransform: 'uppercase',
    letterSpacing: 0.5,
  },
});
